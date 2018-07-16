import {UserAction} from './actions/userAction';
import {UserStore} from './stores/userStore';

const store = {
    userStore: new UserStore(),
};

const action = {
    userAction: new UserAction(store),
};

export default {
    store,
    action,
};