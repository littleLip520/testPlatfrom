import { observable } from 'mobx';

export default class IterationStore {
  @observable iterationList = null;
  @observable allIteration = null;
  @observable iterationStatus = [
    {
      status: 0,
      name: '规划中'
    },
    {
      status: 1,
      name: '已上线'
    },
    {
      status: 2,
      name: '已取消'
    },
    {
      status: 3,
      name: '进行中'
    },
  ];
  @observable isLoading = false;
  @observable iterationDetail = null;
  @observable total = null;
  @observable pagination = {
      pageNum: 1,
      pageSize: 10,
      current:1,
  };
  @observable allBusiness = null;
  @observable businessList = null;
  @observable businessCount = 0;
  @observable exceptionList = null;
  @observable exceptionDetail = null;
  @observable exceptionCount = 0;
  @observable exceptionStatus = [
    {
      status: 0,
      name: 'Open'
    },
    {
      status: 1,
      name: 'Closed'
    }
  ];
  @observable showUpdateModal = false;
  @observable iterationNameDisabled = true;
}
