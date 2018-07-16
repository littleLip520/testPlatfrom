package com.xforceplus.hades.controller;

import com.xforceplus.hades.common.UserSession;
import com.xforceplus.hades.common.request.PageRequest;
import com.xforceplus.hades.interfaceMgmt.domain.EnvironmentConfig;
import com.xforceplus.hades.interfaceMgmt.request.Environment.EnvironmentRequestAdd;
import com.xforceplus.hades.interfaceMgmt.request.Environment.EnvironmentRequestDelete;
import com.xforceplus.hades.interfaceMgmt.request.Environment.EnvironmentRequestUpdate;
import com.xforceplus.hades.interfaceMgmt.response.EnvCommonListResponse;
import com.xforceplus.hades.interfaceMgmt.response.EnvironmentListResponse;
import com.xforceplus.hades.service.InterfaceEnvironmentService;
import com.xforceplus.hades.util.Response;
import io.swagger.annotations.ApiOperation;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.BeansException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import java.lang.reflect.Executable;
import java.util.Date;

@RestController
@RequestMapping("/api/v1")
public class InterfaceEnvironmentController {
    @Autowired
    private InterfaceEnvironmentService environmentService;
    @PostMapping("/createEnvironmentConfig")
    @ApiOperation(value = "新增环境配置")
    public Response createEnvironmentConfig(@RequestBody EnvironmentRequestAdd requestAdd, HttpServletRequest request) throws Exception{
            EnvironmentConfig envConfig=new EnvironmentConfig();
            //赋值bean属性
            envConfig.setStatus(0);
            envConfig.setCreateTime(new Date());
            envConfig.setCreatUser(UserSession.getUserName(request));
            BeanUtils.copyProperties(requestAdd,envConfig);
            Response response=environmentService.createEnvironmentConfig(envConfig);
            return response;
    }

    @PostMapping("/updateEnvironmentConfig")
    @ApiOperation(value = "修改环境配置")
    public Response updateEnvironmentConfig(@RequestBody EnvironmentRequestUpdate requestUpdate,HttpServletRequest request) throws Exception{
        try {
            EnvironmentConfig envConfig=new EnvironmentConfig();
            //赋值bean属性
            BeanUtils.copyProperties(requestUpdate,envConfig);
            envConfig.setUpdateTime(new Date());
            envConfig.setCreatUser(UserSession.getUserName(request));
            Response response=environmentService.updateEnvironmentConfig(envConfig);
            return response;
        } catch (BeansException e) {
            e.printStackTrace();
            return Response.fail("修改失败");
        }
    }

    @PostMapping("/deleteEnvironmentConfig")
    @ApiOperation(value = "删除环境配置")
    public Response deleteEnvironmentConfig(@RequestBody EnvironmentRequestDelete requestDelete,HttpServletRequest request) throws Exception{
        try {
            EnvironmentConfig envConfig=new EnvironmentConfig();
            envConfig.setStatus(-99);
            envConfig.setId(requestDelete.getId());
            envConfig.setUpdateTime(new Date());
            envConfig.setCreatUser(UserSession.getUserName(request));
            Response response=environmentService.deleteEnvironmentConfig(envConfig);
            return response;
        } catch (BeansException e) {
            e.printStackTrace();
            return Response.fail("修改失败");
        }
    }
    @PostMapping("/getEnvironmentList")
    @ApiOperation(value = "分页查询环境列表")
    public Response<EnvironmentListResponse> getEnvironmentList(@RequestBody PageRequest request){

            Response<EnvironmentListResponse> response = environmentService.getEnvironmentList(request.getPageNum(),request.getPageSize());
            return response;

    }

    @GetMapping("/listAll")
    @ApiOperation(value = "分页查询环境列表")
    public Response<EnvCommonListResponse> getEnvironmentList(){

        try {
            Response<EnvCommonListResponse> response = environmentService.getEnvironmentList();
            return response;
        } catch (Exception e) {
            e.printStackTrace();
            return Response.fail("查询异常");
        }

    }
}
