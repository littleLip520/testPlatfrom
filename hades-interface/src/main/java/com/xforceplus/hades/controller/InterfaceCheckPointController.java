package com.xforceplus.hades.controller;

import com.xforceplus.hades.interfaceMgmt.domain.InterfaceCheckpoint;
import com.xforceplus.hades.interfaceMgmt.request.checkPoint.CheckpointRequestAdd;
import com.xforceplus.hades.interfaceMgmt.request.checkPoint.CheckpointRequestDelete;
import com.xforceplus.hades.interfaceMgmt.request.checkPoint.CheckpointRequestUpdate;
import com.xforceplus.hades.service.InterfaceCheckPointService;
import com.xforceplus.hades.util.Response;
import io.swagger.annotations.ApiOperation;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.BeansException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1")
public class InterfaceCheckPointController {
    @Autowired
    private InterfaceCheckPointService checkPointService;
    /**
     * 新增检查点
     */
    @PostMapping("/saveCheckPoint")
    @ApiOperation(value = "新增检查点")
    public Response saveCheckPoint(@RequestBody CheckpointRequestAdd add){
        try {
            InterfaceCheckpoint checkpoint=new InterfaceCheckpoint();
            BeanUtils.copyProperties(add,checkpoint);
            Response response= checkPointService.saveCheckPoint(checkpoint);
            return response;
        } catch (BeansException e) {
            e.printStackTrace();
            return Response.fail("新增异常");
        }
    }
    /**
     * 修改检查点
     */
    @PostMapping("/updateCheckPoint")
    @ApiOperation(value = "修改检查点")
    public Response updateCheckPoint(@RequestBody CheckpointRequestUpdate update){
        try {
            InterfaceCheckpoint checkpoint=new InterfaceCheckpoint();
            BeanUtils.copyProperties(update,checkpoint);
            Response response= checkPointService.modifyCheckPoint(checkpoint);
            return response;
        } catch (BeansException e) {
            e.printStackTrace();
            return Response.fail("修改检查点异常");
        }
    }

    /**
     * 删除检查点
     */
    @PostMapping("/deleteCheckPoint")
    @ApiOperation(value = "删除检查点")
    public Response deleteCheckPoint(@RequestBody CheckpointRequestDelete update){

        try {
            Response response= checkPointService.deleteCheckPoint(Integer.parseInt(update.getId()));
            return response;
        } catch (NumberFormatException e) {
            e.printStackTrace();
            return Response.fail("删除异常");
        }
    }

    /**分页
     * 获取检查点列表
     */
    @PostMapping("/getCheckPointList")
    @ApiOperation(value = "获取检查点列表")
    public Response getCheckPointList(@RequestBody CheckpointRequestDelete update){
        InterfaceCheckpoint checkpoint=new InterfaceCheckpoint();
        BeanUtils.copyProperties(update,checkpoint);
        Response response= checkPointService.modifyCheckPoint(checkpoint);
        return response;
    }

}
