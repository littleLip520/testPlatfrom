package com.xforceplus.hades.dao;

import com.xforceplus.hades.interfaceMgmt.domain.InterfaceCaseVariable;

import java.util.List;

public interface InterfaceCaseVariableMapper {
    int deleteByPrimaryKey(Integer id);

    int insert(InterfaceCaseVariable variable);

    int insertList(List<InterfaceCaseVariable> list);

    int insertSelective(InterfaceCaseVariable record);

    InterfaceCaseVariable selectByPrimaryKey(Integer id);

    int updateByCondition(InterfaceCaseVariable record);

    int updateByPrimaryKey(InterfaceCaseVariable record);

    List<InterfaceCaseVariable> getByCondition(InterfaceCaseVariable condition);
}