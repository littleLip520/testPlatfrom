package com.xforceplus.hades.dao;

import com.xforceplus.hades.interfaceMgmt.domain.InterfaceCheckpoint;

public interface InterfaceCheckpointMapper {
    int deleteByPrimaryKey(Integer id);

    int insert(InterfaceCheckpoint record);

    int insertSelective(InterfaceCheckpoint record);

    InterfaceCheckpoint selectByPrimaryKey(Integer id);

    int updateByCondition(InterfaceCheckpoint record);

    int updateByPrimaryKey(InterfaceCheckpoint record);
}