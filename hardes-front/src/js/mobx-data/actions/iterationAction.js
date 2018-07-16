import {action} from 'mobx';
import {message} from 'antd';
import _ from 'lodash';
import fetchApi from '../../fetch/fetchApi';
import apiConfig from '../../api/iteration';

export default class IterationAction {
  constructor({iterationStore}){
    this.store = iterationStore;
  }

  @action('分页获取的迭代列表') getIterationList = async (data) => {
    const {store} = this;
    await fetchApi(apiConfig.iteration.list,data).then((res) => {
      store.isLoading = true;
      if (res.status === '0'){
        store.iterationList = _.cloneDeep(res.data.iterationMgmts);
        store.pagination.total = res.data.totalNumber;
        store.isLoading = false;
      }else {
        store.isLoading = false;
        message.error(res.msg ? res.msg : res.errorMsg);
      }
    });
  };

  @action('根据ID获取迭代详情') getIterationDetailById = async (id) =>{
    let flag = true;
    const {store} = this;
    const originPath = apiConfig.iteration.detail.path;
    const tmpApiConf = apiConfig.iteration.detail;
    let path = originPath;
    path +=id;
    tmpApiConf.path = path;
    return await fetchApi(tmpApiConf,{}).then((res) => {
      tmpApiConf.path = originPath;
      if (res.status === '0') {
        store.iterationDetail = _.cloneDeep(res.data.iterationMgmt);
      }else {
        flag = false;
        message.error(res.msg ? res.msg : res.errorMsg);
      }
      return flag;
    });
  };

  @action('更新迭代详情') updateIteration = (data) => {
    let flag = true;
    return fetchApi(apiConfig.iteration.update, data).then((res) => {
      if (res.status === '0'){
        message.info('更新成功');
      } else {
        flag = false;
        message.error(res.msg ? res.msg : res.errorMsg);
      }
      return flag;
    });
  };

  @action('添加迭代') addIteration = async(data) =>{
    let flag = true;
    return await fetchApi(apiConfig.iteration.add, data).then((res) => {
      if (res.status === '0'){
        message.info('添加成功');
      } else {
        flag = false;
        message.error(res.errorMsg ? res.errorMsg : res.msg);
      }
      return flag;
    });
  };

  @action('获取所有迭代') getAllIteration = () => {
    const {store} = this;
    fetchApi(apiConfig.iteration.listAll, {}).then((res) => {
      if (res.status === '0'){
        store.allIteration = _.cloneDeep(res.data.iterationMgmts);
      }
    });
  };

  @action('获取所有需求') getAllBusiness = () => {
    const {store} = this;
    fetchApi(apiConfig.business.listAll, {}).then((res) => {
      if (res.status === '0'){
        store.allBusiness = _.cloneDeep(res.data.businesses);
      }
    });
  };

  @action('删除迭代') deleteIteration = async (id) => {
      let path = apiConfig.iteration.delete.path;
      const config = {
        ...apiConfig.iteration.delete,
        path: path+id
      };

      await fetchApi(config,{}).then((res) => {
        if (res.status === '0'){
          message.info('删除成功');
        } else {
          message.error(res.msg ? res.msg : res.errorMsg);
        }
      });
  };

  @action('更新迭代状态') updateIterationStatus = async (data) => {
    const {store} = this;
    let flag = true;
    // if(data.status === 1){
    //   store.showUpdateModal = true;
    // }
    return await fetchApi(apiConfig.iteration.updateStatus, data).then((res) => {
      if (res.status !== '0'){
        flag = false;
        store.showUpdateModal = true;
        message.error(res.msg ? res.msg : res.errorMsg);
      }else{
        store.showUpdateModal = false;
      }
      return flag;
    });
  };

  @action('分页获取需求') getBusinessList = async (data) => {
    const { store } = this;
    const request = {
      pageRequest:data
    };
   return  await fetchApi(apiConfig.business.list,request).then((res) => {
      if (res.status === '0'){
        const result = res.data;
        store.businessList = _.cloneDeep(res.data.businesses);
        store.businessCount = res.data.totalNumber;
        return result;
      }
    });
  };

  @action('更新需求') updateBusiness = async (data) => {
    let flag = true;
    return await fetchApi(apiConfig.business.update,data).then((res)=>{
      if (res.status !== '0'){
        flag = false;
        message.error(res.msg ? res.msg : res.errorMsg);
      }
      return flag;
    });
  };

  @action('删除需求') deleteBusiness = async(id) =>{
    let flag = true;
    let path = apiConfig.business.delete.path;
    const config = {
      ...apiConfig.business.delete,
      path: path+id
    };

     return await fetchApi(config,{}).then((res) => {
      if (res.status === '0'){
        message.info('删除成功');
      } else {
        flag = false;
        message.error(res.errorMsg ? res.errorMsg : res.msg);
      }
      return flag;
    });
  };

  @action('添加需求') addBusiness = async(data) => {
    await fetchApi(apiConfig.business.add,data).then((res) => {
      if (res.status === '0'){
        message.info('添加成功');
      } else {
        message.error(res.msg ? res.msg : res.errorMsg);
      }
    });
  };

  @action('分页获取异常事件列表') getExceptionList = async (data) => {
    const { store } = this;
    await fetchApi(apiConfig.exceptionEvent.list,data).then((res) => {
      store.isLoading = true;
      if (res.status === '0'){
        store.exceptionList = _.cloneDeep(res.data.exceptionEvents);
        store.pagination.total = res.data.totalNumber;
        store.isLoading = false;
      }else {
        store.isLoading = false;
        message.error(res.msg ? res.msg : res.errorMsg);
      }
    });
  };

  @action('更新异常事件') updateException = async (data) => {
    let flag = true;
    return await fetchApi(apiConfig.exceptionEvent.update,data).then((res)=>{
      if (res.status !== '0'){
        flag = false;
        message.error(res.msg ? res.msg : res.errorMsg);
      }else{
        message.info('更新成功');
      }
      return flag;
    });
  };

  @action('更新异常事件状态') updateExceptionStatus = async (data) => {
    let flag = true;
    return await fetchApi(apiConfig.exceptionEvent.updateStatus,data).then((res)=>{
      if (res.status !== '0'){
        flag = false;
        message.error(res.msg ? res.msg : res.errorMsg);
      }else{
        message.info('更新状态成功');
      }
      return flag;
    });
  };

  @action('删除异常事件') deleteException = async(id) =>{
    let path = apiConfig.exceptionEvent.delete.path;
    const config = {
      ...apiConfig.exceptionEvent.delete,
      path: path+id
    };
    await fetchApi(config,{}).then((res) => {
      if (res.status === '0'){
        message.info('删除成功');
      } else {
        message.error(res.msg ? res.msg : res.errorMsg);
      }
    });
  };

  @action('添加异常事件') addException = async(data) => {
    let flag = true;
    return await fetchApi(apiConfig.exceptionEvent.add,data).then((res) => {
      console.log(res);
      if (res.status === '0'){
        message.info('添加成功');
      } else {
        flag=false;
        message.error(res.msg ? res.msg : res.errorMsg);
      }
      console.log(flag);
      return flag;
    });
  };

  @action('根据ID获取异常事件详情') getExceptionDetailById = async (id) =>{
    const {store} = this;
    const originPath = apiConfig.exceptionEvent.detail.path;
    const tmpApiConf = apiConfig.exceptionEvent.detail;
    let path = originPath;
    path +=id;
    tmpApiConf.path = path;
    await fetchApi(tmpApiConf,{}).then((res) => {
      tmpApiConf.path = originPath;
      if (res.status === '0') {
        store.exceptionDetail = _.cloneDeep(res.data.exceptionEvent);
      }else {
        message.error(res.msg ? res.msg : res.errorMsg);
      }
    });
  };

  @action('设置更新日期的modal状态') updateModalStatus = () =>{
    const {store} = this;
    store.showUpdateModal = !store.showUpdateModal;
  };

  @action('根据产品线和迭代状态获取迭代列表') getIterationListByPrdIdAndStatus = (data) => {
    const {store} = this;
    fetchApi(apiConfig.iteration.listByPrdIdAndStatus,data).then((res)=>{
      if(res.status==='0'){
        store.iterationList = _.cloneDeep(res.data.iterationMgmts);
        store.iterationNameDisabled = !(res.data.iterationMgmts && res.data.iterationMgmts.length !== 0);
      }else {
        store.iterationList = null;
      }
    });
  }
}
