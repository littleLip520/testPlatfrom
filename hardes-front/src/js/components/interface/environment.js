import React from 'react';
import { Tabs } from 'antd';

import '../../../less/manage/baseSetting.less';
import mobxEnvironment from '../../mobx-data/mobxEnvironment';

import BaseEnvir from './baseEnvironment';


const {action:{environmentAction}} = mobxEnvironment;


const TabPane = Tabs.TabPane;

class EnvironmentSetting extends React.Component{
  state={
    pagination:{
      pageSize:10,
      pageNum:1
    }
  };
  componentWillMount(){
    environmentAction.getEnvironmentList(this.state.pagination);
  }
  render(){
    return(
      <div className="base-setting" >
        <BaseEnvir/>
      </div>
    );
  }

}

export default EnvironmentSetting;

