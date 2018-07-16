import React from 'react';
import {Select} from 'antd';
import _ from 'lodash';
import mobx from '../../mobx-data/mobxProduct';

const {action:{productAction}} = mobx;
const Option = Select.Option;

const getProductTypeOptions = () => {
    let options = [];
    productAction.getAllProductType().then((data) => {
        if(data){
            console.log(data);
            _.each(data,item => {
                options.push(
                    <Option value={item.id} key={item.id}>
                        {item.productTypeName}
                    </Option>
                );
            });
        }
    });
    return options;
  };

const getProductNameOptions = (id) => {
    let options = [];
    productAction.getProductNameListByTypeId(id).then(
        (data) =>{
            if(data){
                _.each(data,item => {
                    options.push(
                        <Option value={item.id} key={item.id}>
                            {item.productName}
                        </Option>
                    );
                });
            }
        }
    );
          
    return options;
  };

  export {
      getProductTypeOptions,getProductNameOptions
  };
