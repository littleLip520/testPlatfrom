package com.xforceplus.hades.service;

import com.xforceplus.hades.interfaceMgmt.domain.TestSuiteScript;
import com.xforceplus.hades.interfaceMgmt.domain.TestSuiteScriptDetail;
import com.xforceplus.hades.interfaceMgmt.response.BatchScriptResponse;
import com.xforceplus.hades.interfaceMgmt.response.SuiteScriptListResponse;
import com.xforceplus.hades.util.Response;

import java.util.List;

public interface SuiteScriptService {
    /**
     * 添加测试集脚本
     * @param
     * @return
     */
    public Response addSuiteScript(TestSuiteScript suiteScript);

    /**
     * 删除测试集脚本
     * @param
     * @return
     */
    public Response deleteSuiteScript(Integer id);

    /**
     * 单个运行执行测试集脚本
     * @param
     * @return
     */
    public Response SingleScriptExecute(Integer id);

    /**
     * 批量运行执行测试集脚本
     * @param
     * @return
     */
    public Response<BatchScriptResponse> BatchScriptExecute(List idList);

    /** 分页
     * 测试集脚本列表查询
     * @param
     * @return
     */
    public Response<SuiteScriptListResponse> getSuiteScripts(Integer pageNum, Integer pageSize );

    /** 分页
     * 检查点详情列表查询
     * @param
     * @return
     */
    public Response<TestSuiteScriptDetail> getScriptDetial(Integer pageNum, Integer pageSize);

}
