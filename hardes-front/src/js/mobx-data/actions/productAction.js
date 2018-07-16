import { action, runInAction } from 'mobx';
import React from 'react';
import {Select} from 'antd';
import { message } from 'antd';
import _ from 'lodash';

import manage from '../../api/manage';
import fetchApi from '../../fetch/fetchApi';

const Option = Select.Option;
const { product, productName, feature,unit, } = manage;
export class ProductAction {
    constructor({ productStore }) {
      this.store = productStore;
    }

    @action('更新产品类型') updateProduct = async (data) => {
        let flag = true;
        return await fetchApi(product.update,data).then((res)=>{
            if(res.status !== '0'){
                flag = false;
                message.error(res.errorMsg);
            }else {
                message.info('操作成功');
              }
            return flag;
        });
    };

    @action('删除产品类型') deleteProduct = async (id) => {

    const delApi = product.del.path;
    const tmpApi = product.del;
    tmpApi.path += '/'+id;

    return await fetchApi(tmpApi, {}).then((res) => {
      let flag = true;
      if (res.status === '0'){
        message.info('操作成功');
        tmpApi.path = delApi;
      } else {
        flag = false;
        message.error(res.errorMsg?res.errorMsg:res.msg);
      }
      return flag;
    });
    };

    @action('添加产品类别') addProduct = async (data) => {
        let flag = true;
        return await fetchApi(product.add,data).then((res)=>{
            if(res.status !== '0'){
                flag = false;
                message.error(res.errorMsg?res.errorMsg:res.msg);
            }else {
                message.info('操作成功');
              }
            return flag;
        });
    };

    @action('更新产品名称') updateProductName = async (data) => {
        let flag = true;
        return await fetchApi(productName.update,data).then((res)=>{
            if(res.status !== '0'){
                flag = false;
                message.error(res.errorMsg?res.errorMsg:res.msg);
            }else {
                message.info('操作成功');
              }
            return flag;
        });
    }

    @action('获取所有产品类型列表') getAllProductType = async () =>{
        return await fetchApi(product.listAll,{}).then((res) =>{
            let productTypes = [];
            if (res.status === '0'){
                productTypes = res.data.productMgmtTypes;
            }else{
                message.error(res.errorMsg?res.errorMsg:res.msg);
            }
            return productTypes;
        });
    };

    @action('获取产品类型列表') getTypes = async () => {
        const {store} = this;
        await fetchApi(product.list,{pageNum:1, pageSize:9999}).then((res)=>{
            if(res.status !== '0'){
                message.error(res.errorMsg?res.errorMsg:res.msg);
            }else{
                runInAction(()=>{
                    store.originalProductType = res.data.productMgmtTypes;
                    const productType = _.cloneDeep(res.data.productMgmtTypes);
                    store.productType = productType;
                });
            }
        });
    }

    @action('根据产品类型Id获取产品名称列表') getProductNameListByTypeId = async (id) => {
      const {store} = this;
      const path = product.nameList.path;
      const config = {
        ...product.nameList,
        path: path+id,
      };
        // const delApi = product.nameList.path;
        // const tmpApi = product.nameList;
        // let tmpPath = delApi;
        // tmpPath += id;
        // tmpApi.path = tmpPath;
        await fetchApi(config, {}).then((res) =>{
            if(res.status === '0'){
              store.productName = _.cloneDeep(res.data.productMgmtNames);
            }else{
                message.error(res.errorMsg?res.errorMsg:res.msg);
            }
        });
    };

  @action('初始化产品名称列表') initProductNameList = async () => {
    const {store} = this;
    await this.getTypes();
    const delApi = product.nameList.path;
    const tmpApi = product.nameList;
    let tmpPath = delApi;
    tmpPath += this.store.productType[0].id;
    tmpApi.path = tmpPath;
    await fetchApi(tmpApi, {}).then((res) =>{
      tmpApi.path = delApi;
      if(res.status === '0'){
        store.productName = _.cloneDeep(res.data.productMgmtNames);
      }else{
        message.error(res.errorMsg?res.errorMsg:res.msg);
      }
    });
  };


    @action('根据产品名称ID获取feature列表') getFeatureListByNameId = async (id) =>{
      const {store} = this;
        let featureList = [];
        const listApi = productName.featureList.path;
        const tmpApi = _.cloneDeep(productName.featureList);
        let tmpPath = listApi;
        tmpPath=tmpPath+id;
        tmpApi.path  = tmpPath;
        return await fetchApi(tmpApi, {}).then((res) =>{
            if(res.status === '0'){
              tmpPath = productName.featureList.path;
              featureList = res.data.productMgmtFeatureTypes;
              store.featureList = _.cloneDeep(featureList);
            }else{
                message.error(res.errorMsg?res.errorMsg:res.msg);
            }
            return featureList;
        });
    };
    @action('根据feature ID获取unit列表') getUnitListByFeatureId = async (id) =>{
        const {store} = this;
        let path = feature.unitList.path;
        const config = {
          ...feature.unitList,
          path: path+id
        };
        let unitList = [];
        return await fetchApi(config, {}).then((res) =>{
            if(res.status === '0'){

                unitList = res.data.productMgmtFeatureUnits;
                store.unitList = _.cloneDeep(res.data.productMgmtFeatureUnits);
            }else{
                message.error(res.errorMsg?res.errorMsg:res.msg);
            }
            return unitList;
        });
    };

    @action('添加产品名称') addProductName = async (data) => {
        let flag = true;
        return await fetchApi(productName.add,data).then((res)=>{
            if(res.status !== '0'){
                flag = false;
                message.error(res.errorMsg?res.errorMsg:res.msg);
            }else {
                message.info('操作成功');
              }
            return flag;
        });
    };

    @action('删除产品名称') deleteProductName = async (id) => {
        const delApi = productName.del.path;
        const tmpApi = productName.del;
        tmpApi.path += id;

        return await fetchApi(tmpApi, {}).then((res) => {
        let flag = true;
        if (res.status === '0'){
            message.info('操作成功');
            tmpApi.path = delApi;
        } else {
            flag = false;
            message.error(res.errorMsg?res.errorMsg:res.msg);
        }
        return flag;
        });
    };
    @action('更新Feature') updateFeature = async (data) => {
        let flag = true;
        return await fetchApi(feature.update,data).then((res)=>{
            if(res.status !== '0'){
                flag = false;
                message.error(res.errorMsg?res.errorMsg:res.msg);
            }else {
                message.info('操作成功');
              }
            return flag;
        });
    }

    @action('添加Feature') addFeature = async (data) => {
        let flag = true;
        return await fetchApi(feature.add,data).then((res)=>{
            if(res.status !== '0'){
                flag = false;
                message.error(res.errorMsg?res.errorMsg:res.msg);
            }else {
                message.info('操作成功');
              }
            return flag;
        });
    };

    @action('删除Feature') deleteFeature = async (id) => {
        const delApi = feature.del.path;
        const tmpApi = feature.del;
        tmpApi.path += id;

        return await fetchApi(tmpApi, {}).then((res) => {
        let flag = true;
        if (res.status === '0'){
            message.info('操作成功');
            tmpApi.path = delApi;
        } else {
            flag = false;
            message.error(res.errorMsg?res.errorMsg:res.msg);
        }
        return flag;
        });
    }
    @action('更新功能单元') updateUnit = async (data) => {
        let flag = true;
        return await fetchApi(unit.update,data).then((res)=>{
            if(res.status !== '0'){
                flag = false;
                message.error(res.errorMsg?res.errorMsg:res.msg);
            }else {
                message.info('操作成功');
              }
            return flag;
        });
    }

    @action('添加功能单元') addUnit = async (data) => {
        let flag = true;
        return await fetchApi(unit.add,data).then((res)=>{
            if(res.status !== '0'){
                flag = false;
                message.error(res.errorMsg?res.errorMsg:res.msg);
            }else {
                message.info('操作成功');
              }
            return flag;
        });
    }

    @action('删除功能单元') deleteUnit = async (id) => {
        const delApi = unit.del.path;
        const tmpApi = unit.del;
        tmpApi.path += id;

        return await fetchApi(tmpApi, {}).then((res) => {
        let flag = true;
        if (res.status === '0'){
            message.info('操作成功');
            tmpApi.path = delApi;
        } else {
            flag = false;
            message.error(res.errorMsg?res.errorMsg:res.msg);
        }
        return flag;
        });
    };

      @action('初始化产品名称列表') getProductNameOptions = async(id) => {
        const {store} = this;
        let options = [];
        await this.getProductNameListByTypeId(id);
        if(store.productName){
          _.each(store.productName,item => {
            options.push(
              <Option value={item.id} key={item.id}>
                {item.productName}
              </Option>
            );
          });
          store.productNameOptions = options;
        }
      };

    @action('设置feature大类产品类型默认值') setFeatureProductTypeDefaultValues = async(data) => {
      this.store.featureDefaultValues.defaultProductTypeValue = data;
    };
    @action('设置feature大类产品名称默认值') setFeatureProductNameDefaultValues = async(data) => {
      this.store.featureDefaultValues.defaultProductNameValue = data;
    }
    @action('设置feature大类名称默认值') setFeatureNameDefaultValues = async(data) => {
      this.store.featureDefaultValues.defaultInputValue = data;
    }
  }
