package com.xforceplus.hades.dao;

import com.xforceplus.hades.interfaceMgmt.domain.InterfaceRunSchedule;

public interface InterfaceRunScheduleMapper {
    int deleteByPrimaryKey(Integer id);

    int insert(InterfaceRunSchedule record);

    int insertSelective(InterfaceRunSchedule record);

    InterfaceRunSchedule selectByPrimaryKey(Integer id);

    int updateByPrimaryKeySelective(InterfaceRunSchedule record);

    int updateByPrimaryKey(InterfaceRunSchedule record);
}