import { observable } from 'mobx';

export class ProductStore {
  @observable originalProductType = {};
  @observable productType = null;
  @observable productName = null;
  @observable featureList = null;
  @observable productNameOptions = null;
  @observable featureDefaultValues = {
    defaultProductTypeValue: '',
    defaultProductNameValue: '',
    defaultInputValue: ''
  };
  @observable unitList = null;
}
