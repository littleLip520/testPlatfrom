package com.xforceplus.hades.service;


import com.xforceplus.hades.interfaceMgmt.domain.EnvironmentConfig;
import com.xforceplus.hades.interfaceMgmt.domain.InterfaceCase;

import com.xforceplus.hades.interfaceMgmt.response.EditPageInfoResponse;
import com.xforceplus.hades.interfaceMgmt.response.InterfaceCaseListResponse;
import com.xforceplus.hades.util.Response;

import java.util.List;

public interface InterfaceCaseService {
    /**
     * 新增接口用例
     * @param
     * @return Response<RoleAuthRsp>
     * @author
     */
    Response<Integer>  addScript(InterfaceCase interfaceCase) throws Exception;


    void createInterfaceCase(InterfaceCase interfaceCase);

    /**
     * 主键查询
     * @param id
     * @return
     */
    Response<InterfaceCase> getById(Integer id);

    /**
     * 根据脚本ID查询接口信息
     * @param id
     * @return
     */
    Response<EditPageInfoResponse> getEditPageByScriptId(Integer id);

    /**
     * 根据脚本ID查询环境信息
     * @param id
     * @return
     */
    Response<EnvironmentConfig> getEnvConfigByScriptId(Integer id);

    /**
     * 查询节点下的所有接口
     * @param serviceId 应用id
     * @return
     */
    List<InterfaceCaseListResponse> listCase(Integer serviceId);

    Integer count();

    /**
     * 分页查询
     * @param interfaceInfoId
     * @param pageNum
     * @param pageSize
     * @return
     */
    InterfaceCaseListResponse pageList(Integer interfaceInfoId,int pageNum, int pageSize);
    InterfaceCaseListResponse pageList(int pageNum, int pageSize);

    /**
     * 更新脚本参数(包括当前接口下的变量)
     * @param interfaceCase
     */
    Response updateScript(InterfaceCase interfaceCase);
}
