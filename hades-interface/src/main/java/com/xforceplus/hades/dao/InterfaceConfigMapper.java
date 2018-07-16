package com.xforceplus.hades.dao;

import com.xforceplus.hades.interfaceMgmt.domain.InterfaceCase;
import com.xforceplus.hades.interfaceMgmt.domain.InterfaceConfig;

import java.util.List;

public interface InterfaceConfigMapper {
    int deleteByPrimaryKey(Integer id);

    int insert(InterfaceConfig record);

    int insertSelective(InterfaceConfig record);

    InterfaceConfig selectByPrimaryKey(Integer id);

    int updateByPrimaryKeySelective(InterfaceConfig record);

    int updateByPrimaryKey(InterfaceConfig record);

    List<InterfaceConfig> getByCondition(InterfaceCase interfaceCase);

    Integer getConfigMaxOrders(Integer caseId);

    InterfaceConfig selectOne(InterfaceConfig config);
}