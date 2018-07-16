package com.xforceplus.hades.controller;


import com.xforceplus.hades.interfaceMgmt.domain.InterfaceInfo;
import com.xforceplus.hades.interfaceMgmt.request.info.InterfaceInfoRequestAdd;
import com.xforceplus.hades.interfaceMgmt.request.info.InterfaceInfoRequestDelete;
import com.xforceplus.hades.interfaceMgmt.request.info.InterfaceInfoRequestQuery;
import com.xforceplus.hades.interfaceMgmt.request.info.InterfaceInfoRequestUpdate;
import com.xforceplus.hades.interfaceMgmt.response.InterfaceInfoListResponse;
import com.xforceplus.hades.interfaceMgmt.response.InterfaceListResponse;
import com.xforceplus.hades.management.response.ServiceListResponse;
import com.xforceplus.hades.management.response.SystemListResponse;
import com.xforceplus.hades.service.ExternalService;
import com.xforceplus.hades.service.InterfaceInfoService;
import com.xforceplus.hades.util.Response;
import io.swagger.annotations.ApiOperation;
import org.apache.commons.beanutils.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import java.util.Date;


@RestController
@RequestMapping("/api/v1")
public class InterfaceInfoController {
    @Autowired
    private ExternalService externalService;
    @Autowired
    private InterfaceInfoService interfaceInfoService;

    /**
     * 新增接口信息
     */
    @PostMapping("/addInterface")
    @ApiOperation(value = "新增接口信息")
    public Response addInterface(@RequestBody InterfaceInfoRequestAdd add, HttpServletRequest request) throws Exception {
        try {
            InterfaceInfo interfaceInfo = new InterfaceInfo();
            BeanUtils.copyProperties(interfaceInfo,add);
            interfaceInfo.setCreateTime(new Date());
            interfaceInfo.setCreator("lip");
            interfaceInfo.setVersion("1.0");
            interfaceInfo.setStatus(0);
            Response response = interfaceInfoService.createInterfaceInfo(interfaceInfo);
            return response;
        } catch (Exception e) {
            e.printStackTrace();
            return Response.fail("新增异常");
        }
    }

    /**
     * 新增接口信息
     */
    @PostMapping("/updateInterface")
    @ApiOperation(value = "修改接口信息")
    public Response updateInterface(@RequestBody InterfaceInfoRequestUpdate add, HttpServletRequest request) throws Exception {
        try {
            InterfaceInfo interfaceInfo = new InterfaceInfo();
            BeanUtils.copyProperties(add, interfaceInfo);
            interfaceInfo.setUpdater("lip");
            interfaceInfo.setUpdateTime(new Date());
            Response response = interfaceInfoService.updateInterfaceInfo(interfaceInfo);
            return response;
        } catch (Exception e) {
            e.printStackTrace();
            return Response.fail("修改接口信息异常");
        }
    }

    /**
     * 删除接口信息
     */
    @PostMapping("/deleteInterface")
    @ApiOperation(value = "删除接口信息")
    public Response deleteInterface(@RequestBody InterfaceInfoRequestDelete add, HttpServletRequest request) throws Exception {
        try {
            InterfaceInfo interfaceInfo = new InterfaceInfo();
            BeanUtils.copyProperties(add, interfaceInfo);
            interfaceInfo.setStatus(-99);
            Response response = interfaceInfoService.updateInterfaceInfo(interfaceInfo);
            return response;
        } catch (Exception e) {
            e.printStackTrace();
            return Response.fail("新增异常");
        }
    }


    /**
     * 获取接口信息列表
     */

    @PostMapping("/getInterfaceList")
    @ApiOperation(value = "获取接口信息列表")
    public Response<InterfaceInfoListResponse> getInterfaceList(@RequestBody InterfaceInfoRequestQuery queryInfo, HttpServletRequest request) throws Exception {
        try {
            if(queryInfo.getServiceId()==null){
                InterfaceInfoListResponse interfaceList = interfaceInfoService.getInterfaceList(queryInfo.getPageRequest().getPageNum(), queryInfo.getPageRequest().getPageSize());
                if(interfaceList.getQueryBeanList().size()>0){
                    return Response.success("查询成功",interfaceList);
                }else {
                    return Response.success("暂无数据");
                }
            }
            InterfaceInfoListResponse interfaceList = interfaceInfoService.getInterfaceList(queryInfo.getServiceId(), queryInfo.getPageRequest().getPageNum(), queryInfo.getPageRequest().getPageSize());
            if(interfaceList.getQueryBeanList().size()>0){
                return Response.success("查询成功",interfaceList);
            }else {
                return Response.success("暂无数据");
            }
        } catch (Exception e) {
            e.printStackTrace();
            return Response.fail("查询数据异常");
        }
    }

    /**
     * 获取所有接口
     */
    @PostMapping("/getInterfaceByServiceId/{id}")
    @ApiOperation(value = "根据应用ID获取接口")
    public Response<InterfaceListResponse> getListByServiceId(@PathVariable Integer id) throws Exception{
        try {
             Response response=  interfaceInfoService.getInterfaceList(id);
            return response;
        } catch (Exception e) {
            e.printStackTrace();
            return Response.fail("查询失败");
        }
    }

    /**
     * 获取系统信息列表
     */
    @PostMapping("/getSystemList")
    @ApiOperation(value = "获取系统信息列表")
    public Response<SystemListResponse> getSystemList() throws Exception {
        try {
            Response<SystemListResponse> systemList = externalService.getSystemList();
            return systemList;
        } catch (Exception e) {
            e.printStackTrace();
            return Response.fail("新增异常");
        }


    }
}