const service = 'iteration';
const iteration = {
  iteration: {
    list: {
      path: `${service}/api/v1/iteration/query`,
    },
    add: {
      path: `${service}/api/v1/iteration/add`
    },
    delete: {
      path: `${service}/api/v1/iteration/del/`,
      method: 'get'
    },
    listAll: {
      path: `${service}/api/v1/iteration/listAll`,
      method: 'get'
    },
    update: {
      path: `${service}/api/v1/iteration/update`
    },
    detail: {
      path: `${service}/api/v1/iteration/`,
      method: 'get'
    },
    updateStatus: {
      path: `${service}/api/v1/iteration/updateStatus`
    },
    listByPrdIdAndStatus: {
      path: `${service}/api/v1/iteration/listAllByProduct`
    }
  },
  business:{
    listAll:{
      path: `${service}/api/v1/business/listAll`,
      method: 'get'
    },
    list:{
      path: `${service}/api/v1/business/query`,
    },
    update:{
      path: `${service}/api/v1/business/update`,
    },
    delete:{
      path: `${service}/api/v1/business/del/`,
      method:'get'
    },
    add:{
      path: `${service}/api/v1/business/add`,
    }
  },
  exceptionEvent:{
    listAll:{
      path: `${service}/api/v1/exception/listAll`,
      method: 'get'
    },
    list:{
      path: `${service}/api/v1/exception/query`,
    },
    update:{
      path: `${service}/api/v1/exception/update`,
    },
    updateStatus:{
      path: `${service}/api/v1/exception/updateStatus`,
    },
    delete:{
      path: `${service}/api/v1/exception/del/`,
      method:'get'
    },
    add:{
      path: `${service}/api/v1/exception/add`,
    },
    detail: {
      path: `${service}/api/v1/exception/`,
      method: 'get'
    },
  }
};

export default iteration;
