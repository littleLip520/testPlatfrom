import { action, runInAction } from 'mobx';

import fetchApi from '../../fetch/fetchApi';
import { message } from 'antd';
import apiConfig from '../../api/script';
import { ScriptStore } from '../stores/scriptStore';
import _ from 'lodash';


export class ScriptAction {
  constructor({ scriptStore }) {
    this.store = scriptStore;
  }

  /**
   * 获取环境列表
   * @type 0表示帐号密码登录，1表示token登录
   * @data 帐号密码或者token
   */



  @action('获取脚本列表') getScriptList = async (data) => {
    let scriptInfoList = null;
    const {store} = this;
    store.isLoading = true;
    return await fetchApi(apiConfig.script.list, data).then((res) => {
        if (res.status === '0') {
          scriptInfoList = res.data.queryBeanList;
          store.scriptList=_.cloneDeep(res.data.queryBeanList);
        } else {
          message.error(res.errorMsg?res.errorMsg:res.msg);
        }
        return scriptInfoList;
      });
  };


  @action('根据应用ID获取脚本列表') getScriptListByServiceId = async (id) => {
    let scriptInfoList = null;
    let path = apiConfig.script.listByServiceId.path;
    const api = {
      path:path+id,
    };

    return await fetchApi(api, {}).then((res) => {
      if (res.status === '0') {
        scriptInfoList = res.data.infoList;
      } else {
        message.error(res.errorMsg?res.errorMsg:res.msg);
      }
      return scriptInfoList;
    });
  };


  @action('保存脚本') addScript = async (data) => {
    return await fetchApi(apiConfig.script.create, data).then((res) => {
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

  @action('删除脚本') deleteScript = async (data) => {
    return await fetchApi(apiConfig.script.delete, data).then((res) => {
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

  @action('根据脚本ID获取接口名称') getInfoNameByScriptId = async (data) => {
    return await fetchApi(apiConfig.script.query, data).then((res) => {


      if (res.status === '0'){
      } else {

        message.error(res.errorMsg?res.errorMsg:res.msg);
      }
      return res;
    });
  };










}
