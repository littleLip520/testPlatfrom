package com.xforceplus.hades.controller;


import com.xforceplus.hades.common.UserSession;
import com.xforceplus.hades.interfaceMgmt.domain.EnvironmentConfig;
import com.xforceplus.hades.interfaceMgmt.domain.InterfaceCase;

import com.xforceplus.hades.interfaceMgmt.domain.InterfaceCaseVariable;
import com.xforceplus.hades.interfaceMgmt.request.interfacecase.*;
import com.xforceplus.hades.interfaceMgmt.response.EditPageInfoResponse;
import com.xforceplus.hades.interfaceMgmt.response.InterfaceCaseListResponse;
import com.xforceplus.hades.service.InterfaceCaseService;
import com.xforceplus.hades.service.InterfaceInfoService;
import com.xforceplus.hades.service.InterfaceVariableService;
import com.xforceplus.hades.util.Response;
import io.swagger.annotations.ApiOperation;
import org.apache.commons.beanutils.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import javax.servlet.http.HttpServletRequest;
import java.util.*;

@RestController
@RequestMapping("/api/v1/interfaceCase")
public class InterfaceCaseController {
    @Autowired
    private InterfaceCaseService interfaceCaseService;
    @Autowired
    HttpServletRequest request;
    @Autowired
    private InterfaceVariableService variableService;
    @Autowired
    private InterfaceInfoService infoService;

    /**
     * 新增脚本
     */
    @PostMapping("/addScript")
    @ApiOperation(value = "新增脚本")
    public Response<Integer> addScript(@RequestBody InterfaceCaseRequestAdd script,HttpServletRequest request){
        try {
            InterfaceCase interfaceCase=new InterfaceCase();
            BeanUtils.copyProperties(interfaceCase,script );
            interfaceCase.setCreateBy(UserSession.getUserName(request));
//            interfaceCase.setCreateBy("lip");
            interfaceCase.setCreateTime(new Date());
            interfaceCase.setStatus(0);
            Response<Integer> integerResponse = interfaceCaseService.addScript(interfaceCase);
            return Response.success("保存成功！",integerResponse.getData());
        } catch (Exception e) {
            e.printStackTrace();
            return Response.fail("保存失败！");
        }
    }

    /**
     * 更新脚本
     */
    @PostMapping("/updateScript")
    @ApiOperation(value = "修改脚本例")
    public Response updateScript(@RequestBody InterfaceCaseRequestUpdate script, HttpServletRequest request){
        try {
            InterfaceCase interfaceCase=new InterfaceCase();
            BeanUtils.copyProperties(interfaceCase,script );
            interfaceCase.setUpdateBy(UserSession.getUserName(request));
//            interfaceCase.setUpdateBy("lip");
            interfaceCase.setUpdateTime(new Date());
            return   interfaceCaseService.updateScript(interfaceCase);
        } catch (Exception e) {
            e.printStackTrace();
            return Response.fail("更新失败！");
        }
    }

    /**
     * 删除脚本
     */
    @PostMapping("/deleteScriptById")
    @ApiOperation(value = "修改脚本例")
    public Response deleteScriptById(@RequestBody InterfaceCaseRequestDelete script, HttpServletRequest request){
        try {
            InterfaceCase interfaceCase=new InterfaceCase();

            interfaceCase.setUpdateBy(UserSession.getUserName(request));
            interfaceCase.setStatus(-99);
            interfaceCase.setId(script.getId());
//            interfaceCase.setUpdateBy("lip");
            interfaceCase.setUpdateTime(new Date());
            return interfaceCaseService.updateScript(interfaceCase);
        } catch (Exception e) {
            e.printStackTrace();
            return Response.fail("删除失败！");
        }
    }

    /**
     * 通过脚本ID查询编辑页面信息
     */
    @PostMapping("/getEditPageByScriptId")
    @ApiOperation(value = "通过脚本ID查询接口信息")
    public Response<EditPageInfoResponse> getEditPageByScriptId(@RequestBody InterfaceCaseRequestDelete script){
        try {
            return interfaceCaseService.getEditPageByScriptId(script.getId());
        } catch (Exception e) {
            e.printStackTrace();
            return Response.fail("查询异常！");
        }
    }



    @GetMapping("/listCase")
    @ApiOperation(value = "获取当前目录下接口")
    public Response<List<InterfaceCaseListResponse>> listCase(Integer interfaceInfoId){
        List<InterfaceCaseListResponse> caseList = interfaceCaseService.listCase(interfaceInfoId);
        //InterfaceCaseListResponse response = new InterfaceCaseListResponse();
        //response.setCaseList(caseList);
        return Response.successResponse(caseList);
    }


    /**
     * 分页获取脚本列表
     */
    @PostMapping("/pageList")
    @ApiOperation(value = "分页获取需求列表")
    public Response<InterfaceCaseListResponse> caseByPage(@RequestBody InterfaceCasePageRequest pageRequest) {
        try {
            //接口ID为空则返回所有脚本数据
            if(pageRequest.getInterfaceInfoId()==null){
                InterfaceCaseListResponse scriptList = interfaceCaseService.pageList(pageRequest.getPageRequest().getPageNum(), pageRequest.getPageRequest().getPageSize());
                if(scriptList.getQueryBeanList().size()>0){
                    return Response.success("查询成功",scriptList);

                }else {
                    return Response.successResponse("暂无数据");
                }

            }
            //返回对应接口数据
            InterfaceCaseListResponse scriptList = interfaceCaseService.pageList(pageRequest.getInterfaceInfoId(),pageRequest.getPageRequest().getPageNum(), pageRequest.getPageRequest().getPageSize());
            if(scriptList.getQueryBeanList().size()>0){
                return Response.success("查询成功",scriptList);

            }else {
                return Response.successResponse("暂无数据");

            }

        } catch (Exception e) {
            e.printStackTrace();
            return Response.fail("查询脚本异常");
        }
    }

    /**
     * 编辑页面保存脚本信息
     */
    @PostMapping("/saveEditPage")
    @ApiOperation(value = "保存脚本页面")
    public Response saveEditPage(@RequestBody InterfaceCaseEditRequestSave editSave,HttpServletRequest request ) throws Exception{
        try {
            //更新脚本
            InterfaceCase script=new InterfaceCase();
            script.setId(editSave.getId());
            script.setRequestMode(editSave.getRequestMode());
            script.setRequestMessage(editSave.getRequestMessage());
            script.setRequestUri(editSave.getRequestUri());
            script.setInterfaceType(editSave.getInterfaceType());
            script.setUpdateTime(new Date());
            script.setUpdateBy(UserSession.getUserName(request));
            Response response = interfaceCaseService.updateScript(script);
            //脚本更新成功继续新建/插入变量表
            if(response.getStatus().equals("0")){
                for (InterfaceCaseVariable variable:editSave.getVariableList()){
                    if(variable.getId()==null){
                        //新增变量
                        variable.setStatus(0);
                        variable.setCaseId(editSave.getId());
                        variable.setCreateBy(UserSession.getUserName(request));
//                        variable.setCreateBy("Lip");
                        variable.setCreateTime(new Date());
                        Response insertVariableResponse = variableService.insert(variable);
                        if(insertVariableResponse.getStatus().equals("0")){
                            continue;
                        }else {
                            return insertVariableResponse;
                        }
                    }
                    else {
                        //更新变量信息
                        variable.setUpdateBy(UserSession.getUserName(request));
//                        variable.setUpdateBy("lip");
                        variable.setUpdateTime(new Date());
                        Response updateVariableResponse = variableService.updateByConditioin(variable);
                        if(updateVariableResponse.getStatus().equals("0")){
                            continue;
                        }else {
                            return updateVariableResponse;
                        }
                    }
                }
                return Response.success("更新脚本成功");
            }else {
                return Response.fail("更新脚本失败");
            }
        } catch (Exception e) {
            e.printStackTrace();
            return Response.fail("更新脚本异常");
        }
    }

    /**
     * 通过脚本ID环境配置信息
     */
    @PostMapping("/getEnvConfigByScriptId")
    @ApiOperation(value = "通过脚本ID查询接口信息")
    public Response<EnvironmentConfig> getEnvConfigByScriptId(@RequestBody InterfaceCaseRequestDelete script){
        try {
            return interfaceCaseService.getEnvConfigByScriptId(script.getId());
        } catch (Exception e) {
            e.printStackTrace();
            return Response.fail("查询异常！");

        }
    }




}
