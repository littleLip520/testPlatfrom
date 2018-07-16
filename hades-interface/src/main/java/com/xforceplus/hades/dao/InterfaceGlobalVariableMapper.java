package com.xforceplus.hades.dao;

import com.xforceplus.hades.interfaceMgmt.domain.InterfaceGlobalVariable;

import java.util.List;

public interface InterfaceGlobalVariableMapper {
    int deleteByPrimaryKey(Integer id);

    int insert(InterfaceGlobalVariable record);

    int insertSelective(InterfaceGlobalVariable record);

    InterfaceGlobalVariable selectByPrimaryKey(Integer id);

    int updateByPrimaryKeySelective(InterfaceGlobalVariable record);

    int updateByPrimaryKey(InterfaceGlobalVariable record);

    List<InterfaceGlobalVariable> getByCondition(InterfaceGlobalVariable condition);

    List<InterfaceGlobalVariable> getListByIds(List<Integer> list);
}