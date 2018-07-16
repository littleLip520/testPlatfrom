package com.xforceplus.hades.service;

import com.xforceplus.hades.interfaceMgmt.domain.InterfaceGlobalVariable;

import java.util.List;

public interface InterfaceGlobalVariableService {
    int deleteByPrimaryKey(Integer id);

    int insert(InterfaceGlobalVariable record);

    int insertSelective(InterfaceGlobalVariable record);

    InterfaceGlobalVariable selectByPrimaryKey(Integer id);

    int updateByPrimaryKeySelective(InterfaceGlobalVariable record);

    int updateByPrimaryKey(InterfaceGlobalVariable record);

    List<InterfaceGlobalVariable> pageList(Integer caseId, int pageNum, int pageSize);

    List<InterfaceGlobalVariable> getListByIds(List<Integer> globalVariableIds);
}
