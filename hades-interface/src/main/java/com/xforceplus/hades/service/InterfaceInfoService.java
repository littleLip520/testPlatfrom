package com.xforceplus.hades.service;

import com.xforceplus.hades.interfaceMgmt.domain.InterfaceInfo;
import com.xforceplus.hades.interfaceMgmt.response.InterfaceInfoListResponse;
import com.xforceplus.hades.interfaceMgmt.response.InterfaceListResponse;
import com.xforceplus.hades.util.Response;

import java.util.List;

public interface InterfaceInfoService {

    /**
     * 新增接口信息
     * @param
     * @return Response<>
     * @author
     */
    Response createInterfaceInfo(InterfaceInfo interfaceCase) throws Exception;

    /**
     * 修改接口信息
     * @param
     * @return Response<>
     * @author
     */
    Response updateInterfaceInfo(InterfaceInfo interfaceCase) throws Exception;

    /**
     * 查询单个接口信息
     * @param
     * @return Response<>
     * @author
     */
    Response<InterfaceInfo> getInterfaceInfo(Integer id) throws Exception;

    /**分页
     * 查询接口信息列表
     * @param
     * @return Response<>
     * @author
     */
    InterfaceInfoListResponse getInterfaceList(Integer serviceId, Integer pageNum, Integer pageSize) throws Exception;
    InterfaceInfoListResponse getInterfaceList( Integer pageNum, Integer pageSize) throws Exception;

    /**
     * 获取最新接口信息ID
     * @param
     * @return Response<>
     * @author
     */
    InterfaceInfo getInterfaceInfo() throws Exception;

    /**
     * 获取所有接口
     * @param
     * @return Response<>
     * @author
     */
    Response<InterfaceListResponse> getInterfaceList(Integer serviceId) throws Exception;
}
