package com.xforceplus.hades.service.impl;

import com.github.pagehelper.PageHelper;
import com.xforceplus.hades.dao.EnvironmentConfigMapper;
import com.xforceplus.hades.interfaceMgmt.domain.BriefEnvInfo;
import com.xforceplus.hades.interfaceMgmt.domain.EnvironmentConfig;
import com.xforceplus.hades.interfaceMgmt.response.EnvCommonListResponse;
import com.xforceplus.hades.interfaceMgmt.response.EnvironmentListResponse;
import com.xforceplus.hades.service.InterfaceEnvironmentService;
import com.xforceplus.hades.util.Response;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;


import java.util.List;

@Service
public class InterfaceEnvironmentServiceimpl implements InterfaceEnvironmentService {
    @Autowired
    private EnvironmentConfigMapper configMapper;
    @Override
    public Response createEnvironmentConfig(EnvironmentConfig environmentConfig) {
        try{
            configMapper.insert(environmentConfig);
            return Response.successResponse();
        }catch (Exception e){
            e.printStackTrace();
            return Response.fail("创建失败");
        }

    }

    @Override
    public Response updateEnvironmentConfig(EnvironmentConfig environmentConfig) {
        int flag = configMapper.updateByCondition(environmentConfig);
        if(flag==1){
            return Response.successResponse();
        }else {
            return Response.fail("删除失败");

        }
    }

    @Override
    @Transactional
    public Response deleteEnvironmentConfig(EnvironmentConfig environmentConfig) {
        int flag = configMapper.updateByCondition(environmentConfig);
        if(flag==1){
            return Response.successResponse();
        }else {
            return Response.fail("删除失败");

        }
    }

    @Override
    public Response<EnvironmentListResponse> getEnvironmentList(Integer pageNum, Integer pageSize) {
        PageHelper.startPage(pageNum, pageSize);
        try{
            List<BriefEnvInfo> briefEnvInfo=configMapper.getEnvironmentList();
            EnvironmentListResponse environmentListResponse=new EnvironmentListResponse();
            environmentListResponse.setTotal(configMapper.getEnvironmentCount());
            environmentListResponse.setEnvList(briefEnvInfo);
            return Response.successResponse(environmentListResponse);
        }catch (Exception e){
            e.printStackTrace();
            return Response.fail("查询失败");
        }
    }

    @Override
    public Response<EnvCommonListResponse> getEnvironmentList() {
        List<EnvironmentConfig> environmentConfig = configMapper.listAll();

            EnvCommonListResponse commonList=new EnvCommonListResponse();
            commonList.setEnvList(environmentConfig);
            return Response.success("查询成功",commonList);


    }
}
