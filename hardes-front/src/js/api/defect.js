const service = 'quality';
const defect = {
  defect: {
    list: {
      path: `${service}/api/v1/defect/query`
    },
    add: {
      path: `${service}/api/v1/defect/add`
    },
    delete: {
      path: `${service}/api/v1/defect/del/`,
      method: 'get'
    },
    listAll: {
      path: `${service}/api/v1/defect/listAll`,
      method: 'get'
    },
    update: {
      path: `${service}/api/v1/defect/update`
    },
    detail: {
      path: `${service}/api/v1/defect/`,
      method: 'get'
    }
  }
};

export default defect;
