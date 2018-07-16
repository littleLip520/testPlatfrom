package com.xforceplus.hades.service.impl;

import com.xforceplus.hades.dao.InterfaceCheckpointMapper;
import com.xforceplus.hades.interfaceMgmt.domain.InterfaceCheckpoint;
import com.xforceplus.hades.interfaceMgmt.request.checkPoint.CheckpointRequestAdd;
import com.xforceplus.hades.interfaceMgmt.request.checkPoint.CheckpointRequestDelete;
import com.xforceplus.hades.interfaceMgmt.request.checkPoint.CheckpointRequestQuery;
import com.xforceplus.hades.interfaceMgmt.request.checkPoint.CheckpointRequestUpdate;
import com.xforceplus.hades.interfaceMgmt.response.InterfaceCheckPointListResponse;
import com.xforceplus.hades.interfaceMgmt.response.InterfaceCheckPointResponse;
import com.xforceplus.hades.service.InterfaceCheckPointService;
import com.xforceplus.hades.util.Response;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
@Service
public class InterfaceCheckPointServiceimpl implements InterfaceCheckPointService {
    @Autowired
    private InterfaceCheckpointMapper mapper;
    @Override
    public List<InterfaceCheckPointListResponse> queryAllCheckPoint(Integer id) {
        return null;
    }

    @Override
    public Response saveCheckPoint(InterfaceCheckpoint checkpoint) {
        int flag = mapper.insert(checkpoint);
        if (flag==1){
            return Response.successResponse();
        }else {
            return Response.fail("新增失败");
        }

    }

    @Override
    @Transactional
    public Response modifyCheckPoint(InterfaceCheckpoint checkpoint) {
        int flag = mapper.updateByCondition(checkpoint);
        if(flag==1){
            return Response.successResponse();
        }else {
         return Response.fail("更新检查点失败");
        }
    }

    @Override
    @Transactional
    public Response deleteCheckPoint(Integer id) {
        int flag = mapper.deleteByPrimaryKey(id);
        if(flag==1){
            return Response.successResponse();
        }else {
            return Response.fail("删除失败");
        }
    }

    @Override
    public InterfaceCheckPointResponse queryCheckpointDetail(CheckpointRequestQuery checkpoint) {
        return null;
    }
}
