import { observable } from 'mobx';

export class InterfaceStore {

  @observable interfaceInfoList = null;
  @observable isLoading = null;
  @observable pagination = {
    pageRequest:{
      pageNum: 1,
      pageSize: 10,
    },
    serviceId:null
  };
  @observable total = null;

  @observable systemList = null;

}
