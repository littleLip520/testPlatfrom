package com.xforceplus.hades.service.impl;

import com.github.pagehelper.PageHelper;
import com.xforceplus.hades.dao.InterfaceInfoMapper;
import com.xforceplus.hades.interfaceMgmt.domain.InterfaceInfo;
import com.xforceplus.hades.interfaceMgmt.domain.InterfaceQueryBean;
import com.xforceplus.hades.interfaceMgmt.response.InterfaceInfoListResponse;
import com.xforceplus.hades.interfaceMgmt.response.InterfaceListResponse;
import com.xforceplus.hades.service.InterfaceInfoService;
import com.xforceplus.hades.util.Response;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class InterfaceInfoServiceimpl implements InterfaceInfoService {

    @Autowired
    private InterfaceInfoMapper interfaceInfoMapper;
    @Override
    public Response createInterfaceInfo(InterfaceInfo interfaceCase) throws Exception {
        int flag = interfaceInfoMapper.insert(interfaceCase);
        if(flag==1){
            return Response.success("创建成功");
        }else {
            return Response.fail("创建失败");
        }

    }

    @Override
    @Transactional
    public Response updateInterfaceInfo(InterfaceInfo interfaceCase) throws Exception {
        int flag = interfaceInfoMapper.updateByPrimaryKey(interfaceCase);
        if(flag==1){
            return Response.success("修改成功");
        }else {
            return Response.fail("修改失败");
        }
    }

    @Override
    public Response<InterfaceInfo> getInterfaceInfo(Integer id) throws Exception {
        return null;
    }

    @Override
    public InterfaceInfoListResponse getInterfaceList(Integer serviceId, Integer pageNum, Integer pageSize) throws Exception {
        PageHelper.startPage(pageNum, pageSize);

            //查询接口对应的应用及系统信息
            List<InterfaceQueryBean> queryList = interfaceInfoMapper.getQueryList(serviceId);

//            List<InterfaceInfo> infoList=interfaceInfoMapper.getInterfaceInfoList(serviceId);
            InterfaceInfoListResponse response=new InterfaceInfoListResponse();
            response.setQueryBeanList(queryList);
            response.setTotal(queryList.size());
            return response;


    }

    @Override
    public InterfaceInfoListResponse getInterfaceList(Integer pageNum, Integer pageSize) throws Exception {
        //查询所有接口信息
        List<InterfaceQueryBean> QueryBeanList = interfaceInfoMapper.listAll();
        InterfaceInfoListResponse response=new InterfaceInfoListResponse();
        response.setQueryBeanList(QueryBeanList);
        response.setTotal(QueryBeanList.size());
        return response;
    }

    @Override
    public InterfaceInfo getInterfaceInfo() throws Exception {
        InterfaceInfo interfaceInfo = interfaceInfoMapper.getInterfaceInfo();

        return interfaceInfo;
    }

    @Override
    public Response<InterfaceListResponse> getInterfaceList(Integer serviceId) throws Exception {
        List<InterfaceInfo> interfaceList = interfaceInfoMapper.getInterfaceList(serviceId);
        InterfaceListResponse response=new InterfaceListResponse();
        response.setInfoList(interfaceList);
        return Response.success("查询成功",response);
    }
}
