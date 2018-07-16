const service = 'hades-interface';
const environmentApi = {
  environment: {
    list: {
      path: `${service}/api/v1/getEnvironmentList`,
    },
    create: {
      path: `${service}/api/v1/createEnvironmentConfig`,
    },
    update: {
      path: `${service}/api/v1/updateEnvironmentConfig`,
    },
    delete: {
      path: `${service}/api/v1/deleteEnvironmentConfig`,
    },
    listAll:{
      path:  `${service}/api/v1/listAll`,
      method: 'get'
    }
  }

};

export default environmentApi;
