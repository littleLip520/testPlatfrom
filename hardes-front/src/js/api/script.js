const service = 'hades-interface';
const scriptApi = {
  script: {
    list: {
      path: `${service}/api/v1/interfaceCase/pageList`,
    },
    create: {
      path: `${service}/api/v1/interfaceCase/addScript`,
    },
    update: {
      path: `${service}/api/v1/updateEnvironmentConfig`,
    },
    delete: {
      path: `${service}/api/v1/interfaceCase/deleteScriptById`,
    },
    listByServiceId: {
      path: `${service}/api/v1/getInterfaceByServiceId/`,
    },
    query: {
      path: `${service}/api/v1/interfaceCase/getInfoNameByScriptId`,
    }

    // listActive:{
    //   path: 'user/api/v1/getActiveUserList'
    // }
  }

};

export default scriptApi;
