import { observable } from 'mobx';

export class ScriptStore {

  @observable scriptList = null;
  @observable variableList = null;
  @observable isLoading = null;
  @observable editLoading = null;


}
