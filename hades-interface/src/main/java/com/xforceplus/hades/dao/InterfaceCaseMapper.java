package com.xforceplus.hades.dao;



import com.xforceplus.hades.interfaceMgmt.domain.EnvironmentConfig;
import com.xforceplus.hades.interfaceMgmt.domain.InterfaceCase;
import com.xforceplus.hades.interfaceMgmt.domain.ScriptQueryBean;
import com.xforceplus.hades.interfaceMgmt.response.EditPageInfoResponse;
import com.xforceplus.hades.interfaceMgmt.response.InterfaceCaseListResponse;

import java.util.List;

public interface InterfaceCaseMapper {
    int deleteByPrimaryKey(Integer id);

    Integer insert(InterfaceCase record);

    int insertSelective(InterfaceCase record);

    InterfaceCase selectByPrimaryKey(Integer id);


    int updateByCondition(InterfaceCase record);

    int updateByPrimaryKey(InterfaceCase record);

    Integer save(InterfaceCase interfaceCase);

    List<InterfaceCaseListResponse> listScript(Integer interfaceInfoId);

    List<ScriptQueryBean> queryByInfoId(Integer id);

    Integer count();

    List<ScriptQueryBean> getAllScripts();


}