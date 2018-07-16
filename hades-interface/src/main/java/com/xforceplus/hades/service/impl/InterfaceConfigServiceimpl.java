package com.xforceplus.hades.service.impl;

import com.xforceplus.hades.dao.InterfaceConfigMapper;
import com.xforceplus.hades.dao.InterfaceConfigServiceMapper;
import com.xforceplus.hades.interfaceMgmt.domain.InterfaceCase;
import com.xforceplus.hades.interfaceMgmt.domain.InterfaceCaseVariable;
import com.xforceplus.hades.interfaceMgmt.domain.InterfaceConfig;
import com.xforceplus.hades.interfaceMgmt.domain.InterfaceConfigServices;
import com.xforceplus.hades.interfaceMgmt.request.config.InterfaceConfigServiceRequest;
import com.xforceplus.hades.service.InterfaceConfigService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Date;
import java.util.List;
@Service
public class InterfaceConfigServiceimpl implements InterfaceConfigService{
    @Autowired
    private InterfaceConfigMapper configMapper;

    @Autowired
    private InterfaceConfigServiceMapper configServiceMapper;

    @Override
    public InterfaceConfig getById(Integer id) {
        return configMapper.selectByPrimaryKey(id);
    }

    @Override
    public List<InterfaceConfig> getByCondition(InterfaceCase interfaceCase) {
        return configMapper.getByCondition(interfaceCase);
    }

    @Override
    @Transactional
    public void saveAll(InterfaceConfig interfaceConfig) {
        Date date = new Date();
        Integer configId=interfaceConfig.getId();
        if (interfaceConfig.getId()==null||interfaceConfig.getId()==0){
            interfaceConfig.setOrders(configMapper.getConfigMaxOrders(interfaceConfig.getCaseId())+1);
            interfaceConfig.setPosition("preposition");
            interfaceConfig.setConfigType("Service");
            interfaceConfig.setCreateTime(date);
            //保存配置
            configMapper.insert(interfaceConfig);
            configId =interfaceConfig.getId();
        }


        List<com.xforceplus.hades.interfaceMgmt.domain.InterfaceConfigServices> configServiceList = interfaceConfig.getConfigServiceList();
        if (configServiceList!=null&&configServiceList.size()>0){
            for (int i = 0;i<configServiceList.size();i++){
                if (configServiceList.get(i).getId()!=null&&configServiceList.get(i).getId()!=0){
                    configServiceMapper.updateByPrimaryKeySelective(configServiceList.get(i));
                }else{
                    configServiceList.get(i).setConfigId(configId);
                    configServiceMapper.insert(configServiceList.get(i));
                }
            }
        }
    }

    @Override
    public void updateById(InterfaceConfig config) {
        configMapper.updateByPrimaryKeySelective(config);
    }

    @Override
    public InterfaceConfig selectConfig(InterfaceConfig new_config) {
        return configMapper.selectOne(new_config);
    }

    @Override
    @Transactional
    public void deleteById(Integer id) {
        InterfaceConfig config = configMapper.selectByPrimaryKey(id);
        Integer caseId = config.getCaseId();
        Integer orders = config.getOrders();


        //删除configService表中数据
        InterfaceConfigServices deleteConfig = new InterfaceConfigServices();
        deleteConfig.setConfigId(id);
        //List<InterfaceConfigService> configServicesList = configServiceMapper.selectAll(deleteConfig);
        configServiceMapper.deleteByKey(deleteConfig);
        //删除主配置表记录
        configMapper.deleteByPrimaryKey(id);//删除配置
        //删除变量表中
        //重新排序
        while(true){
            InterfaceConfig search = new InterfaceConfig();
            search.setCaseId(caseId);
            search.setOrders(orders+1);
            InterfaceConfig next_config = configMapper.selectOne(search);
            if(next_config != null){
                next_config.setOrders(next_config.getOrders() -1);
                configMapper.updateByPrimaryKey(next_config);
                orders++;
            }else{
                break;
            }
        }
        //重置变量表中相关变量的值
        /*for (int i=0;i<configServicesList.size();i++){
            InterfaceCaseVariable var=new InterfaceCaseVariable();
            var.setFieldName(configServicesList.get(i).getVariableName());
            var.setCaseId(caseId);
            variableDao.deleteValueByCaseIDandFieldName(var);

        }*/

    }
}
