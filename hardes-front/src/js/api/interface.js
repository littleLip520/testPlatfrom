const service = 'hades-interface';
const interfaceApi = {
  interface: {
    list: {
      path: `${service}/api/v1/getInterfaceList`,
    },
    create: {
      path: `${service}/api/v1/addInterface`,
    },
    update: {
      path: `${service}/api/v1/updateEnvironmentConfig`,
      },
    //   delete: {
    //     path: `${service}/api/v1/deleteEnvironmentConfig`,
    //   }
    //   // listActive:{
    //   //   path: 'user/api/v1/getActiveUserList'
    //   // }
    // }
  }
};

export default interfaceApi;
