import { action, runInAction } from 'mobx';

import fetchApi from '../../fetch/fetchApi';
import { message } from 'antd';
import apiConfig from '../../api/interface';
import systemApi from '../../api/manage';
import _ from 'lodash';


export class InterfaceAction {
  constructor({ interfaceStore }) {
    this.store = interfaceStore;
  }

  /**
   * 获取接口信息列表
   *
   */

  @action('获取接口信息列表') getInterfaceList = async (data) => {
    let interfaceList = null;
    const {store} = this;
    store.isLoading = true;
    return await fetchApi(apiConfig.interface.list, data).then((res) => {
        if (res.status === '0') {
          interfaceList = res.data.queryBeanList;
          store.interfaceInfoList=_.cloneDeep(res.data.queryBeanList);
        } else {
          message.error(res.errorMsg?res.errorMsg:res.msg);
        }
        return interfaceList;
      });
  };
  /**
   * 获取所有接口
   *
   */

  @action('获取接口信息列表') getAllInterface = async (data) => {
    let interfaceList = null;
    const {store} = this;
    store.isLoading = true;
    return await fetchApi(apiConfig.interface.list, data).then((res) => {
      if (res.status === '0') {
        interfaceList = res.data.queryBeanList;
      } else {
        message.error(res.errorMsg?res.errorMsg:res.msg);
      }
      return interfaceList;
    });
  };


  /**
   * 获取系统信息列表
   *
   */
  @action('获取系统信息列表') getSystemList = async (data) => {
    let systemList = null;
    const {store} = this;
    store.isLoading = true;
    return await fetchApi(systemApi.system.listAll, data)
      .then((res) => {
        if (res.status === '0') {
          systemList = res.data;
          // for(let i=0;i<systemList.size;i++){
          //
          // }
          // store.interfaceInfoList=_.cloneDeep(res.data.queryBeanList);
        } else {
          message.error(res.errorMsg?res.errorMsg:res.msg);
        }
        return systemList;
      });
  };

  /**
   * 获取应用信息列表
   *
   */
  @action('获取应用信息列表') getServiceList = async (id) => {
    let serviceList = null;
    let path = systemApi.service.serviceList.path;
    const api = {
      path:path+id,
    };
    // const {store} = this;
    // store.isLoading = true;
    return await fetchApi(api, {}).then((res) => {
        if (res.status === '0') {
          serviceList = res.data;
        } else {
          message.error(res.errorMsg?res.errorMsg:res.msg);
        }
        return serviceList;
      });
  };

  @action('新增接口信息') addInterfaceInfo = async (data) => {
    return await fetchApi(apiConfig.interface.create, data).then((res) => {
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

  @action('修改接口信息') updateInterfaceInfo = async (data) => {
    return await fetchApi(apiConfig.interface.update, data).then((res) => {
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


  // @action('删除环境配置') deleteEvnConfig = async (data) => {
  //   return await fetchApi(apiConfig.environment.delete, data).then((res) => {
  //     let flag = true;
  //     if (res.status === '0'){
  //       message.info('操作成功');
  //     } else {
  //       flag = false;
  //       message.error(res.errorMsg?res.errorMsg:res.msg);
  //     }
  //     return flag;
  //   });
  // };



}
