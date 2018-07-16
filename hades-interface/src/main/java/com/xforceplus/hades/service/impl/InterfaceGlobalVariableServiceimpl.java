package com.xforceplus.hades.service.impl;

import com.github.pagehelper.PageHelper;
import com.xforceplus.hades.dao.InterfaceGlobalVariableMapper;
import com.xforceplus.hades.interfaceMgmt.domain.InterfaceGlobalVariable;
import com.xforceplus.hades.service.InterfaceGlobalVariableService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class InterfaceGlobalVariableServiceimpl implements InterfaceGlobalVariableService {
    @Autowired
    private InterfaceGlobalVariableMapper globalVariableMapper;

    @Override
    public int deleteByPrimaryKey(Integer id) {
        return globalVariableMapper.deleteByPrimaryKey(id);
    }

    @Override
    public int insert(InterfaceGlobalVariable record) {
        return globalVariableMapper.insert(record);
    }

    @Override
    public int insertSelective(InterfaceGlobalVariable record) {
        return globalVariableMapper.insertSelective(record);
    }

    @Override
    public InterfaceGlobalVariable selectByPrimaryKey(Integer id) {
        return globalVariableMapper.selectByPrimaryKey(id);
    }

    @Override
    public int updateByPrimaryKeySelective(InterfaceGlobalVariable record) {
        return globalVariableMapper.updateByPrimaryKeySelective(record);
    }

    @Override
    public int updateByPrimaryKey(InterfaceGlobalVariable record) {
        return globalVariableMapper.updateByPrimaryKey(record);
    }

    @Override
    public List<InterfaceGlobalVariable> pageList(Integer caseId, int pageNum, int pageSize) {
        PageHelper.startPage(pageNum,pageSize);
        InterfaceGlobalVariable condition = new InterfaceGlobalVariable();
        condition.setCaseId(caseId);
        List<InterfaceGlobalVariable> globalVariableList = globalVariableMapper.getByCondition(condition);
        return globalVariableList;
    }

    @Override
    public List<InterfaceGlobalVariable> getListByIds(List<Integer> globalVariableIds) {
        return globalVariableMapper.getListByIds(globalVariableIds);
    }
}
