package com.xforceplus.hades.service;

import com.xforceplus.hades.interfaceMgmt.domain.InterfaceCaseVariable;
import com.xforceplus.hades.interfaceMgmt.request.variable.VariableRequestDelete;
import com.xforceplus.hades.interfaceMgmt.response.InterfaceVariableListResponse;
import com.xforceplus.hades.util.Response;

import java.util.List;
import java.util.Map;

public interface InterfaceVariableService {
    /**
     * 查询所有
     * @param CaseVariable
     * @return
     */
    public Response<InterfaceVariableListResponse> selectAll(InterfaceCaseVariable CaseVariable);

    /**
     * 保存全局变量
     * @param interfaceCaseVariable
     */
    public int saveCaseVariable(InterfaceCaseVariable interfaceCaseVariable);

    /**
     * 条件删除
     * @param interfaceCaseVariable
     */
    int deleteByCondition(VariableRequestDelete interfaceCaseVariable);
//    /**
//     * 获取所有变量(全局，私有，结果)
//     * @param interfaceCaseVariable
//     */
//    List<Map<String,Object>> getVariables(InterfaceCaseVariable interfaceCaseVariable);
    /**
     * 保存结果变量
     * @param interfaceCaseVariable
     */
    public void saveResultVariable(InterfaceCaseVariable interfaceCaseVariable);
    /**
     * 查询已保存过的结果变量
     * @param interfaceCaseVariable
     */
    public List<InterfaceCaseVariable> querySavedResultVariable(InterfaceCaseVariable interfaceCaseVariable);

    /**
     * 查询未保存过的结果变量
     * @param interfaceCaseVariable
     */
    public List<InterfaceCaseVariable> queryResultVariable(InterfaceCaseVariable interfaceCaseVariable);


    /**
     * 根据id查询
     * @param id
     * @return
     */
    public InterfaceCaseVariable getById(Integer id);

    /**
     * 单条条件查询
     * @param caseVariable
     * @return
     */
    InterfaceCaseVariable getVariable(InterfaceCaseVariable caseVariable);


    /**
     * 根据caseId和变量名更新记录
     * @param interfaceCaseVariable
     */
    void updateVariableByCaseIdAndName(InterfaceCaseVariable interfaceCaseVariable);

    /**
     * 根据ConfigId 更新变量值
     * @param interfaceCaseVariable
     */
    void updateVariableByConfigId(InterfaceCaseVariable interfaceCaseVariable);
    /**
     * 根据用例ID以及被检查字段查询预期结果中的检查字段
     * @param caseVariable
     */
    public InterfaceCaseVariable queryResultVar(InterfaceCaseVariable caseVariable);
    /**
     * 根据用例ID以及被检查字段查询预期结果中的检查字段
     * @param caseVariable
     */
    void deleteValueByCaseIDandFieldName(InterfaceCaseVariable caseVariable);

    /**
     * 更新变量信息
     * @param interfaceCaseVariable
     */
    void updateNormalVariable(InterfaceCaseVariable interfaceCaseVariable);

    Response insert(InterfaceCaseVariable variable);

    void insertList(List<InterfaceCaseVariable> variableList);

    Response deleteById(Integer id);

    /**
     * 根据条件更新变量
     * @param interfaceCaseVariable
     */
    Response updateByConditioin(InterfaceCaseVariable variable);
}
