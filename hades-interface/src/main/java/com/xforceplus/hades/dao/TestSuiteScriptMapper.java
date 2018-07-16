package com.xforceplus.hades.dao;

import com.xforceplus.hades.interfaceMgmt.domain.TestSuiteScript;

public interface TestSuiteScriptMapper {
    int deleteByPrimaryKey(Integer id);

    int insert(TestSuiteScript record);

    int insertSelective(TestSuiteScript record);

    TestSuiteScript selectByPrimaryKey(Integer id);

    int updateByPrimaryKeySelective(TestSuiteScript record);

    int updateByPrimaryKey(TestSuiteScript record);
}