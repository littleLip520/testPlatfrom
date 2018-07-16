import React from 'react';
import { Table, message, Divider, Button, Form, Popconfirm, Input, Modal, Select,Cascader } from 'antd';
import { observer } from 'mobx-react';
import _ from 'lodash';

import fetchApi from '../../fetch/fetchApi';
import mobx from '../../mobx-data/mobxProduct';
import manage from '../../api/manage';
import '../../../less/manage/baseSetting.less';

const { action: {productAction},store:{productStore} } = mobx;

const apiConfig = manage.feature;
const FormItem = Form.Item;
const Option = Select.Option;

const EditableContext = React.createContext();
const EditableRow = ({ form, index, ...props }) => (
  <EditableContext.Provider value={form}>
    <tr {...props} />
  </EditableContext.Provider>
);

const EditableFormRow = Form.create()(EditableRow);
const getProductTypeOptions = (data) => {
  let options = [];
  if(data){
    _.each(data,item => {
      options.push(
        <Option value={item.id} key={item.id}>
          {item.productTypeName}
        </Option>
      );
    });
  }
  return options;
};

const getProductNameOptions = () => {
  let options = [];
  console.log(333, productStore);
  const nameList = productStore.productName;
  console.log('222',nameList);
  if(productStore.productName){
    _.each(productStore.productName,item => {
      options.push(
        <Option value={item.id} key={item.id}>
          {item.productName}
        </Option>
      );
    });
  }
  return options;
};

@observer
class SelectComponent extends React.Component{
  componentWillMount(){
    if (this.props.dataIndex === 'productTypeId') {
      const defaultProductTypeValue = this.props.record[this.props.dataIndex];
      productAction.setFeatureProductTypeDefaultValues(defaultProductTypeValue);
    }
    if (this.props.dataIndex === 'productNameId') {
      const defaultProductNameValue = this.props.record[this.props.dataIndex];
      productAction.setFeatureProductNameDefaultValues(defaultProductNameValue);
    }
    if (this.props.dataIndex === 'featureType') {
      const defaultInputValue = this.props.record.featureType;
      productAction.setFeatureNameDefaultValues(defaultInputValue);
    }
  }

  onTypeSelect = async (id) => {
    await productAction.setFeatureProductTypeDefaultValues(id);
    await productAction.getProductNameListByTypeId(id);
    if (productStore.productName){
      await productAction.setFeatureProductNameDefaultValues(productStore.productName[0].id);
    }else {
      await  productAction.setFeatureNameDefaultValues('');
    }
  };

  onNameSelect = async(id) => {
    await productAction.setFeatureProductNameDefaultValues(id);
  };

  onInputChange = (e) =>{
    e.preventDefault();
    productAction.setFeatureNameDefaultValues(e.target.value);
  };
  render(){
    if(this.props.inputtype === 'input') {
      return <Input onChange={this.onInputChange} defaultValue={productStore.featureDefaultValues.defaultInputValue} className="editable-input"/>;
    }else if (this.props.inputtype ==='type') {
      return <Select
        className="product-type-selector"
        showSearch
        optionFilterProp="children"
        allowClear
        filterOption={(input, option) => option.props.children.toLowerCase()
          .indexOf(input.toLowerCase()) >= 0}
        onSelect={this.onTypeSelect}
        defaultValue={productStore.featureDefaultValues.defaultProductTypeValue}
      >
        {
          getProductTypeOptions(productStore.productType)
        }
      </Select>;
    }else if (this.props.inputtype === 'name'){
        return <Select
            className="product-type-selector"
            showSearch
            optionFilterProp="children"
            allowClear
            filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
            defaultValue={productStore.featureDefaultValues.defaultProductNameValue}
            onChange={this.onNameSelect}
          >
            {
              getProductNameOptions()
            }
          </Select>;
    }
  }
}

@observer
class EditableCell extends React.Component{
    render(){
      const {
        editing,
        dataIndex,
        title,
        record,
        ...restProps
      } = this.props;
      return(
        <EditableContext.Consumer>
          {
            (form) => {
              const {getFieldDecorator} = form;
              return(
                <td {...restProps}>
                  {editing ? (
                    <FormItem>
                      {
                        getFieldDecorator(dataIndex,{
                          rules: [{
                            required: true, message: `请输入${title}`
                          }],
                          initialValue: record[dataIndex],
                        })(<SelectComponent {...this.props}/>)
                      }
                    </FormItem>
                  ) : (
                    restProps.children
                  )
                  }
                </td>
              );
            }
          }
        </EditableContext.Consumer>
      );
    }

  }

@observer
@Form.create()
class Feature extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      editingkey: '',
      showModal: false,
      inputName: '',
      pagination:{
        pageSize:10,
        pageNum: 1,
      },
      confirmLoading: false,
      data:[],
      currentTypeId: '',
      cascaderOptions: [],
    };
    this.initCascaderOptions();
    this.columns = [
        {
          title: '产品类别',
          dataIndex: 'productTypeId',
          width: '20%',
          key: 'productTypeId',
          align: 'center',
          editable: true,
          render: (text,record,index) => {
            let name = '';
            _.forEach(productStore.productType, (item) => {
              if (item.id === record.productTypeId) {
                name = item.productTypeName;
              }
            });
            return name;
          }
        },
      {
        title: '产品名称',
        dataIndex: 'productNameId',
        width: '20%',
        key: 'productNameId',
        align: 'center',
        editable: true,
        render: (text,record,index) => {
          let name = record.productName;
          if(productStore.productName){
          _.forEach(productStore.productName, (item) => {
            if(item.id === record.productNameId){
              name = item.productName;
            }
          });
        }else{
          name = record.productName;
        }
          return name;
        }
      },
      {
        title: 'Feature大类',
        dataIndex: 'featureType',
        width: '20%',
        key: 'id',
        align: 'center',
        editable: true,
      },
      {
        title: '操作',
        width: '20%',
        dataIndex: 'operation',
        align: 'center',
        render: (text, record) => {
          const editable = this.isEditing(record);
          return(
            <div className="editable-row-operations">
              {
                editable ? (
                  <span>
                <EditableContext.Consumer>
                  {
                    form => (
                      <a href="javascript:;"
                         onClick={ () => this.save(form,record.id)}>
                        保存
                      </a>
                    )
                  }
                </EditableContext.Consumer>
                    <Divider type="vertical"/>
                <Popconfirm
                  title="确认取消？"
                  onConfirm={() => this.cancel(record.id)}>
                  <a>取消</a>
                </Popconfirm>
              </span>
                ) : (
                  <span>
                    <a onClick={() => this.edit(record.id)}>编辑</a>
                    <Divider type="vertical"/>
                    <Popconfirm
                      title="确认删除？"
                      onConfirm={() => this.delete(record.id)}
                    >
                      <a>删除</a>
                    </Popconfirm>
                  </span>
                )
              }
            </div>
          );
        },
      }
    ];
  }
  isEditing = (record) => {
    return record.id === this.state.editingkey;
  };

  edit = async(key) => {
    let currentTypeId = '';
    _.each(this.state.data, async(item) => {
      if(item.id === key){
        currentTypeId = item.productTypeId;
        await productAction.setFeatureProductTypeDefaultValues(item.productTypeId);
        await productAction.setFeatureProductNameDefaultValues(item.productNameId);
      }
    });
    this.setState({
      editingkey: key,
      currentTypeId
    });
   await productAction.getProductNameOptions(currentTypeId);
  };
  delete = (id) => {
    productAction.deleteFeature(id).then((flag) => {
      if(flag){
        this.fetchData(this.state.pagination);
      }
    });
  };
  save = async (form, key) => {
    form.validateFields((error, row) => {
      if (error) {
        return ;
      }
      const newData = [...this.state.data];
      const index = newData.findIndex(item => key === item.id);
      if (index > -1){
        const data = {
          id: key,
          featureType: productStore.featureDefaultValues.defaultInputValue,
          productTypeId: productStore.featureDefaultValues.defaultProductTypeValue,
          productNameId: productStore.featureDefaultValues.defaultProductNameValue,
        };
        productAction.updateFeature(data).then((flag) => {
          if(flag){
            const item = newData[index];
            item.featureType = data.featureType;
            item.productTypeId = data.productTypeId;
            item.productNameId = data.productNameId;
            newData.splice(index,1,{
              ...item
            });
            this.setState({
              data: newData,
              editingkey: ''
            });
          }
        });
      } else {
        newData.push(this.state.data);
        this.setState({ data: newData, editingKey: '' });
      }
    });
  };

  cancel = (key) => {
    this.setState({ editingkey: '' });
  };

  onAddProductBtnClick = () => {
    console.log(this.state);
    this.setState({
    showModal: true
    });
  };

  onModelCancel = () => {
    this.setState({
      showModal: false,
    });
  };
  onFormSubmit = (visible) => {
    this.props.form.validateFields((err, values) =>{
      if(err){
        return;
      }
      let types = values.productType;
      const datas = {
        featureType: values.featureType,
        productNameId: types[1]

      };
      productAction.addFeature(datas).then(
        (flag) => {
          if(flag){
            this.fetchData(this.state.pagination);
            this.setState({
              showModal: visible,
            });
          }
        }
      );

    });
  };

  onFormSubmitAndContinue = (visible) => this.onFormSubmit(visible);

  fetchData = async (pager) => {
    this.setState({
      loading: true
    });
    await fetchApi(apiConfig.list, pager).then((res) => {
      const pagination = {...this.state.pagination};
      if ((res.status === '0')){
        pagination.total = res.data.totalNumber;
        this.setState({
          data: res.data.productMgmtFeatureTypes,
          loading: false,
          pagination
      });
      } else {
        message.error(res.errorMsg);
      }
    });
  };

  handleTableChange = async (pagination) => {
    const pager = {...pagination};
    pager.pageNum = pagination.current;
    this.setState({
      pagination: pager
    });
    this.fetchData(pager);
  };

  initCascaderOptions = async() => {
    await productAction.getTypes();
    if (productStore.productType){
      let options = [];
      _.each(productStore.productType,(item) => {
        options.push({
          value: item.id,
          label: item.productTypeName,
          isLeaf: false
        });
      });
      this.setState({
        cascaderOptions: options
      });
    }
  };

  componentWillMount(){
    this.fetchData(this.state.pagination);
  }

  getDataIndex = (col) => {
    if (col.dataIndex === 'featureType'){
      return 'input';
    } else if (col.dataIndex === 'productTypeId'){
      return 'type';
    }else if(col.dataIndex === 'productNameId'){
      return 'name';
    }
  };

   loadData = async (selectedOptions) => {
     console.log(selectedOptions);
     const targetOptions = selectedOptions[selectedOptions.length-1];
     console.log(targetOptions);
     await productAction.getProductNameListByTypeId(targetOptions.value);
     console.log(productStore);
     targetOptions.loading = false;
     let subOptions = productStore.productName.map( (item) => {
      return  {
        label: item.productName,
        value: item.id,
         isLeaf: true,
      };
     });
     console.log(subOptions);
     targetOptions.children = subOptions;
    this.setState({
      cascaderOptions: [...this.state.cascaderOptions]
    });
   };
   onChange = async (value, selectedOptions) => {
     console.log('value',value);
     console.log('selected options', selectedOptions);
   };

  render(){
    const components = {
      body: {
        row: EditableFormRow,
        cell: EditableCell
      },
    };
    const columns = this.columns.map((col) => {
      if (!col.editable) {
        return col;
      }
      return {
        ...col,
        onCell: record => ({
          record,
          dataIndex: col.dataIndex,
          title: col.title,
          editing: this.isEditing(record),
          inputtype: this.getDataIndex(col)
        }),
      };
    });

    const formItemLayout = {
        labelCol: {
          xs: { span: 24 },
          sm: { span: 6 },
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 16 },
        },
      };
    const { getFieldDecorator } = this.props.form;

    return(
      <div className="product-name">
        <Button type="primary" className="add-product-btn" onClick={this.onAddProductBtnClick}>新增产品名称</Button>
        <Modal visible={this.state.showModal}
               title="添加Feature大类"
               closable={true}
               className="product-add-popup"
               onCancel={this.onModelCancel}
               destroyOnClose={true}
               footer={<span className="popup-btns">
                 <Button className="product-add-btn" type="primary" onClick={()=>{this.onFormSubmit(false);}}>保存</Button>
                 <Button className="product-add-btn" type="primary" onClick={() => {this.onFormSubmitAndContinue(true);}}>保存并继续添加</Button>
                 <Button className="product-add-btn" type="primary" onClick={this.onModelCancel}>取消</Button>
               </span>}
               confirmLoading
        >

          <Form className="popup-form" ref="form">
            <FormItem
              {...formItemLayout}
              label="产品类型/名称"
            >
              {
                getFieldDecorator('productType',{
                  rules:[{
                    required:true, message: '请选择产品类型/名称'
                  }]
                })(
                  <Cascader
                  options={this.state.cascaderOptions}
                  onChange={this.onChange}
                  loadData={this.loadData}
                  />
                )
              }
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="Feature名称"
            >
              {
                getFieldDecorator('featureType',{
                  rules:[{
                    required:true, message: '请输入Feature名称'
                  }]
                })(
                  <Input/>
                )
              }
            </FormItem>
          </Form>
        </Modal>
        <Table dataSource={this.state.data}
               columns={columns}
               components={components}
               onChange={this.handleTableChange}
               pagination={this.state.pagination}
               loading={this.state.loading}
               rowKey={(record) => record.id}
        />
      </div>
    );
  }
}

export default Feature;

