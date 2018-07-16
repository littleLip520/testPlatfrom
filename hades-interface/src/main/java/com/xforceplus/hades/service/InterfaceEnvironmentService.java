package com.xforceplus.hades.service;

import com.xforceplus.hades.interfaceMgmt.domain.EnvironmentConfig;
import com.xforceplus.hades.interfaceMgmt.response.EnvCommonListResponse;
import com.xforceplus.hades.interfaceMgmt.response.EnvironmentListResponse;
import com.xforceplus.hades.util.Response;

public interface InterfaceEnvironmentService {
    /**
     * 新建环境配置
     * @param
     * @return Response<>
     * @author
     */
    public Response createEnvironmentConfig (EnvironmentConfig environmentConfig);

    /**
     * 修改环境配置
     * @param
     * @return Response<>
     * @author
     */
    public Response updateEnvironmentConfig (EnvironmentConfig environmentConfig);

    /**
     * 删除环境配置
     * @param
     * @return Response<>
     * @author
     */
    public Response deleteEnvironmentConfig (EnvironmentConfig environmentConfig);

    /**
     * 获取环境列表（分页）
     * @param
     * @return Response<>
     * @author
     */
    public Response<EnvironmentListResponse> getEnvironmentList (Integer pageNum, Integer pageSize);

    /**
     * 获取环境列表
     * @param
     * @return Response<>
     * @author
     */
    public Response<EnvCommonListResponse> getEnvironmentList ();
}
