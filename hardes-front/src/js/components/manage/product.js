import React from 'react';
import { Tabs } from 'antd';
import { observer } from 'mobx-react';

import mobx from '../../mobx-data/mobxProduct';
import ProductMgr from './productMgr';
import ProductName from './productNameMgr';
import Feature from './featureMgr';
import UnitMgr from './UnitMgr';

// import '../../../less/manage/productManage.less';
import '../../../less/manage/baseSetting.less';

const { action: {productAction} } = mobx;
const TabPane = Tabs.TabPane;

@observer
class ProductManage extends React.Component{
  onTabChange = () => {
    productAction.getTypes();
  };
    render() {
        return(
        <div className="productMgr">
        <Tabs
          defaultActivekey="product-line"
          className="base-setting-tabs"
          onChange={()=>this.onTabChange('product-name')}
        >
          <TabPane tab="产品类别" key="product-type"><ProductMgr/></TabPane>
          <TabPane tab="产品名称" key="product-name"><ProductName/></TabPane>
          <TabPane tab="Feature大类" key="product-feature"><Feature/></TabPane>
          <TabPane tab="功能单元" key="product-unit"><UnitMgr/></TabPane>
        </Tabs>
        </div>);
    }
};

export default ProductManage;
