package com.xforceplus.hades.service.impl;

import com.xforceplus.hades.dao.InterfaceCaseVariableMapper;
import com.xforceplus.hades.interfaceMgmt.domain.InterfaceCaseVariable;
import com.xforceplus.hades.interfaceMgmt.request.variable.VariableRequestDelete;
import com.xforceplus.hades.interfaceMgmt.response.InterfaceVariableListResponse;
import com.xforceplus.hades.service.InterfaceVariableService;
import com.xforceplus.hades.util.Response;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;


@Service
public class InterfaceVariableServiceimpl implements InterfaceVariableService {

    @Autowired
    private InterfaceCaseVariableMapper variableMapper;


    @Override
    public Response<InterfaceVariableListResponse> selectAll(InterfaceCaseVariable CaseVariable) {
        return null;
    }

    @Override
    public int saveCaseVariable(InterfaceCaseVariable interfaceCaseVariable) {
        return 0;
    }

    @Override
    public int deleteByCondition(VariableRequestDelete interfaceCaseVariable) {
        return 0;
    }

    @Override
    public void saveResultVariable(InterfaceCaseVariable interfaceCaseVariable) {

    }

    @Override
    public List<InterfaceCaseVariable> querySavedResultVariable(InterfaceCaseVariable interfaceCaseVariable) {
        return null;
    }

    @Override
    public List<InterfaceCaseVariable> queryResultVariable(InterfaceCaseVariable interfaceCaseVariable) {
        return null;
    }

    @Override
    public InterfaceCaseVariable getById(Integer id) {
        return null;
    }

    @Override
    public InterfaceCaseVariable getVariable(InterfaceCaseVariable caseVariable) {
        return null;
    }

    @Override
    public void updateVariableByCaseIdAndName(InterfaceCaseVariable interfaceCaseVariable) {

    }

    @Override
    public void updateVariableByConfigId(InterfaceCaseVariable interfaceCaseVariable) {

    }

    @Override
    public InterfaceCaseVariable queryResultVar(InterfaceCaseVariable caseVariable) {
        return null;
    }

    @Override
    public void deleteValueByCaseIDandFieldName(InterfaceCaseVariable caseVariable) {

    }

    @Override
    public void updateNormalVariable(InterfaceCaseVariable interfaceCaseVariable) {
        variableMapper.updateByPrimaryKey(interfaceCaseVariable);

    }

    @Override
    @Transactional
    public Response insert(InterfaceCaseVariable variable) {
        int flag = variableMapper.insert(variable);
        if(flag!=1){
            return Response.fail("新增变量失败");
        }else{
            return Response.successResponse();
        }
    }

    @Override
    public void insertList(List<InterfaceCaseVariable> variableList) {
        variableMapper.insertList(variableList);
    }

    @Override
    public Response deleteById(Integer id) {
        int flag = variableMapper.deleteByPrimaryKey(id);
        if(flag==1){
            return Response.successResponse();
        }else {
            return Response.fail("删除失败");
        }
    }

    @Override
    @Transactional
    public Response updateByConditioin(InterfaceCaseVariable variable) {
        int flag = variableMapper.updateByCondition(variable);
        if(flag!=1){
            return Response.fail("新增变量失败");
        }else{
            return Response.successResponse();
        }
    }
}
