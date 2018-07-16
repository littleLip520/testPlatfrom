import React from 'react';
import { Tabs } from 'antd';

import '../../../less/manage/baseSetting.less';

import ProductLine from './productLine';
import SystemTable from './system';
import Customer from './customer';
import Exception from './exception';
import Milestone from './milestone';
import Strategy from './strategy';
import Pipeline from './pipline';
import ServiceTable from './service';
const TabPane = Tabs.TabPane;

class SystemService extends React.Component{

  render(){
    return(
      <div className="base-setting">
        <Tabs defaultActivekey="system" className="base-setting-tabs">
          <TabPane tab="系统" key="system"><SystemTable/></TabPane>
          <TabPane tab="服务" key="service"><ServiceTable/></TabPane>
        </Tabs>
      </div>
    );
  }

}

export default SystemService;

