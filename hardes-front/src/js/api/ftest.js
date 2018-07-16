const service = 'ftest';

const ftest = {
  testcase:{
    query:{
      path: `${service}/api/v1/ftestcase/query`
    },
    detail:{
      path: `${service}/api/v1/ftestcase/`,
      method: 'get'
    },
    add:{
      path: `${service}/api/v1/ftestcase/add`
    },
    update:{
      path: `${service}/api/v1/ftestcase/update`
    },
    delete:{
      path: `${service}/api/v1/ftestcase/del/`,
      method: 'get'
    },
    updateReviewStatus:{
      path: `${service}/api/v1/ftestcase/updateReviewStatus`
    },
    updateStatus:{
      path: `${service}/api/v1/ftestcase/updateStatus`
    },
  },
  testsuite:{
    query:{
      path: `${service}/api/v1/ftestsuite/query`
    },
    add:{
      path: `${service}/api/v1/ftestsuite/add`
    },
    update:{
      path: `${service}/api/v1/ftestsuite/update`
    },
    delete:{
      path: `${service}/api/v1/ftestsuite/del/`,
      method: 'get'
    },
    addCase: {
      path: `${service}/api/v1/ftestsuitecase/add`
    },
    detail: {
      path: `${service}/api/v1/ftestsuite/`,
      method: 'get',
    },
    listCase: {
      path: `${service}/api/v1/ftestsuitecase/query`
    }
  },
  execute: {
    single:{
      path: `${service}/api/v1/ftestsuitecase/update`
    },
    batch: {
      path:`${service}/api/v1/ftestsuitecase/updateTestCaseExeucteStatusWithBatch`
    },
    delete: {
      path: `${service}/api/v1/ftestsuitecase/del/`,
      method: 'get'
    },
    deteteBatch: {
      path: `${service}/api/v1/ftestsuitecase/del`,
    },
    detail: {
      path: `${service}/api/v1/ftestsuitecase/`,
      method: 'get',
    }
  },
  log: {
    query: {
      path: `${service}/api/v1/ftestlog/query`
    }
  }
};

export default ftest;
