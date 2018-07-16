import { action } from 'mobx';
import { message } from 'antd';
import _ from 'lodash';

import manage from '../../api/manage';
import fetchApi from '../../fetch/fetchApi';
import apiConfig from '../../api/iteration';
const { productLine, system, service, customer,exception,milestone, strategy, pipeline,defectStatus,defectSeverity,defectPriority,productVersion,team } = manage;
export class TestAction {
  constructor({ test }) {
    this.store = test;
  }

  @action('添加') add() {
    this.store.num += 1;
  }
}

export class TestActions {
  constructor({ test2 }) {
    this.store = test2;
  }
}

export class ProductLineAction {
  constructor({ productLineStore }){
    this.store = productLineStore;
  }

  @action('获取产品线列表') getProductLineList = async(data) => {
    const response = await fetchApi(productLine.list,data);
    if (response.status === '0') {
      const tmpData = response.data.productLines;
      this.store.productLines = [];
      _.each(tmpData, (item) => {
        this.store.productLines.push(item);
      });
      this.store.productLines = {...tmpData};
     // this.store.productLines = response.data.productLines;
    }else {
      message.error(response.msg);
    }
  };

  @action('获取所有产品线') getAllProductLine = async() =>{
    const {store} = this;
     return await fetchApi(productLine.listAll,{}).then((res)=>{
      if (res.status === '0') {
        store.productLines = _.cloneDeep(res.data.productLines);
        return res.data;
      }else {
        message.error(res.msg ? res.msg : res.errorMsg);
      }
    });
  };

  @action('新增产品线') addProductLine = async (name) => {
    return await fetchApi(productLine.add,{productLineName: name}).then((res)=>{
      let flag = true;
      if (res.status === '0'){
        message.info('添加成功');
      } else {
        flag = false;
        message.error(res.errorMsg);
      }
      return flag;
    });
  }

  @action('更新产品线') updateProductLine = async(data) => {
    return await fetchApi(productLine.update, data).then((res) => {
      let flag = true;
      if (res.status !== '0'){
        flag = false;
        message.error(res.errorMsg);
      }else {
        message.info('操作成功');
      }
      return flag;
    });
  }

  @action('删除产品线') deleteProductLine = async (id) => {
    const delApi = productLine.del.path;
    const tmpApi = productLine.del;
    tmpApi.path += '/'+id;

    return await fetchApi(tmpApi, {}).then((res) => {
      let flag = true;
      if (res.status === '0'){
        message.info('操作成功');
        tmpApi.path = delApi;
      } else {
        flag = false;
        message.error(res.errorMsg);
      }
      return flag;
    });
  }
}
export class SystemAction {
  constructor({systemStore}){
    this.store = systemStore;
  }

  @action('新增系统') addSystem = async (data) => {
    let flag = true;
    return await fetchApi(system.add,data).then(
      (res) => {
        if(res.status !== '0'){
          flag = false;
          message.error(res.errorMsg);
        }else {
          message.info('操作成功');
        }
      return flag;
      }
    );
  }

  @action('更新系统') updateSystem = async (data) => {
    let flag = true;
    return await fetchApi(system.update,data).then(
      (res) => {
        if(res.status !== '0'){
          flag = false;
          message.error(res.errorMsg);
        }else {
          message.info('操作成功');
        }
        return flag;
      }
    );
  }

  @action('获取所有系统') getAllSystems = async() => {
    const {store} = this;
    return await fetchApi(system.listAll, {}).then((res) => {
      if (res.status === '0'){
        store.allSystems = _.cloneDeep(res.data.systems);
        return res.data;
      }else {
        message.error(res.msg ? res.msg : res.errorMsg);
      }
    });
  };

  @action('删除系统') deleteSystem = async (id) => {
    const delApi = system.del.path;
    const tmpApi = system.del;
    tmpApi.path += '/'+id;

    let flag = true;
    return await fetchApi(tmpApi,{}).then(
      (res) => {
          if(res.status !== '0'){
            flag = false;
            message.error(res.errorMsg);
          }else {
            message.info('操作成功');
          }
          tmpApi.path = delApi;
        return flag;
      }
    );
  }
}

export class ServiceAction {
  constructor({serviceStore}){
    this.store = serviceStore;
  }

  @action('新增服务') addService = async (data) => {
    let flag = true;
    return await fetchApi(service.add,data).then(
      (res) => {
        if(res.status !== '0'){
          flag = false;
          message.error(res.errorMsg);
        }else {
          message.info('操作成功');
        }
        return flag;
      }
    );
  }

  @action('更新服务') updateService = async (data) => {
    let flag = true;
    return await fetchApi(service.update,data).then(
      (res) => {
        if(res.status !== '0'){
          flag = false;
          message.error(res.errorMsg);
        }else {
          message.info('操作成功');
        }
        return flag;
      }
    );
  }

  @action('删除服务') deleteService = async (id) => {
    const delApi = service.del.path;
    const tmpApi = service.del;
    tmpApi.path += '/'+id;

    let flag = true;
    return await fetchApi(tmpApi,{}).then(
      (res) => {
        if(res.status !== '0'){
          flag = false;
          message.error(res.errorMsg);
        }else {
          message.info('操作成功');
        }
        tmpApi.path = delApi;
        return flag;
      }
    );
  }
}

export class CustomerAction{
  constructor({customerStore}){
    this.store = customerStore;
  }

  @action('新增客户源') addCustomer = async (data) => {
    let flag = true;
    return await fetchApi(customer.add,{customerName: data}).then(
      (res) => {
        if(res.status !== '0'){
          flag = false;
          message.error(res.errorMsg);
        }else {
          message.info('操作成功');
        }
      return flag;
      }
    );
  };

  @action('更新客户源') updateCustomer = async (data) => {
    let flag = true;
    return await fetchApi(customer.update,data).then(
      (res) => {
        if(res.status !== '0'){
          flag = false;
          message.error(res.errorMsg);
        }
        return flag;
      }
    );
  };

  @action('删除客户源') deleteCustomer = async (id) => {
    const delApi = customer.del.path;
    const tmpApi = customer.del;
    tmpApi.path += '/'+id;

    let flag = true;
    return await fetchApi(tmpApi,{}).then(
      (res) => {
          if(res.status !== '0'){
            flag = false;
            message.error(res.errorMsg);
          }else {
            message.info('操作成功');
          }
          tmpApi.path = delApi;
        return flag;
      }
    );
  };

  @action('获取所有客户源') getAllCustomers = async () =>{
    const {store} = this;
    await fetchApi(customer.listAll,{}).then((res)=>{
      if (res.status === '0'){
        store.allCustomers = _.cloneDeep(res.data.customers);
      } else {
        message.error(res.msg ? res.msg : res.errorMsg);
      }
    });
  }

}

export class ExceptionAction{
  constructor({exceptionStore}){
    this.store = exceptionStore;
  }

  @action('新增异常事件') addException = async (data) => {
    let flag = true;
    return await fetchApi(exception.add,{eventType: data}).then(
      (res) => {
        if(res.status !== '0'){
          flag = false;
          message.error(res.errorMsg);
        }else {
          message.info('操作成功');
        }
      return flag;
      }
    );
  }

  @action('更新异常事件') updateException = async (data) => {
    let flag = true;
    return await fetchApi(exception.update,data).then(
      (res) => {
        if(res.status !== '0'){
          flag = false;
          message.error(res.errorMsg);
        }else {
          message.info('操作成功');
        }
      return flag;
      }
    );
  }

  @action('删除异常事件') deleteException = async (id) => {
    const delApi = exception.del.path;
    const tmpApi = exception.del;
    tmpApi.path += '/'+id;

    let flag = true;
    return await fetchApi(tmpApi,{}).then(
      (res) => {
          if(res.status !== '0'){
            flag = false;
            message.error(res.errorMsg);
          }else {
            message.info('操作成功');
          }
          tmpApi.path = delApi;
        return flag;
      }
    );
  }

}

export class MilestoneAction{
  constructor({milestoneStore}){
    this.store = milestoneStore;
  }

  @action('新增里程碑') addMilestone = async (data) => {
    let flag = true;
    return await fetchApi(milestone.add,{iterationStoneName: data}).then(
      (res) => {
        if(res.status !== '0'){
          flag = false;
          message.error(res.errorMsg);
        }else {
          message.info('操作成功');
        }
      return flag;
      }
    );
  }

  @action('更新里程碑') updateMilestone = async (data) => {
    let flag = true;
    return await fetchApi(milestone.update,data).then(
      (res) => {
        if(res.status !== '0'){
          flag = false;
          message.error(res.errorMsg);
        }else {
          message.info('操作成功');
        }
      return flag;
      }
    );
  }

  @action('删除里程碑') deleteMilestone = async (id) => {
    const delApi = milestone.del.path;
    const tmpApi = milestone.del;
    tmpApi.path += '/'+id;

    let flag = true;
    return await fetchApi(tmpApi,{}).then(
      (res) => {
          if(res.status !== '0'){
            flag = false;
            message.error(res.errorMsg);
          }else {
            message.info('操作成功');
          }
          tmpApi.path = delApi;
        return flag;
      }
    );
  }

}


export class PipelineAction{
  constructor({pipelineStore}){
    this.store = pipelineStore;
  }

  @action('新增节点') addPipeline = async (data) => {
    let flag = true;
    return await fetchApi(pipeline.add,{pipelineNodeName: data}).then(
      (res) => {
        if(res.status !== '0'){
          flag = false;
          message.error(res.errorMsg);
        }else {
          message.info('操作成功');
        }
      return flag;
      }
    );
  }

  @action('更新节点') updatePipeline = async (data) => {
    let flag = true;
    return await fetchApi(pipeline.update,data).then(
      (res) => {
        if(res.status !== '0'){
          flag = false;
          message.error(res.errorMsg);
        }else {
          message.info('操作成功');
        }
      return flag;
      }
    );
  }

  @action('删除节点') deletePipeline = async (id) => {
    const delApi = pipeline.del.path;
    const tmpApi = pipeline.del;
    tmpApi.path += '/'+id;

    let flag = true;
    return await fetchApi(tmpApi,{}).then(
      (res) => {
          if(res.status !== '0'){
            flag = false;
            message.error(res.errorMsg);
          }else {
            message.info('操作成功');
          }
          tmpApi.path = delApi;
        return flag;
      }
    );
  }

}

export class StrategyAction{
  constructor({strategyStore}){
    this.store = strategyStore;
  }

  @action('新增策略') addStrategy = async (data) => {
    let flag = true;
    return await fetchApi(strategy.add,{strategyName: data}).then(
      (res) => {
        if(res.status !== '0'){
          flag = false;
          message.error(res.errorMsg);
        }else {
          message.info('操作成功');
        }
      return flag;
      }
    );
  }

  @action('更新策略') updateStrategy = async (data) => {
    let flag = true;
    return await fetchApi(strategy.update,data).then(
      (res) => {
        if(res.status !== '0'){
          flag = false;
          message.error(res.errorMsg);
        }else {
          message.info('操作成功');
        }
      return flag;
      }
    );
  }

  @action('删除策略') deleteStrategy = async (id) => {
    const delApi = strategy.del.path;
    const tmpApi = strategy.del;
    tmpApi.path += '/'+id;

    let flag = true;
    return await fetchApi(tmpApi,{}).then(
      (res) => {
          if(res.status !== '0'){
            flag = false;
            message.error(res.errorMsg);
          }else {
            message.info('操作成功');
          }
          tmpApi.path = delApi;
        return flag;
      }
    );
  };

  @action('获取所有测试策略列表') getAllStrategy = () =>{
    const {store} = this;
    fetchApi(strategy.listAll,{}).then((res)=>{
      if(res.status === '0'){
        store.allStrategy = _.cloneDeep(res.data.strategies);
      }
    });
  }

}

export class DefectStatusAction{
  constructor({defectStatusStore}){
    this.store = defectStatusStore;
  }

  @action('获取所有缺陷状态') getAllDefectStatus = async () =>{
    const {store} = this;
    await fetchApi(defectStatus.listAll,{}).then((res)=>{
      if (res.status === '0'){
        store.allDefectStatus = _.cloneDeep(res.data.defectStatus);
      } else {
        message.error(res.msg ? res.msg : res.errorMsg);
      }
    });
  }

}

export class DefectSeverityAction{
  constructor({defectSeverityStore}){
    this.store = defectSeverityStore;
  }

  @action('获取所有缺陷严重级别') getAllDefectSeverity = async () =>{
    const {store} = this;
    await fetchApi(defectSeverity.listAll,{}).then((res)=>{
      if (res.status === '0'){
        store.allSeverities = _.cloneDeep(res.data.defectSeverities);
      } else {
        message.error(res.msg ? res.msg : res.errorMsg);
      }
    });
  }

}

export class DefectPriorityAction{
  constructor({defectPriorityStore}){
    this.store = defectPriorityStore;
  }

  @action('获取所有缺陷优先级') getAllDefectPriority = async () =>{
    const {store} = this;
    await fetchApi(defectPriority.listAll,{}).then((res)=>{
      if (res.status === '0'){
        store.allPriorities = _.cloneDeep(res.data.defectPriorities);
      } else {
        message.error(res.msg ? res.msg : res.errorMsg);
      }
    });
  }

}

export class ProductVersionAction{
  constructor({productVersionStore}){
    this.store = productVersionStore;
  }

  @action('获取所有缺陷优先级') getAllProductVersions = async () =>{
    const {store} = this;
    await fetchApi(productVersion.listAll,{}).then((res)=>{
      if (res.status === '0'){
        store.allProductVersions = _.cloneDeep(res.data.productVersions);
      } else {
        message.error(res.msg ? res.msg : res.errorMsg);
      }
    });
  }

}

export class TeamAction{
  constructor({teamStore}){
    this.store = teamStore;
  }

  @action('获取所有缺陷优先级') getAllTeams = async () =>{
    const {store} = this;
    await fetchApi(team.listAll,{}).then((res)=>{
      if (res.status === '0'){
        store.allTeams = _.cloneDeep(res.data.teams);
      } else {
        message.error(res.msg ? res.msg : res.errorMsg);
      }
    });
  }

}