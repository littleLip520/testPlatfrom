package com.xforceplus.hades.dao;
import com.xforceplus.hades.interfaceMgmt.domain.BriefEnvInfo;
import com.xforceplus.hades.interfaceMgmt.domain.EnvironmentConfig;

import java.util.List;

public interface EnvironmentConfigMapper {
    int deleteByPrimaryKey(Integer id);

    int insert(EnvironmentConfig record);

    int insertSelective(EnvironmentConfig record);

    EnvironmentConfig selectByPrimaryKey(Integer id);
    /**
     * 查询环境总数
     * @return
     */

    int updateByCondition(EnvironmentConfig record);

    int updateByPrimaryKey(EnvironmentConfig record);


    /**
     * 查询环境总数
     * @return
     */
    int getEnvironmentCount();

    /**分页
     * 查询环境列表
     * @return
     */
    List<BriefEnvInfo> getEnvironmentList();

    /**
     * 查询环境列表
     * @return
     */
    List<EnvironmentConfig> listAll();
}