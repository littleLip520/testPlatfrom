package com.xforceplus.hades.controller;

import com.xforceplus.hades.interfaceMgmt.request.suite.SuiteScriptRequestAdd;
import com.xforceplus.hades.util.Response;
import io.swagger.annotations.ApiOperation;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.HttpServletRequest;

@RestController
@RequestMapping("/api/v1")
public class InterfaceTestSuiteController {

    @PostMapping("/addSuiteScript")
    @ApiOperation(value = "添加测试集脚本")
    public Response addSuiteScript(@RequestBody SuiteScriptRequestAdd scriptRequestAdd, HttpServletRequest request){
        return null;
    }

}
