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

class BaseSetting extends React.Component{

  render(){
    return(
      <div className="base-setting">
        <Tabs defaultActivekey="product-line" className="base-setting-tabs">
          <TabPane tab="产品线" key="product-line"><ProductLine/></TabPane>
          <TabPane tab="来源客户" key="source-customer"><Customer/></TabPane>
          <TabPane tab="异常事件" key="exception"><Exception/></TabPane>
          <TabPane tab="迭代里程碑" key="milestone"><Milestone/></TabPane>
          <TabPane tab="测试策略" key="policy"><Strategy/></TabPane>
          <TabPane tab="流水线节点" key="pipeline"><Pipeline/></TabPane>
        </Tabs>
      </div>
    );
  }

}

export default BaseSetting;

