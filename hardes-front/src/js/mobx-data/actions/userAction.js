import { action, runInAction } from 'mobx';
import _ from 'lodash';
import fetchApi from '../../fetch/fetchApi';
import { message } from 'antd';
import apiConfig from '../../api/user';

export class UserAction {
  constructor({ userStore }) {
    this.store = userStore;
  }

  /**
   * 统一登录方法
   * @type 0表示帐号密码登录，1表示token登录
   * @data 帐号密码或者token
   */
  @action('帐号密码登录') login = async (type, data) => {
    const {store} = this;
    let loginMethod = type === 0 ? apiConfig.login.accountLogin : apiConfig.login.tokenLogin;
    let flag = true;
    store.loginLoading = true;
    return await fetchApi(loginMethod, data)
      .then((response) => {
        if (response.status === '0') {
          runInAction(() => {
            this.setUserInfo(response.data);
          });
        } else {
          flag = false;
          message.error(response.errorMsg?response.errorMsg:response.msg);
        }
        store.loginLoading = false;
        return flag;
      });
  };
  @action('设置用户信息') setUserInfo = async (data) => {
    runInAction(() => {
      this.store.authInfo = data.authInfo;
      this.store.email = data.email;
      this.store.mobile = data.mobile;
      this.store.name = data.name;
      this.store.username = data.username;
      this.store.roleId = data.roleId;
      localStorage.setItem('token', data.token);
      localStorage.setItem('name', data.name);
    });

  };

  @action('获取用户列表') getUserList = async (data) => {
    let userList = null;
    return await fetchApi(apiConfig.user.list, data)
      .then((res) => {
        if (res.status === '0') {
          userList = res.data;
          //this.store.userInfoList = _.cloneDeep(userList);
        } else {
          message.error(res.errorMsg?res.errorMsg:res.msg);
        }
        return userList;
      });
  };

  @action('重置用户列表') resetUserList = async (data) => {
    runInAction(() => {
      this.store.userInfoList = data;
    });
  };

  @action('更新用户信息') updateUser = async (data) => {
    let flag = true;
    return await fetchApi(apiConfig.user.update, data)
      .then((res) => {
        if (res.status !== '0') {
          flag = false;
          message.error(res.errorMsg?res.errorMsg:res.msg);
        }
        return flag;
      });
  };

  @action('获取所有的角色') getAllRoles = () => {
    const {store} = this;
    fetchApi(apiConfig.role.listAll,{}).then((res) => {
      if (res.status === '0'){
        store.roleList = _.cloneDeep(res.data.roleList);
        console.log(store.roleList);
      } else {
        message.error(res.errorMsg?res.errorMsg:res.msg);
      }
    });
  };

  @action('获取所有的权限') getAllAuth = async () => {
    const {store} = this;
    await fetchApi(apiConfig.auth.listAll, {}).then((res) => {
      if (res.status === '0'){
        store.authList = _.cloneDeep(res.data.authList);
      } else {
        message.error(res.errorMsg?res.errorMsg:res.msg);
      }
    });
  };

  @action('分页获取权限') getAuthList = async (data) =>{
    let authList = null;
    return await fetchApi(apiConfig.auth.list, data).then((res) => {
      if (res.status === '0'){
        authList = res.data;
      } else {
        message.error(res.errorMsg?res.errorMsg:res.msg);
      }
      return authList;
    });
  };

  @action('删除权限') deleteAuth = async (data) => {
    return await fetchApi(apiConfig.auth.delete, data).then((res) => {
      let flag = true;
      if (res.status === '0'){
        message.info('操作成功');
      } else {
        flag = false;
        message.error(res.errorMsg?res.errorMsg:res.msg);
      }
      return flag;
    });
  };

  @action('更新权限') updateAuth = async (data) => {
    return await fetchApi(apiConfig.auth.update, data).then((res) => {
      let flag = true;
      if (res.status === '0'){
        message.info('操作成功');
      } else {
        flag = false;
        message.error(res.errorMsg?res.errorMsg:res.msg);
      }
      return flag;
    });
  };

  @action('添加权限') addAuth = async (data) => {
    return await fetchApi(apiConfig.auth.create, data).then((res) => {
      let flag = true;
      if (res.status === '0'){
        message.info('操作成功');
      } else {
        flag = false;
        message.error(res.errorMsg?res.errorMsg:res.msg);
      }
      return flag;
    });
  };

  @action('获取角色权限列表') getRoleAuth = async (data) =>{
    const {store} = this;
    return await fetchApi(apiConfig.roleAuth.list, data).then((res) => {
      if (res.status === '0'){
        store.roleAuthTotal = res.data.total;
        const dataList = res.data.roleAuthList;
        store.roleAuthList = _.cloneDeep(res.data.roleAuthList);
        let tmpList = [];
        _.forEach(dataList, (item) => {
          let tmpObj = {
            roleId: item.roleId
          };
          _.each(store.roleList, (role) =>{
            if (item.roleId === role.id){
            tmpObj.roleName = role.roleName;
            }
          });
          let authList = [];
          _.forEach(item.authList,(auth) =>{
            authList.push(auth.id);
          });
          tmpObj.authList = authList;
          tmpList.push(tmpObj);
        });
        store.simpleRoleAuthList = _.cloneDeep(tmpList);
        return tmpList;
      } else {
        message.error(res.errorMsg?res.errorMsg:res.msg);
      }
    });
  };

  @action('更新角色权限信息') updateRoleAuth = async (data) => {
    let flag = true;
    return await fetchApi(apiConfig.role.update, data).then((res) => {
      if (res.status !== '0') {
        flag = false;
        message.error(res.errorMsg?res.errorMsg:res.msg);
      }else {
        message.info('更新成功');
      }
      return flag;
    });
  };

  @action('添加角色权限') addRoleAuth = async (data) =>{
    let flag = true;
    return await fetchApi(apiConfig.role.create, data).then((res) => {
      if (res.status !== '0') {
        flag = false;
        message.error(res.errorMsg?res.errorMsg:res.msg);
      }else {
        message.info('添加成功');
      }
      return flag;
    });
  };

  @action('删除角色权限') deleteRoleAuth = async(data) =>{
    let flag = true;
    return await fetchApi(apiConfig.role.delete, data).then((res) => {
      if (res.status === '0'){
        message.info('删除成功');
      } else {
        flag = false;
        message.error(res.errorMsg?res.errorMsg:res.msg);
      }
      return flag;
    });
  };


  @action('设置当前编辑角色的默认权限') setEditingAuth = (data) =>{
    const {store} = this;
    store.editingAuthList = _.cloneDeep(data);
  };

  @action('获取所有活跃用户') getAllActiveUsers = async() => {
    const {store} = this;
     await fetchApi(apiConfig.user.listActive,{}).then((res) => {
      if (res.status === '0') {
        store.allActiveUser = _.cloneDeep(res.data.activeUserList);
        //return res.data.activeUserList;
      }
    });
  };

  @action('获取所有用户') getAllUsers = async() =>{
    const {store} = this;
     await fetchApi(apiConfig.user.listAll,{}).then((res) => {
      if (res.status === '0') {
        store.allUsers = _.cloneDeep(res.data.userList);
      }
    });
  };

  @action('获取用户部门') getUserDept = (data) =>{
    let dept = '';
    return fetchApi(apiConfig.user.info,data).then((res)=>{
      if (res.status === '0'){
        dept = res.data.user.department;
        return dept;
      }
    });
  }
}
