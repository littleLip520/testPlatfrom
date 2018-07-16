import { observable } from 'mobx';

export default class DefectStore {
  @observable defectList = null;
  @observable allDefect = null;
  @observable isLoading = false;
  @observable defectDetail = null;
  @observable total = null;
  @observable pagination = {
      pageNum: 1,
      pageSize: 10,
      current:1,
  };
  @observable defectNameDisabled = true;
}
