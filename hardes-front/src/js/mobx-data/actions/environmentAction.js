import { action, runInAction } from 'mobx';

import fetchApi from '../../fetch/fetchApi';
import { message } from 'antd';
import apiConfig from '../../api/environment';
import { EnvironmentStore } from '../stores/environmentStore';

export class EnvironmentAction {
  constructor({ EnvironmentStore }) {
    this.store = EnvironmentStore;
  }

  /**
   * 获取环境列表
   * @type 0表示帐号密码登录，1表示token登录
   * @data 帐号密码或者token
   */



  @action('分页获取环境列表') getEnvironmentList = async (data) => {
    let environmentList = null;
    return await fetchApi(apiConfig.environment.list, data)
      .then((res) => {
        if (res.status === '0') {
          environmentList = res.data;
        } else {
          message.error(res.errorMsg?res.errorMsg:res.msg);
        }
        return environmentList;
      });
  };

  @action('获取所有环境对象') listAll = async () => {
    let environmentList = null;
    return await fetchApi(apiConfig.environment.list,{})
      .then((res) => {
        if (res.status === '0') {
          environmentList = res.data.envList;
        } else {
          message.error(res.errorMsg?res.errorMsg:res.msg);
        }
        return environmentList;
      });
  };



  @action('新增环境配置') addEvnConfig = async (data) => {
    return await fetchApi(apiConfig.environment.create, data).then((res) => {
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

  @action('修改环境配置') updateEvnConfig = async (data) => {
    return await fetchApi(apiConfig.environment.update, data).then((res) => {
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


  @action('删除环境配置') deleteEvnConfig = async (data) => {
    return await fetchApi(apiConfig.environment.delete, data).then((res) => {
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



}
