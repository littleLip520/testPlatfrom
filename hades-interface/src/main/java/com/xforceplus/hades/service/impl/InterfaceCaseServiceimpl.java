package com.xforceplus.hades.service.impl;

import com.github.pagehelper.PageHelper;
import com.xforceplus.hades.dao.EnvironmentConfigMapper;
import com.xforceplus.hades.dao.InterfaceCaseMapper;
import com.xforceplus.hades.dao.InterfaceCaseVariableMapper;
import com.xforceplus.hades.dao.InterfaceInfoMapper;
import com.xforceplus.hades.interfaceMgmt.domain.*;
import com.xforceplus.hades.interfaceMgmt.response.EditPageInfoResponse;
import com.xforceplus.hades.interfaceMgmt.response.InterfaceCaseListResponse;
import com.xforceplus.hades.service.InterfaceCaseService;
import com.xforceplus.hades.util.Response;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service
public class InterfaceCaseServiceimpl implements InterfaceCaseService {
    @Autowired
    private InterfaceCaseMapper interfaceCaseMapper;
    @Autowired
    private InterfaceInfoMapper infoMapper;
    @Autowired
    private InterfaceCaseVariableMapper variableMapper;
    @Autowired
    private EnvironmentConfigMapper configMapper;
    @Override
    @Transactional
    public Response<Integer> addScript(InterfaceCase interfaceCase)throws Exception{
        Integer id = interfaceCaseMapper.insert(interfaceCase);
        if(id!=null){
            return Response.success("新增成功",interfaceCase.getId());
        }else {
            return Response.fail("新增用例失败");
        }
    }



    @Override
    public void createInterfaceCase(InterfaceCase interfaceCase) {
        interfaceCaseMapper.save(interfaceCase);
        Integer caseId = interfaceCase.getId();

    }

    @Override
    public Response<InterfaceCase> getById(Integer id) {
        InterfaceCase interfaceCase = interfaceCaseMapper.selectByPrimaryKey(id);
           if(interfaceCase!=null){
               return Response.success("查询成功",interfaceCase);
           }
           else {
               return Response.fail("查无此数据");
           }

    }

    @Override
    public List<InterfaceCaseListResponse> listCase(Integer serviceId) {
        return interfaceCaseMapper.listScript(serviceId);
    }

    @Override
    public Integer count() {
        return interfaceCaseMapper.count();
    }

    @Override
    public InterfaceCaseListResponse pageList(Integer interfaceInfoId,int pageNum, int pageSize) {
        PageHelper.startPage(pageNum, pageSize);
        //查询系统，应用及接口信息
        List<ScriptQueryBean> queryBeanList = interfaceCaseMapper.queryByInfoId(interfaceInfoId);
        InterfaceCaseListResponse response=new InterfaceCaseListResponse();
        response.setQueryBeanList(queryBeanList);
        response.setTotal(queryBeanList.size());
        return response;
    }

    @Override
    public InterfaceCaseListResponse pageList(int pageNum, int pageSize) {
        List<ScriptQueryBean> allScripts = interfaceCaseMapper.getAllScripts();
        InterfaceCaseListResponse response=new InterfaceCaseListResponse();
        response.setTotal(allScripts.size());
        response.setQueryBeanList(allScripts);
        return response;
    }

    @Override
    @Transactional
    public Response updateScript(InterfaceCase interfaceCase) {
        int flag = interfaceCaseMapper.updateByCondition(interfaceCase);
        if(flag==1){
            return Response.success("修改成功");
        }
        else {
            return Response.fail("修改失败");
        }

    }


    @Override
    public Response<EditPageInfoResponse> getEditPageByScriptId(Integer id) {
        //获取脚本对象
        InterfaceCase interfaceCase = interfaceCaseMapper.selectByPrimaryKey(id);
        //查询info对象
        InterfaceInfo interfaceInfo = infoMapper.selectByPrimaryKey(interfaceCase.getInterfaceInfoId());
        //获取变量列表
        InterfaceCaseVariable variable=new InterfaceCaseVariable();
        variable.setCaseId(id);
        List<InterfaceCaseVariable> variableList = variableMapper.getByCondition(variable);
        EditPageInfoResponse response=new EditPageInfoResponse();
        response.setInfoName(interfaceInfo.getInterfaceName());
        response.setInterfaceCase(interfaceCase);
        response.setVariableList(variableList);
        response.setTotal(variableList.size());

        return Response.success("查询成功",response);
    }

    @Override
    public Response<EnvironmentConfig> getEnvConfigByScriptId(Integer id) {
        if(id!=null){
            InterfaceCase interfaceCase = interfaceCaseMapper.selectByPrimaryKey(id);
            if (interfaceCase.getEnvId()!=null){
                EnvironmentConfig environmentConfig = configMapper.selectByPrimaryKey(interfaceCase.getEnvId());
                if(environmentConfig!=null){
                    return Response.success("查询成功",environmentConfig);
                }else {
                    return Response.success("查无数据");
                }
            }else {
                return Response.success("查无数据");
            }
        }else {
            return Response.success("查无数据");
        }

    }
}
