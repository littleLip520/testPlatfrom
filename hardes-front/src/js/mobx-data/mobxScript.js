import {ScriptAction} from './actions/scriptAction';
import { ScriptStore } from './stores/scriptStore';

const store = {
  scriptStore: new ScriptStore(),
};

const action = {
  scriptAction: new ScriptAction(store),
};

export default {
  store,
  action,
};