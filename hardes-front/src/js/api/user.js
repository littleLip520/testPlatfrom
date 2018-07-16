const service = 'user';
const userApi = {
    login:{
        accountLogin:{
           path: `${service}/api/v1/login`,
       },
       tokenLogin: {
        path: 'user/api/v1/loginByToken',
       }
    },
  user: {
      list: {
        path: 'user/api/v1/getUserList',
      },
      update: {
        path: 'user/api/v1/updateUser',
      },
      listActive:{
        path: 'user/api/v1/getActiveUserList'
      },
    listAll: {
      path: 'user/api/v1/getAllUser',
    },
    info: {
        path: 'user/api/v1/getUserInfo'
    }
  },
  role: {
      list: {
        path: `${service}/api/v1/getRoleList`
      },
      create: {
        path: `${service}/api/v1/createRole`
      },
    update: {
        path: `${service}/api/v1/updateRole`
      },
    listAll: {
        path: `${service}/api/v1/getAllRoles`
      },
    delete:{
      path: `${service}/api/v1/deleteRole`
    }
  },
  auth: {
      list:{
        path: `${service}/api/v1/getAuthList`
      },
    listAll:{
        path: `${service}/api/v1/getAllAuth`
      },
      create: {
        path: `${service}/api/v1/createAuth`
      },
    update: {
        path: `${service}/api/v1/updateAuth`
      },
    delete: {
        path: `${service}/api/v1/deleteAuth`
      },
  },
  roleAuth: {
      list: {
        path: `${service}/api/v1/getRoleAuthList`
      }
  }
};

export default userApi;
