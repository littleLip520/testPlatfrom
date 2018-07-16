import React from 'react';
import { Tabs } from 'antd';

import '../../../less/manage/baseSetting.less';
import mobxUser from '../../mobx-data/mobxUser';
import UserMgr from './userMgr';
import AuthMgr from './authMgr';
import RoleMgr from './roleMgr';

const {action:{userAction}} = mobxUser;


const TabPane = Tabs.TabPane;

class UserSetting extends React.Component{
  componentWillMount(){
    userAction.getAllRoles();
    userAction.getAllAuth();
  }
  render(){
    return(
      <div className="base-setting">
        <Tabs defaultActivekey="user-mgr" className="base-setting-tabs">
          <TabPane tab="用户管理" key="user-mgr"><UserMgr/></TabPane>
          <TabPane tab="角色管理" key="role-mgr"><RoleMgr/></TabPane>
          <TabPane tab="权限管理" key="auth-mgr"><AuthMgr/></TabPane>
        </Tabs>
      </div>
    );
  }

}

export default UserSetting;

