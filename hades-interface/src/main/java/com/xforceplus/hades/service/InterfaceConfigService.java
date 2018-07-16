package com.xforceplus.hades.service;

import com.xforceplus.hades.interfaceMgmt.domain.InterfaceCase;
import com.xforceplus.hades.interfaceMgmt.domain.InterfaceConfig;
import com.xforceplus.hades.interfaceMgmt.request.config.InterfaceConfigSaveRequest;

import java.util.List;

public interface InterfaceConfigService {
    /**
     *根据Id查询
     * @param id
     * @return
     */
    InterfaceConfig getById(Integer id);

    /**
     * 条件查询
     * @param interfaceCase
     * @return
     */
    List<InterfaceConfig> getByCondition(InterfaceCase interfaceCase);

    /**
     * 保存所有
     * @param config
     */
    void saveAll(InterfaceConfig config);

    /**
     * 更新
     * @param config
     */
    void updateById(InterfaceConfig config);

    InterfaceConfig selectConfig(InterfaceConfig new_config);

    void deleteById(Integer id);
}
