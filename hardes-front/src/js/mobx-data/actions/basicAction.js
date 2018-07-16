import {action} from 'mobx';
import {message} from 'antd';
import _ from 'lodash';
import fetchApi from '../../fetch/fetchApi';
import apiConfig from '../../api/manage';

export default class BasicAction {
  constructor({basicStore}){
    this.store = basicStore;
  }

  @action('获取所有异常事件类型') getAllExceptionType = async () => {
    const {store} = this;
    await fetchApi(apiConfig.exception.listAll,{}).then((res) => {
      if (res.status === '0'){
        store.allExceptionType = _.cloneDeep(res.data.exceptionEventTypes);
       }else {
        message.error(res.msg ? res.msg : res.errorMsg);
      }
    });
  };

  @action('获取所有迭代里程碑') getAlIterationMileStone = async () => {
    const {store} = this;
    await fetchApi(apiConfig.milestone.listAll,{}).then((res) => {
      if (res.status === '0'){
        store.allIterationMileStone = _.cloneDeep(res.data.iterationMilestones);
      }else {
        message.error(res.msg ? res.msg : res.errorMsg);
      }
    });
  };


}
