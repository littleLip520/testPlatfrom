import { observable } from 'mobx';

export class UserStore {
  @observable authInfo = null;
  @observable name = '';
  @observable email = '';
  @observable roleId = '';
  @observable username = '';
  @observable mobile = '';

  @observable userInfoList = null;
  @observable roleList = null;
  @observable authList = null;
  @observable roleAuthList = null;
  @observable simpleRoleAuthList = null;
  @observable editingAuthList = null;
  @observable defaultRoleName = null;
  @observable roleAuthTotal = 0;
  @observable authTotal = 0;
  @observable allActiveUser = null;
  @observable allUsers = null;
  @observable loginLoading = false;
}
