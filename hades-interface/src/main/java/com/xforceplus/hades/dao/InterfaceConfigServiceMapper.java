package com.xforceplus.hades.dao;

import com.xforceplus.hades.interfaceMgmt.domain.InterfaceConfigServices;
import com.xforceplus.hades.service.InterfaceConfigService;

import java.util.List;

public interface InterfaceConfigServiceMapper {
    int deleteByPrimaryKey(Integer id);

    int insert(InterfaceConfigServices record);

    int insertSelective(InterfaceConfigServices record);

    InterfaceConfigServices selectByPrimaryKey(Integer id);

    int updateByPrimaryKeySelective(InterfaceConfigServices record);

    int updateByPrimaryKey(InterfaceConfigServices record);

    List<InterfaceConfigService> selectAll(InterfaceConfigServices deleteConfig);

    void deleteByKey(InterfaceConfigServices deleteConfig);
}