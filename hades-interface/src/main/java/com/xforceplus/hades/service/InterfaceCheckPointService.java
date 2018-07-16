package com.xforceplus.hades.service;

import com.xforceplus.hades.interfaceMgmt.domain.InterfaceCheckpoint;
import com.xforceplus.hades.interfaceMgmt.request.checkPoint.CheckpointRequestAdd;
import com.xforceplus.hades.interfaceMgmt.request.checkPoint.CheckpointRequestDelete;
import com.xforceplus.hades.interfaceMgmt.request.checkPoint.CheckpointRequestQuery;
import com.xforceplus.hades.interfaceMgmt.request.checkPoint.CheckpointRequestUpdate;
import com.xforceplus.hades.interfaceMgmt.response.InterfaceCheckPointListResponse;
import com.xforceplus.hades.interfaceMgmt.response.InterfaceCheckPointResponse;
import com.xforceplus.hades.util.Response;

import java.util.List;

public interface InterfaceCheckPointService {
    /**
     * 查询接口下所有检查点
     *
     */
    public List<InterfaceCheckPointListResponse> queryAllCheckPoint(Integer id);

    /**
     * 保存检查点
     * @param checkpoint 检查点对象
     */
    public Response saveCheckPoint(InterfaceCheckpoint checkpoint);
    /**
     * 修改检查点
     * @param checkpoint 检查点对象
     */
    public Response modifyCheckPoint(InterfaceCheckpoint checkpoint);

    /**
     * 删除检查点
     * @param checkpoint 检查点对象
     */
    public Response deleteCheckPoint(Integer id);

    /**
     * 查询检查点详情
     * @param checkpoint 数据库基础配置ID
     */
    public InterfaceCheckPointResponse queryCheckpointDetail(CheckpointRequestQuery checkpoint);
}
