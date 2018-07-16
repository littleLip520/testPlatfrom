package com.xforceplus.hades.dao;

import com.xforceplus.hades.interfaceMgmt.domain.InterfaceExecuteResult;


public interface InterfaceExecuteResultMapper {
    int deleteByPrimaryKey(Integer id);

    int insert(InterfaceExecuteResult record);

    int insertSelective(InterfaceExecuteResult record);

    InterfaceExecuteResult selectByPrimaryKey(Integer id);

    int updateByPrimaryKeySelective(InterfaceExecuteResult record);

    int updateByPrimaryKeyWithBLOBs(InterfaceExecuteResult record);

    int updateByPrimaryKey(InterfaceExecuteResult record);
}