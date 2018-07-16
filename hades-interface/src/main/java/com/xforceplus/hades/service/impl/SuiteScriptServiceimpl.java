package com.xforceplus.hades.service.impl;

import com.github.pagehelper.PageHelper;
import com.xforceplus.hades.interfaceMgmt.domain.TestSuiteScript;
import com.xforceplus.hades.interfaceMgmt.domain.TestSuiteScriptDetail;
import com.xforceplus.hades.interfaceMgmt.response.BatchScriptResponse;
import com.xforceplus.hades.interfaceMgmt.response.SuiteScriptListResponse;
import com.xforceplus.hades.service.SuiteScriptService;
import com.xforceplus.hades.util.Response;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class SuiteScriptServiceimpl implements SuiteScriptService {
    @Override
    public Response addSuiteScript(TestSuiteScript suiteScript) {
        return null;
    }

    @Override
    public Response deleteSuiteScript(Integer id) {
        return null;
    }

    @Override
    public Response SingleScriptExecute(Integer id) {
        //同时记录检查点结果
        return null;
    }

    @Override
    public Response<BatchScriptResponse> BatchScriptExecute(List idList) {
        //同时记录检查点结果
        return null;
    }

    @Override
    public Response<SuiteScriptListResponse> getSuiteScripts(Integer pageNum, Integer pageSize) {
        PageHelper.startPage(pageNum, pageSize);
        return null;
    }

    @Override
    public Response<TestSuiteScriptDetail> getScriptDetial(Integer pageNum, Integer pageSize) {
        PageHelper.startPage(pageNum, pageSize);
        return null;
    }
}
