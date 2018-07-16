// const url = 'http://localhost:8087';

const manage =
  {
    productLine: {
      list: {
        path: 'management/api/v1/productlines/listByPage'
      },
      add: {
        path: 'management/api/v1/productlines/add'
      },
      del: {
        path: 'management/api/v1/productlines/del',
        method: 'get'
      },
      update: {
        path: 'management/api/v1/productlines/update'
      },
      listAll: {
        path: 'management/api/v1/productlines/listAll',
        method:'get'
      },
    },
    system: {
      list: {
        path: 'management/api/v1/systems/listByPage',
      },
      add: {
        path: 'management/api/v1/systems/add',
      },
      update: {
        path: 'management/api/v1/systems/update',
      },
      del: {
        path: 'management/api/v1/systems/del/',
        method: 'get',
      },
      listAll: {
        path: 'management/api/v1/systems/listAll',
        method: 'get',
      },
    },
    service: {
      list: {
        path: 'management/api/v1/services/listByPage',
      },
      add: {
        path: 'management/api/v1/services/add',
      },
      update: {
        path: 'management/api/v1/services/update',
      },
      del: {
        path: 'management/api/v1/services/del/',
        method: 'get',
      },
      listAll: {
        path: 'management/api/v1/services/listAll',
        method: 'get',
      },
      serviceList: {
        path: 'management/api/v1/services/bySystem/',
      },
    },
    customer:{
      list: {
        path: 'management/api/v1/customers/listByPage',
      },
      listAll: {
        path: 'management/api/v1/customers/listAll',
        method: 'get'
      },
      add: {
        path: 'management/api/v1/customers/add',
      },
      update: {
        path: 'management/api/v1/customers/update',
      },
      del: {
        path: 'management/api/v1/customers/del/',
        method: 'get',
      }
    },
    exception:{
      list: {
        path: 'management/api/v1/exceptioneventtypes/listByPage',
       },
      listAll: {
        path: 'management/api/v1/exceptioneventtypes/listAll',
        method: 'get',
      },
      add: {
        path: 'management/api/v1/exceptioneventtypes/add',
      },
      update: {
        path: 'management/api/v1/exceptioneventtypes/update',
      },
      del: {
        path: 'management/api/v1/exceptioneventtypes/del/',
        method: 'get',
      }
    },
    milestone:{
      list: {
        path: 'management/api/v1/iterationmilestones/listByPage',
      },
      listAll: {
        path: 'management/api/v1/iterationmilestones/listAll',
        method: 'get',
      },
      add: {
        path: 'management/api/v1/iterationmilestones/add',
      },
      update: {
        path: 'management/api/v1/iterationmilestones/update',
      },
      del: {
        path: 'management/api/v1/iterationmilestones/del/',
        method: 'get',
      }
    },
    strategy:{
      list: {
        path: 'management/api/v1/strategies/listByPage',
      },
      listAll: {
        path: 'management/api/v1/strategies/listAll',
        method: 'get'
      },
      add: {
        path: 'management/api/v1/strategies/add',
      },
      update: {
        path: 'management/api/v1/strategies/update',
      },
      del: {
        path: 'management/api/v1/strategies/del/',
        method: 'get',
      }
    },
    pipeline:{
      list: {
        path: 'management/api/v1/pipelinenodes/listByPage',
      },
      add: {
        path: 'management/api/v1/pipelinenodes/add',
      },
      update: {
        path: 'management/api/v1/pipelinenodes/update',
      },
      del: {
        path: 'management/api/v1/pipelinenodes/del/',
        method: 'get',
      }
    },
    product:{
      list: {
        path: 'management/api/v1/productmgmttypes/listByPage',
      },
      listAll: {
        path: 'management/api/v1/productmgmttypes/listAll',
        method: 'get',
      },
      add: {
        path: 'management/api/v1/productmgmttypes/add',
      },
      update: {
        path: 'management/api/v1/productmgmttypes/update',
      },
      del: {
        path: 'management/api/v1/productmgmttypes/del/',
        method: 'get',
      },
      nameList: {
        path: 'management/api/v1/productmgmtnames/byproducttype/',
        method: 'get'
      }
    },
    productName:{
      list: {
        path: 'management/api/v1/productmgmtnames/listByPage',
      },
      add: {
        path: 'management/api/v1/productmgmtnames/add',
      },
      update: {
        path: 'management/api/v1/productmgmtnames/update',
      },
      del: {
        path: 'management/api/v1/productmgmtnames/del/',
        method: 'get',
      },
      featureList: {
        path:'management/api/v1/productmgmtfeaturetypes/byproductname/',
        method: 'get'
      },
    },
    feature:{
      list: {
        path: 'management/api/v1/productmgmtfeaturetypes/listByPage',
      },
      add: {
        path: 'management/api/v1/productmgmtfeaturetypes/add',
      },
      update: {
        path: 'management/api/v1/productmgmtfeaturetypes/update',
      },
      del: {
        path: 'management/api/v1/productmgmtfeaturetypes/del/',
        method: 'get',
      },
      unitList:{
        path: 'management/api/v1/productmgmtfeatureunits/byfeaturetype/',
        method: 'get'
      }
    },
    unit:{
      list: {
        path: 'management/api/v1/productmgmtfeatureunits/listByPage',
      },
      add: {
        path: 'management/api/v1/productmgmtfeatureunits/add',
      },
      update: {
        path: 'management/api/v1/productmgmtfeatureunits/update',
      },
      del: {
        path: 'management/api/v1/productmgmtfeatureunits/del/',
        method: 'get',
      }
    },
    defectStatus: {
      listAll: {
        // url,
        path: 'management/api/v1/defectStatus/listAll',
        method:'get'
      },
    },
    defectSeverity: {
      listAll: {
        path: 'management/api/v1/defectSeverity/listAll',
        method:'get'
      },
    },
    defectPriority: {
      listAll: {
        path: 'management/api/v1/defectPriority/listAll',
        method:'get'
      },
    },
    productVersion: {
      listAll: {
        path: 'management/api/v1/productVersion/listAll',
        method:'get'
      },
    },
    team: {
      listAll: {
        path: 'management/api/v1/team/listAll',
        method:'get'
      },
    },
  };

export default manage;
