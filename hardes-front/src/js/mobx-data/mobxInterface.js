import {InterfaceAction} from './actions/interfaceAction';
import {InterfaceStore} from './stores/interfaceStore';

const store = {
  interfaceStore: new InterfaceStore(),
};

const action = {
  interfaceAction: new InterfaceAction(store),
};

export default {
  store,
  action,
};