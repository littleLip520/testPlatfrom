import {action} from 'mobx';
import {message} from 'antd';
import _ from 'lodash';
import fetchApi from '../../fetch/fetchApi';
import apiConfig from '../../api/defect';

export default class DefectAction {
  constructor({defectStore}){
    this.store = defectStore;
  }

  @action('分页获取的缺陷列表') getDefectList = async (data) => {
    const {store} = this;
    await fetchApi(apiConfig.defect.list,data).then((res) => {
      store.isLoading = true;
      if (res.status === '0'){
        store.defectList = _.cloneDeep(res.data.defects);
        store.pagination.total = res.data.totalNumber;
        store.isLoading = false;
      }else {
        store.isLoading = false;
        message.error(res.msg ? res.msg : res.errorMsg);
      }
    });
  };

  @action('添加缺陷') addDefect = async(data) =>{
    let flag = true;
    await fetchApi(apiConfig.defect.add, data).then((res) => {
      if (res.status === '0'){
        message.info('添加成功');
      } else {
        flag = false;
        message.error(res.errorMsg ? res.errorMsg : res.msg);
      }
      return flag;
    });
  };

  @action('更新缺陷') updateDefect = (data) => {
    let flag = true;
    return fetchApi(apiConfig.defect.update, data).then((res) => {
      if (res.status === '0'){
        message.info('更新成功');
      } else {
        flag = false;
        message.error(res.msg ? res.msg : res.errorMsg);
      }
      return flag;
    });
  };

  @action('获取所有缺陷') getAllDefect = () => {
    const {store} = this;
    fetchApi(apiConfig.defect.listAll, {}).then((res) => {
      if (res.status === '0'){
        store.allDefect = _.cloneDeep(res.data.defects);
      }
    });
  };

  @action('删除缺陷') deleteDefect = async (id) => {
      let path = apiConfig.defect.delete.path;
      const config = {
        ...apiConfig.defect.delete,
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

  @action('根据ID获取缺陷') getDefectById = async (id) => {
    const {store} = this;
    let path = apiConfig.defect.detail.path;
    const api = {
      ...apiConfig.defect.detail,
      path: path+id,
    };
    let flag = true;
    return await fetchApi(api,{}).then((res)=>{
      if (res.status === '0'){
        store.defect = _.cloneDeep(res.data.defect);
      } else {
        message.error(res.msg?res.msg:res.errorMsg);
        flag = false;
      }
      return flag;
    });
  };

}
