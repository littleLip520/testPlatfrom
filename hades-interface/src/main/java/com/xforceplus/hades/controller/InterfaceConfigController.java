package com.xforceplus.hades.controller;

import com.alibaba.fastjson.JSON;
import com.xforceplus.hades.common.UserSession;
import com.xforceplus.hades.interfaceMgmt.domain.InterfaceCase;
import com.xforceplus.hades.interfaceMgmt.domain.InterfaceConfig;
import com.xforceplus.hades.interfaceMgmt.request.config.ConfigUpDownRequest;
import com.xforceplus.hades.interfaceMgmt.request.config.InterfaceConfigSaveRequest;
import com.xforceplus.hades.service.InterfaceConfigService;
import com.xforceplus.hades.util.ConstantsUtil;
import com.xforceplus.hades.util.Response;
import io.swagger.annotations.ApiOperation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;


@RestController
@RequestMapping("/api/v1/config")
public class InterfaceConfigController {
    @Autowired
    private InterfaceConfigService configService;
    @Autowired
    private HttpServletRequest request;

    @GetMapping("/toConfigPage")
    @ApiOperation("配置页面")
    public Response<List<InterfaceConfig>> toConfigPage(Integer caseId){
        try {
            InterfaceCase condition = new InterfaceCase();
            condition.setId(caseId);
            List<InterfaceConfig> configList = configService.getByCondition(condition);
            return Response.successResponse(configList);
        } catch (Exception e) {
            e.printStackTrace();
            return Response.response(ConstantsUtil.CommonCode.FAILED_CODE,"failed");
        }
    }


    @PostMapping("/saveConfigService")
    @ApiOperation("保存接口服务")
    public Response saveConfig(@RequestBody InterfaceConfig config){
        try {
            config.setCreator(UserSession.getUserName(request));
            configService.saveAll(config);
            return Response.response(ConstantsUtil.CommonCode.SUCCESS_CODE, "success");
        } catch (Exception e) {
            e.printStackTrace();
            return Response.response(ConstantsUtil.CommonCode.FAILED_CODE, "failed");
        }
    }

    @PostMapping("/modifyConfig")
    @ApiOperation("修改前后置(只需id 和 position两个参数值)")
    public Response modifyConfig(@RequestBody InterfaceConfig config) {
        try {
            config.setUpdator(UserSession.getUserName(request));
            config.setUpdateTime(new Date());
            //数据库查询只保存至config表
            configService.updateById(config);
            return Response.response(ConstantsUtil.CommonCode.SUCCESS_CODE,"success");
        } catch (Exception e) {
            e.printStackTrace();
            return Response.fail("failed");
        }


    }

    @PostMapping("/configUpDown")
    @ApiOperation("配置上移下移")
    public Response configUpDown(@RequestBody ConfigUpDownRequest upDownRequest){
        try {
            String userName = UserSession.getUserName(request);
            InterfaceConfig current_config = configService.getById(upDownRequest.getConfigId());
            current_config.setUpdator(userName);
            int orders  = current_config.getOrders();
            InterfaceConfig new_config = new InterfaceConfig();
            new_config.setCaseId(current_config.getCaseId());
            new_config.setUpdator(userName);

            if("up".equals(upDownRequest.getOpertion())){
                //上移
                new_config.setOrders(orders -1);
                new_config = configService.selectConfig(new_config);
                new_config.setOrders(new_config.getOrders() +1);
                configService.updateById(new_config);
                //
                current_config.setOrders(orders -1);
            }else{
                //下移
                new_config.setOrders(orders + 1);
                new_config = configService.selectConfig(new_config);
                new_config.setOrders(new_config.getOrders() - 1);
                configService.updateById(new_config);
                //
                current_config.setOrders(orders +1);
            }

            configService.updateById(current_config);

            return Response.success("success");
        } catch (Exception e) {
            e.printStackTrace();
            return Response.fail("failed");
        }
    }

    @PostMapping("/delConfig")
    @ApiOperation("删除配置")
    public Response delConfig(Integer id){
        try {
            configService.deleteById(id);
            return Response.success("success");
        } catch (Exception e) {
            e.printStackTrace();
            return  Response.fail("failed");
        }
    }
}
