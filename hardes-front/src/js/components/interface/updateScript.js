import React from 'react';
import {Tabs } from 'antd';
import '../../../less/manage/baseSetting.less';
import ScriptEdit from './scriptEdit';
import ScriptEnv from './scriptEnv';
import ScriptConfig from './scriptConfig';
import ScriptCheckPoint from './scriptCheckPoint';


const TabPane = Tabs.TabPane;





class UpdateScript extends React.Component{

  render(){
    return(
      <div className="base-setting">
        <Tabs defaultActivekey="sctipt-edit" className="base-setting-tabs">
          <TabPane tab="编辑" key="sctipt-edit"><ScriptEdit id={this.props.match.params.id}/></TabPane>
          <TabPane tab="环境选择" key="sctipt-env"><ScriptEnv id={this.props.match.params.id}/></TabPane>
          <TabPane tab="配置" key="sctipt-config"><ScriptConfig id={this.props.match.params.id}/></TabPane>
          <TabPane tab="检查点" key="sctipt-checkpoint"><ScriptCheckPoint id={this.props.match.params.id}/></TabPane>
        </Tabs>
      </div>
    );
  }

}

export default UpdateScript;