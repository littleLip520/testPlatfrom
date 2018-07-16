package com.xforceplus.hades.dao;

import com.xforceplus.hades.interfaceMgmt.domain.InterfaceConfigDb;

public interface InterfaceConfigDbMapper {
    int deleteByPrimaryKey(Integer id);

    int insert(InterfaceConfigDb record);

    int insertSelective(InterfaceConfigDb record);

    InterfaceConfigDb selectByPrimaryKey(Integer id);

    int updateByPrimaryKeySelective(InterfaceConfigDb record);

    int updateByPrimaryKey(InterfaceConfigDb record);
}