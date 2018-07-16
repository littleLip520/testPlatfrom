import {EnvironmentAction} from './actions/environmentAction';
import {EnvironmentStore} from './stores/environmentStore';

const store = {
  environmentStore: new EnvironmentStore(),
};

const action = {
  environmentAction: new EnvironmentAction(store),
};

export default {
  store,
  action,
};