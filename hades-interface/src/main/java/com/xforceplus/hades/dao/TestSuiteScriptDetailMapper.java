package com.xforceplus.hades.dao;

import com.xforceplus.hades.interfaceMgmt.domain.TestSuiteScriptDetail;

public interface TestSuiteScriptDetailMapper {
    int deleteByPrimaryKey(Integer id);

    int insert(TestSuiteScriptDetail record);

    int insertSelective(TestSuiteScriptDetail record);

    TestSuiteScriptDetail selectByPrimaryKey(Integer id);

    int updateByPrimaryKeySelective(TestSuiteScriptDetail record);

    int updateByPrimaryKey(TestSuiteScriptDetail record);
}