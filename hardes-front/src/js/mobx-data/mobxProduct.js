import { ProductStore } from './stores/productStore';
import { ProductAction } from './actions/productAction';

const store = {
    productStore: new ProductStore(),
};

const action = {
    productAction: new ProductAction(store),
};

export default{
    store,
    action
};
