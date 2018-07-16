import React from 'react';
import { Tabs } from 'antd';

import '../../../less/manage/baseSetting.less';
import mobxScript from '../../mobx-data/mobxScript';

import BaseScript from './baseScript';


const {action:{scriptAction}} = mobxScript;


const TabPane = Tabs.TabPane;

class ScriptList extends React.Component{
  state={
    interfaceCasePageRequest:{
      interfaceInfoId:null,
      pageRequest:{
        pageSize:10,
        pageNum:1
      }
    }

  };
  componentDidMount(){
    //console.log('------'+this.state.interfaceCasePageRequest);
    let data = this.state.interfaceCasePageRequest;
    scriptAction.getScriptList(this.state.interfaceCasePageRequest);
  }
  render(){
    return(
      <div className="base-setting" >
        <BaseScript/>
      </div>
    );
  }

}

export default ScriptList;

