import { observable } from 'mobx';

export class TestStore{
  @observable testCaseLoading=false;
  @observable dataSource=null;
  @observable request = {
    pageRequest:{
      current:1,
      pageSize:10,
      pageNum:1
    },
  };
  @observable testcase = null;
  @observable testSuiteLoading = false;
  @observable getTestSuiteRequest = {
    pageRequest:{
      current:1,
      pageSize:10,
      pageNum:1
    },
  };
  @observable testSuiteList = null;
  @observable testSuiteId = null;
  @observable selectedTestCaseRowKeys=[];
  @observable addBtnLoading = false;
  @observable testSuite = null;
  @observable testCaseList = null;
  @observable executeCaseIdList = [];
  @observable updateTestCaseRows = [];
  @observable testExecuteLogList = null;
  @observable testExecute = null;
}
