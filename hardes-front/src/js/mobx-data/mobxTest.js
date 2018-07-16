import {TestAction} from './actions/testAction';
import {TestStore} from './stores/testStore';

const store = {
  testStore: new TestStore(),
};
const action = {
  testAction: new TestAction(store),
};

export default {
  store,
  action
};
