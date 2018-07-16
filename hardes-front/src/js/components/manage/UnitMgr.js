import React from 'react';
import { Table, message, Divider, Button, Form, Popconfirm, Input, Modal, Select,Cascader } from 'antd';
import { observer } from 'mobx-react';
import _ from 'lodash';

import fetchApi from '../../fetch/fetchApi';
import mobx from '../../mobx-data/mobxProduct';
import manage from '../../api/manage';
import '../../../less/manage/baseSetting.less';

const { action: {productAction},store:{productStore} } = mobx;

const apiConfig = manage.unit;
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

@observer
class EditableCell extends React.Component{
  onTypeSelect = async (id) => {
    await productAction.getProductNameListByTypeId(id);
  };
   getProductNameOptions = () => {
    let options = [];
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
   getFeatureOptions = () => {
    let options = [];
    if(productStore.featureList){
      _.each(productStore.featureList,item => {
        options.push(
          <Option value={item.id} key={item.id}>
            {item.featureType}
          </Option>
        );
      });
    }
    return options;
  };

  SelectComponent =(inputtype) =>{

    if(inputtype === 'input') {
      return <Input className="editable-input"/>;
    }else if (inputtype ==='type') {
      return <Select
        className="product-type-selector"
        showSearch
        optionFilterProp="children"
        allowClear
        filterOption={(input, option) => option.props.children.toLowerCase()
          .indexOf(input.toLowerCase()) >= 0}
        onSelect={this.onTypeSelect}
      >
        {
          getProductTypeOptions(productStore.productType)
        }
      </Select>;
    }else if (inputtype === 'name'){
      return <Select
        className="product-type-selector"
        showSearch
        optionFilterProp="children"
        allowClear
        filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
      >
        {
          this.getProductNameOptions()
        }
      </Select>;
    }else if (inputtype === 'feature'){
      return <Select
        className="product-type-selector"
        showSearch
        optionFilterProp="children"
        allowClear
        filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
      >
        {
          this.getFeatureOptions()
        }
      </Select>;
    }
  };

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
            console.log(this.props);
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
                      })(this.SelectComponent(this.props.inputtype))
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
class UnitMgr extends React.Component{
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
        dataIndex: 'featureTypeId',
        width: '20%',
        key: 'featureTypeId',
        align: 'center',
        editable: true,
        render: (text, record, index) => {
          if (productStore.featureList) {
            const feature = productStore.featureList.find((item) => {
              return item.id === record.featureTypeId;
            });
            if (feature) {
              return feature.featureType;
            }else {
              return record.featureType;
            }
          }
          else {
            return record.featureType;
          }
        }
      },
      {
        title: '功能单元',
        dataIndex: 'feature',
        width: '20%',
        key: 'feature',
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

  edit = async (key) => {
    let currentTypeId = '';
    let currentproductNameId='';
    this.state.data.find(item =>{
      if(item.id === key){
        currentTypeId = item.productTypeId;
        currentproductNameId = item.productNameId;
      }
    });
    await productAction.getProductNameListByTypeId(currentTypeId);
    await productAction.getFeatureListByNameId(currentproductNameId);
    this.setState({
      editingkey: key,
      currentTypeId,
      currentproductNameId
    });

  };
  delete = (id) => {
    productAction.deleteUnit(id).then((flag) => {
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
          ...row
        };
        productAction.updateUnit(data).then((flag) => {
          if(flag){
            const item = newData[index];
            newData.splice(index,1,{
              ...item,
              ...row
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
        feature: values.featureType,
        featureTypeId: types[2]

      };
      productAction.addUnit(datas).then(
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
          data: res.data.productMgmtFeatureUnits,
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
    if (col.dataIndex === 'featureTypeId'){
      return 'feature';
    } else if (col.dataIndex === 'productTypeId'){
      return 'type';
    }else if(col.dataIndex === 'productNameId'){
      return 'name';
    }else if (col.dataIndex === 'feature'){
      return 'input';
    }
  };

  loadData = async (selectedOptions) => {
    if (selectedOptions.length === 1) {
      const targetOptions = selectedOptions[selectedOptions.length - 1];
      await productAction.getProductNameListByTypeId(targetOptions.value);
      targetOptions.loading = false;
      let subOptions = productStore.productName.map((item) => {
        return {
          label: item.productName,
          value: item.id,
          isLeaf: false,
        };
      });
      targetOptions.children = subOptions;
      this.setState({
        cascaderOptions: [...this.state.cascaderOptions]
      });
    }else {
      const targetOptions = selectedOptions[selectedOptions.length - 1];
      await productAction.getFeatureListByNameId(targetOptions.value)
        .then((res) => {
            if (res) {
              let subOptions = res.map((item) => {
                return {
                  label: item.featureType,
                  value: item.id,
                  isLeaf: true,
                };
              });
              targetOptions.children = subOptions;
            }
          }
        );
      this.setState({
        cascaderOptions: [...this.state.cascaderOptions]
      });
    }
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

export default UnitMgr;

