import { action } from 'mobx';
import _ from 'lodash';
import fetchApi from '../../fetch/fetchApi';
import apiConfig from '../../api/ftest';
import { message } from 'antd';
export class TestAction {
  constructor({testStore}){
    this.store = testStore;
  }

  @action('分页获取测试用例列表') getTestcaseList = async (data) => {
    const {store} = this;
    store.testCaseLoading = true;
    await fetchApi(apiConfig.testcase.query,data).then((res)=>{
      if (res.status === '0'){
        store.dataSource = _.cloneDeep(res.data.testCases);
        store.request.pageRequest.total = res.data.totalNumber;
      }else {
        message.error(res.errorMsg?res.errorMsg:res.msg);
      }
      store.testCaseLoading = false;
    });
  };

  @action('添加测试用例') addTestcase = async (data) =>{
    let flag = true;
    return await fetchApi(apiConfig.testcase.add,data).then((res)=>{
      if (res.status !== '0'){
        flag = false;
        message.error(res.errorMsg?res.errorMsg:res.msg);
      }else {
        message.success('添加成功');
      }
      return flag;
    });
  };

  @action('更新评审状态') updateReviewStatus = async(data) => {
    await fetchApi(apiConfig.testcase.updateReviewStatus,data).then((res)=>{
      if (res.status === '0'){
        message.info('更新成功');
      } else {
        message.error(res.msg?res.msg:res.errorMsg);
      }
    });
  };
  @action('更新状态') updateStatus = async(data) => {
    await fetchApi(apiConfig.testcase.updateStatus,data).then((res)=>{
      if (res.status === '0'){
        message.info('更新成功');
      } else {
        message.error(res.msg?res.msg:res.errorMsg);
      }
    });
  };

  @action('删除测试用例') deleteTestCase = async (id) => {
    let path = apiConfig.testcase.delete.path;
    const api = {
      ...apiConfig.testcase.delete,
      path:path+id,
    };
    await fetchApi(api,{}).then((res)=>{
      if (res.status === '0'){
        message.info('删除成功');
      } else {
        message.error(res.msg?res.msg:res.errorMsg);
      }
    });
  };

  @action('更新分页信息') updatePagination = (pagination) => {
    const { store } = this;
    store.request.pageRequest = {...pagination};
  };
  @action('设置分页请求数据') updateRequestData = (request) =>{
    const { store } = this;
    store.request = {...request};
  };

  @action('根据ID获取测试用例详情') getTestCaseById = async (id) => {
    const {store} = this;
    let path = apiConfig.testcase.detail.path;
    const api = {
      ...apiConfig.testcase.detail,
      path: path+id,
    };
    let flag = true;
    return await fetchApi(api,{}).then((res)=>{
      if (res.status === '0'){
        store.testcase = _.cloneDeep(res.data.testCase);
      } else {
        message.error(res.msg?res.msg:res.errorMsg);
        flag = false;
      }
      return flag;
    });
  };

  @action('更新测试用例') updateTestCase = (data) =>{
    let flag = true;
    return fetchApi(apiConfig.testcase.update,data).then((res)=>{
      if (res.status === '0'){
        message.success('更新成功');
      } else {
        flag = false;
        message.error(res.msg?res.msg:res.errorMsg);
      }
      return flag;
    });
  };

  @action('分页获取测试集列表') getTestSuiteList = async (data) => {
    const {store} = this;
    store.testSuiteLoading = true;
    let total = null;
    return  await fetchApi(apiConfig.testsuite.query,data).then((res)=>{
      if (res.status === '0'){
        store.testSuiteList = _.cloneDeep(res.data.testSuites);
        total = res.data.totalNumber;
      }else {
        message.error(res.errorMsg?res.errorMsg:res.msg);
      }
      store.testSuiteLoading = false;
      return total;
    });
  };

  @action('更新分页信息') updateSuitePageInfo = (pageRequest) =>{
    const {store} = this;
    store.getTestSuiteRequest.pageRequest = pageRequest;
  };

  @action('添加测试集') addTestSuite = (data) =>{
    const {store} = this;
    let flag = true;
    return fetchApi(apiConfig.testsuite.add,data).then((res) => {
      if (res.status === '0'){
        store.testSuiteId = res.data.id;
        message.success('添加成功');
      } else {
        message.error(res.errorMsg?res.errorMsg:res.msg);
        flag = false;
      }
      return flag;
    });
  };

  @action('更新被选中的测试用例ID列表') updateSelectRowKeys = (selectedRowKeys) => {
    const {store} = this;
    store.selectedTestCaseRowKeys = selectedRowKeys;
  };

  @action('测试集添加或者更新测试用例') addOrUpdateTestCaseList = (data) => {
    const {store} = this;
    let flag = true;
    store.addBtnLoading = true;
    return fetchApi(apiConfig.testsuite.addCase,data).then((res)=>{
      if (res.status === '0'){
        message.success('添加成功');
      } else {
        message.error(res.errorMsg?res.errorMsg:res.msg);
        flag = false;
      }
      store.addBtnLoading = false;
      return flag;
    });
  };

  @action('删除测试集') deleteTestSuite = (id) => {
    let flag = true;
    let path = apiConfig.testsuite.delete.path;
    const config = {
      ...apiConfig.testsuite.delete,
      path: path+id,
    };
    return fetchApi(config,{}).then((res) => {
      if (res.status === '0'){
        message.success('删除成功');
      } else {
        message.error(res.errorMsg?res.errorMsg:res.msg);
        flag = false;
      }
      return flag;
    });
  };

  @action('根据ID获取测试集详情') getTestSuiteById = (id) => {
    const {store} = this;
    const path = apiConfig.testsuite.detail.path;
    const config = {
      ...apiConfig.testsuite.detail,
      path: path + id,
    };
    fetchApi(config,{}).then((res) => {
      if (res.status === '0'){
        store.testSuite = _.cloneDeep(res.data.testSuite);
      }
    });
  };

  @action('更新测试集信息') updateTestSuite = (data) => {
    const { store } = this;
    store.addBtnLoading = true;
    let flag = true;
    return fetchApi(apiConfig.testsuite.update,data).then((res)=>{
      if (res.status === '0'){
        message.success('更新成功');
      }else {
        message.error(res.errorMsg?res.errorMsg:res.msg);
        flag = false;
      }
      store.addBtnLoading = false;
      return flag;
    });
  };

  @action('根据测试集ID获取测试用例列表') getTestCaseListBySuiteId = (data) => {
    const {store} = this;
    store.testCaseLoading = true;
    return fetchApi(apiConfig.testsuite.listCase,data).then((res)=>{
      if (res.status === '0'){
        const selectedTestCaseRowKeys = [];
        const testCaseList = [];
        _.each(res.data.testExecuteCases,(item)=>{
          testCaseList.push(item);
          selectedTestCaseRowKeys.push(item.testCaseId);
        });
        store.testCaseList = _.cloneDeep(testCaseList);
        this.updateExecuteCaseList(selectedTestCaseRowKeys);
      }
      store.testCaseLoading = false;
      return res.data.totalNumber;
    });
  };

  @action('设置用例选择列表') updateExecuteCaseList = (data) =>{
    const {store} = this;
    store.executeCaseIdList = data;
  };

  @action('设置更新用例选择列表') setUpdateSuiteCaseList = (data) => {
    const {store} = this;
    store.updateTestCaseRows = data;
  };

  @action('设置添加用例选择列表') setAddTestCaseList = (data) =>{
    const {store} = this;
    store.selectedTestCaseRowKeys = data;
  };

  @action('执行用例') executeCase = async(data) => {
    let flag = true;
    return await fetchApi(apiConfig.execute.single,data).then((res)=>{
      if (res.status === '0'){
        message.success('执行成功');
      } else {
        message.error(res.errorMsg?res.errorMsg:res.msg);
        flag = false;
      }
      return flag;
    });
  };

  @action('删除执行用例') deleteExecuteCase = (id) => {
    const path = apiConfig.execute.delete.path;
    const config = {
      ...apiConfig.execute.delete,
      path: path + id,
    };

    return fetchApi(config,{}).then((res) => {
      let flag = true;
      if (res.status === '0'){
        message.success('删除成功');
      } else {
        message.error(res.errorMsg?res.errorMsg:res.msg);
        flag = false;
      }
      return flag;
    });
  };

  @action('批量删除执行用例') batchDeleteExecuteCase = (data) => {
    let flag = true;
    return fetchApi(apiConfig.execute.deteteBatch, data).then((res)=>{
      if (res.status === '0'){
        message.success('删除成功');
      } else {
        message.error(res.errorMsg?res.errorMsg:res.msg);
        flag = false;
      }
      return flag;
    });
  }

  @action('分页获取测试用例执行列表') getTestExecuteLogList = async (data) => {
    const {store} = this;
    store.testSuiteLoading = true;
    let total = null;
    return  await fetchApi(apiConfig.log.query,data).then((res)=>{
      if (res.status === '0'){
        store.testExecuteLogList = _.cloneDeep(res.data.testCaseExecuteLogs);
        total = res.data.totalNumber;
      }else {
        message.error(res.errorMsg?res.errorMsg:res.msg);
      }
      store.testSuiteLoading = false;
      return total;
    });
  };

  @action('根据ID获取执行用例详情') getTestSuiteCaseById = async(id) => {
    const {store} = this;
    const path = apiConfig.execute.detail.path;
    const config = {
      ...apiConfig.execute.detail,
      path: path + id,
    };
   return await fetchApi(config,{}).then((res) => {
      if (res.status === '0'){
        store.testExecute = _.cloneDeep(res.data.testExecuteCase);
        console.log(store.testExecute);
        return  store.testExecute;
      }
    });

  };
}
