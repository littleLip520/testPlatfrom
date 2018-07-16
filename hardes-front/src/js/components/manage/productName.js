import React from 'react';
import { Table, message, Divider, Button, Form, Popconfirm, Input, Modal, Row, Col, Select } from 'antd';
import { observer } from 'mobx-react';
import _ from 'lodash';

import fetchApi from '../../fetch/fetchApi';
import mobx from '../../mobx-data/mobxProduct';
import manage from '../../api/manage';
import '../../../less/manage/baseSetting.less';

const { action: {productAction} } = mobx;

const apiConfig = manage.productName;
const FormItem = Form.Item;
const Option = Select.Option;

const EditableContext = React.createContext();

const EditableRow = ({ form, index, ...props }) => (
  <EditableContext.Provider value={form}>
    <tr {...props} />
  </EditableContext.Provider>
);

const EditableFormRow = Form.create()(EditableRow);

const globalGetProductOptions = () => {
    let options = [];
    productAction.getAllProductType().then((response)=>{
          if(response){
            _.each(response,item => {
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

class EditableCell extends React.Component{
    getInput = () => {
        if (this.props.inputType === 'input'){
            return <Input className="editable-input" />;
        }else{
           // console.log(this.props.record);
            return <Select className="product-type-selector"
                placeholder="产品类型"
                showSearch
                optionFilterProp="children"
                allowClear
                filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
            >
            {globalGetProductOptions()}
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
                        })(this.getInput())
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
class ProductName extends React.Component{
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
      productType:[],
      options:[]
    };
    this.columns = [
        {
        title: '产品类别',
        dataIndex: 'productTypeName',
        width: '20%',
        key: 'productTypeId',
        align: 'center',
        editable: true
        },
      {
        title: '产品名称',
        dataIndex: 'productName',
        width: '20%',
        key: 'productName',
        align: 'center',
        editable: true
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
                      <a
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

  edit = (key) => {
    this.setState({
      editingkey: key,
    });
  };
  delete = (id) => {
    productAction.deleteProductName(id).then((flag) => {
      if(flag){
        this.fetchData(this.state.pagination);
      }
    });
  };
  save = (form, key) => {
    form.validateFields((error, row) => {
      if (error) {
        return ;
      }
      const newData = [...this.state.data];
      const index = newData.findIndex(item => key === item.id);
      if (index > -1){
        const data = {
          id: key,
          productName: row.productName,
          productTypeId: row.productTypeId,
        };
        productAction.updateProductName(data).then((flag) => {
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
        console.log(values);
      if(err){
        return;
      }
      productAction.addProductName(values).then(
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
          data: res.data.productMgmtNames,
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
  getProductOptions = async() => {
    let options = [];
    await productAction.getAllProductType().then((response)=>{
          if(response){
              this.setState({
                  productType: response,
              });
            _.each(response,item => {
                options.push(
                    <Option value={item.id} key={item.id}>
                        {item.productTypeName}
                    </Option>
                );
            });
          }
      });
      this.setState({
          options
      });
  }
  componentDidMount(){
    this.fetchData(this.state.pagination);
    this.getProductOptions();
  }

  render(){
    const components = {
      body: {
        row: EditableFormRow,
        cell: EditableCell,
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
          inputType: col.dataIndex === 'productName' ? 'input' : 'select',
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
               title="添加产品名称"
               closable={true}
               className="product-add-popup"
               onCancel={this.onModelCancel}
               destroyOnClose={true}
               footer={<span className="popup-btns">
                 <Button type="primary" onClick={()=>{this.onFormSubmit(false);}}>保存</Button>
                 <Button type="primary" onClick={() => {this.onFormSubmitAndContinue(true);}}>保存并继续添加</Button>
                 <Button type="primary" onClick={this.onModelCancel}>取消</Button>
               </span>}
               confirmLoading
        >

          <Form className="popup-form" ref="form">
            <FormItem
              {...formItemLayout}
              label="产品类型"
            >
              {
                getFieldDecorator('productTypeId',{
                  rules: [{
                    required: true, message: '请选择产品类型'
                  }]
                })(
                    <Select
                      placeholder="产品类型"
                      showSearch
                      optionFilterProp="children"
                      allowClear
                      filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                      >
                      {this.state.options}
                    </Select>
                )
              }
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="产品名称"
            >
              {
                getFieldDecorator('productName',{
                    rules:[{
                        required:true, message: '请输入产品名称'
                    }]
                })(<Input placeholder="产品名称"/>)
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

export default ProductName;

