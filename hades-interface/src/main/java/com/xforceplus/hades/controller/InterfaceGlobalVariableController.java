package com.xforceplus.hades.controller;

import com.xforceplus.hades.common.UserSession;
import com.xforceplus.hades.interfaceMgmt.domain.InterfaceGlobalVariable;
import com.xforceplus.hades.interfaceMgmt.request.variable.GlobalVariableIdsRequest;
import com.xforceplus.hades.interfaceMgmt.request.variable.GlobalVariableListRequest;
import com.xforceplus.hades.service.InterfaceGlobalVariableService;
import com.xforceplus.hades.util.Response;
import io.swagger.annotations.ApiOperation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.HttpServletRequest;
import java.util.Date;
import java.util.List;

@RestController
@RequestMapping("/api/v1/globalVariable")
public class InterfaceGlobalVariableController {
    @Autowired
    private HttpServletRequest request;

    @Autowired
    private InterfaceGlobalVariableService globalVariableService;


    @PostMapping("/deleteGlobalVariable")
    @ApiOperation("删除单个全局变量")
    public Response deleteVariable(Integer id) {
        try {
            globalVariableService.deleteByPrimaryKey(id);
            return Response.success("success");
        } catch (Exception e) {
            e.printStackTrace();
            return Response.fail("failed");
        }
    }

    @PostMapping("/saveGlobalVariable")
    @ApiOperation("保存全局变量")
    public Response saveGlobalVariable(@RequestBody InterfaceGlobalVariable globalVariable){
        try {
            if (globalVariable.getId()!=null){
                globalVariable.setCreateTime(new Date());
                globalVariable.setCreator(UserSession.getUserName(request));
                globalVariableService.updateByPrimaryKeySelective(globalVariable);
            }else {
                globalVariable.setUpdateTime(new Date());
                globalVariable.setUpdator(UserSession.getUserName(request));
                globalVariableService.insert(globalVariable);
            }
            return Response.success("success");
        } catch (Exception e) {
            e.printStackTrace();
            return Response.fail("failed");
        }

    }
    @PostMapping("/pageListGlobalVariable")
    @ApiOperation("分页查询全局变量")
    public Response<List<InterfaceGlobalVariable>> pageList(@RequestBody GlobalVariableListRequest globalVariableListRequest){
        try {
            List<InterfaceGlobalVariable> globalVariableList = globalVariableService.pageList(globalVariableListRequest.getCaseId(),globalVariableListRequest.getPageRequest().getPageNum(),globalVariableListRequest.getPageRequest().getPageSize());
            return Response.successResponse(globalVariableList);
        } catch (Exception e) {
            e.printStackTrace();
            return Response.fail("failed");
        }
    }


    @PostMapping("/getGlobalVariableList")
    @ApiOperation("编辑页面添加全局变量的查询")
    public Response<List<InterfaceGlobalVariable>> getGlobalVariableList(@RequestBody GlobalVariableIdsRequest globalVariableIdsRequest){
        try {
            List<InterfaceGlobalVariable> globalVariableList = globalVariableService.getListByIds(globalVariableIdsRequest.getGlobalVariableIds());
            return Response.successResponse(globalVariableList);
        } catch (Exception e) {
            e.printStackTrace();
            return Response.fail("failed");
        }
    }
}
