package com.xforceplus.hades.dao;

import com.xforceplus.hades.interfaceMgmt.domain.InterfaceInfo;
import com.xforceplus.hades.interfaceMgmt.domain.InterfaceQueryBean;

import java.util.List;

public interface InterfaceInfoMapper {
    int deleteByPrimaryKey(Integer id);

    int insert(InterfaceInfo record);

    int insertSelective(InterfaceInfo record);

    InterfaceInfo selectByPrimaryKey(Integer id);
    InterfaceInfo getInterfaceInfo();

    List<InterfaceInfo> getInterfaceList(Integer serviceId);

    int updateByPrimaryKeySelective(InterfaceInfo record);

    int updateByPrimaryKey(InterfaceInfo record);

    List<InterfaceInfo> getInterfaceInfoList(Integer id);

    List<InterfaceQueryBean> getQueryList(Integer id);
    List<InterfaceQueryBean> listAll();
    int getTotal();
}