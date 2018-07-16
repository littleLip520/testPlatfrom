package com.xforceplus.hades.controller;


import com.xforceplus.hades.interfaceMgmt.request.variable.VariableRequestDelete;
import com.xforceplus.hades.service.InterfaceVariableService;
import com.xforceplus.hades.util.Response;
import io.swagger.annotations.ApiOperation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;


@RestController
@RequestMapping("/api/v1/interfaceVariable")
public class InterfaceVariableController {
    @Autowired
    private InterfaceVariableService interfaceVariableService;

    @PostMapping("/deleteVariable")
    @ApiOperation("删除变量")
    public Response delete(@RequestBody VariableRequestDelete  delete){
        try {
            Response response = interfaceVariableService.deleteById(delete.getId());
            return response;
        } catch (Exception e) {
            e.printStackTrace();
            return Response.fail("删除异常");
        }
    }

}
