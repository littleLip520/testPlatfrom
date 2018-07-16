import React from 'react';
import { Table, Input, Modal, Button, Popconfirm, Divider, Form, Select} from 'antd';
import { observer } from 'mobx-react';
import _ from 'lodash';
import '../../../less/iteration/iteration.less';
import mobx from '../../mobx-data/';
import mobxUser from '../../mobx-data/mobxUser';
const {store: {userStore}, action: {userAction}} = mobxUser;
const {store:{customerStore}, action: {iterationAction, customerAction}} = mobx;
const Option = Select.Option;
const FormItem = Form.Item;

const EditableContext = React.createContext();
const EditableRow = ({ form, index, ...props }) => {
  return <EditableContext.Provider value={form}>
    <tr {...props} />
  </EditableContext.Provider>;
};
const EditableFormRow = Form.create()(EditableRow);


const getUserSelectOption = (data) => {
  let options = [];
  if (data) {
    _.each(data, (item) => {
      options.push(
        <Option value={item.id} key={item.id}>
          {item.disname}
        </Option>
      );
    });
  }
  return options;
};

const getCustomerSelectOption = (data) => {
  let options = [];
  if (data) {
    _.each(data, (item) => {
      options.push(
        <Option value={item.id} key={item.id}>
          {item.customerName}
        </Option>
      );
    });
  }
  return options;
};
@observer
class EditableCell extends React.Component{

  InputComponent = (inputType) => {
    if (inputType === 'input'){
      return <Input className="editable-input"/>;
    } else if (inputType === 'user'){
      return <Select
        className="user-selector"
        showSearch
        optionFilterProp="children"
        allowClear
        filterOption={(input, option) => option.props.children.toLowerCase()
          .indexOf(input.toLowerCase()) >= 0}
      >
        {
          getUserSelectOption(userStore.allActiveUser)
        }
      </Select>;
    } else if (inputType === 'type'){
      return <Select
        className="requirement-type-selector"
        showSearch
        optionFilterProp="children"
        allowClear
        filterOption={(input, option) => option.props.children.toLowerCase()
          .indexOf(input.toLowerCase()) >= 0}
      >
          <Option value={0} key={0}>
            BUG
          </Option>
          <Option value={1} key={1}>
            需求
          </Option>
      </Select>;
    }else if (inputType === 'customer'){
      return <Select
        className="customer-selector"
        showSearch
        optionFilterProp="children"
        allowClear
        filterOption={(input, option) => option.props.children.toLowerCase()
          .indexOf(input.toLowerCase()) >= 0}
      >
        {
          getCustomerSelectOption(customerStore.allCustomers)
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
                      })(this.InputComponent(this.props.inputtype))
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
class Requirement extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      editingkey: '',
      showModal: false,
      pagination:{
        pageSize:10,
        pageNum: 1,
        current: 1,
      },
      confirmLoading: false,
      data:[],
    };
    this.columns = [
      {
        title: '需求名称',
        dataIndex: 'businessName',
        key: 'businessName',
        editable: true,
        align: 'center'
      },
      {
        title: '类型',
        dataIndex:'businessType',
        align: 'center',
        editable: true,
        render: type => {
          if (type === 0){
            return 'BUG';
          } else if (type === 1){
            return '需求';
          }
        }
      },
      {
        title: '禅道ID',
        dataIndex:'externalId',
        align: 'center',
        editable: true,
      },
      {
        title: '来源团队',
        align: 'center',
        dataIndex:'sourceTeam',
        editable: true,
      },
      {
        title: '来源人',
        dataIndex:'hadesUserId',
        align: 'center',
        editable: true,
        render: id => {
          let userName = '';
          if (userStore.allUsers){
           const user = userStore.allUsers.find((item)=>{
              return item.id === id;
            });
           userName = user.disname;
          }
          return userName;
        }
      },
      {
        title: '面向客户',
        dataIndex:'customerId',
        align: 'center',
        editable: true,
        render: id => {
          let customerName = '';
          if (customerStore.allCustomers){
            const user = customerStore.allCustomers.find((item)=>{
              return item.id === id;
            });
            customerName = user.customerName;
          }
          return customerName;
        }
      },
      {
        title: '操作',
        align: 'center',
        dataIndex: 'operation',
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

    this.state={
      pagination:{
        pageNum: 1,
        pageSize: 10,
        current: 1,
      },
      loading: false,
      data: null,
      showModal: false
    };
  }

  isEditing = (record) => {
    return record.id === this.state.editingkey;
  };

  edit = (id) =>{
    this.setState({
      editingkey: id,
    });
  };
  delete = async(id) => {
    await iterationAction.deleteBusiness(id);
    await this.fetchData(this.state.pagination);
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
        iterationAction.updateBusiness(data).then((flag) => {
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

  cancel = ()=>{
    this.setState({
      editingkey: '',
    });
  };

  handleTableChange = async (pagination) => {
    const pager = {...pagination};
    pager.pageNum = pagination.current;
    await this.fetchData(pager);
    this.setState({
      pagination: pager
    });
  };
  fetchData = async (pager) =>{
    this.setState({
      loading: true,
    });
    const pagination ={...this.state.pagination};
    await iterationAction.getBusinessList(pager).then((res)=>{
      if (res){
        pagination.total = res.totalNumber;
        this.setState({
          pagination,
          loading: false,
          data: res.businesses
        });
      }
    });
  };
  componentWillMount(){
    userAction.getAllUsers().then(async()=>{
      await userAction.getAllActiveUsers();
      await customerAction.getAllCustomers();
      await this.fetchData(this.state.pagination);
    });
  }

  getDataIndex = (col) => {
    if (col.dataIndex === 'businessType'){
      return 'type';
    } else if (col.dataIndex === 'hadesUserId'){
      return 'user';
    }else if(col.dataIndex === 'customerId'){
      return 'customer';
    }else {
      return 'input';
    }
  };
  onAddBtnClick = () =>{
    this.setState({
      showModal: true,
    });
  };
  onModelCancel = () => {
    this.setState({
      showModal: false,
    });
  };
  onFormSubmit = (visible) => {
    this.props.form.validateFields(async (err, values) =>{
      if(err){
        return;
      }
      await iterationAction.addBusiness(values);
      await this.fetchData(this.state.pagination);
      this.setState({
        showModal: visible,
      });
    });
  };
  render() {
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

    return (
      <div className="requirements">
        <Button type="primary" className="add-product-btn" onClick={this.onAddBtnClick}>添加需求</Button>
        <Divider/>
        <Modal visible={this.state.showModal}
               title="添加需求"
               closable={true}
               className="business-add-popup"
               onCancel={this.onModelCancel}
               destroyOnClose={true}
               footer={<span className="popup-btns">
                 <Button className="product-add-btn" type="primary" onClick={()=>{this.onFormSubmit(false);}}>保存</Button>
                 <Button className="product-add-btn" type="primary" onClick={() => {this.onFormSubmit(true);}}>保存并继续添加</Button>
                 <Button className="product-add-btn" type="primary" onClick={this.onModelCancel}>取消</Button>
               </span>}
               confirmLoading
        >
          <Form className="popup-form" ref="form">
            <FormItem
              {...formItemLayout}
              label="需求名称"
            >
              {
                getFieldDecorator('businessName',{
                  rules:[{
                    required:true, message: '请输入需求名称'
                  }]
                })(
                  <Input/>
                )
              }
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="禅道ID"
            >
              {
                getFieldDecorator('externalId')(
                  <Input/>
                )
              }
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="类型"
            >
              {
                getFieldDecorator('businessType',{
                  rules:[{
                    required:true, message: '请选择需求类型'
                  }]
                })(
                  <Select
                    className="requirement-type-selector"
                    showSearch
                    optionFilterProp="children"
                    allowClear
                    filterOption={(input, option) => option.props.children.toLowerCase()
                      .indexOf(input.toLowerCase()) >= 0}
                  >
                    <Option value={0} key={0}>
                      BUG
                    </Option>
                    <Option value={1} key={1}>
                      需求
                    </Option>
                  </Select>
                )
              }
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="来源团队"
            >
              {
                getFieldDecorator('sourceTeam')(
                  <Input/>
                )
              }
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="来源人"
            >
              {
                getFieldDecorator('hadesUserId',{
                  rules:[{
                    required:true, message: '请选择来源人'
                  }]
                })(
                  <Select
                    className="user-selector"
                    showSearch
                    optionFilterProp="children"
                    allowClear
                    filterOption={(input, option) => option.props.children.toLowerCase()
                      .indexOf(input.toLowerCase()) >= 0}
                  >
                    {
                      getUserSelectOption(userStore.allUsers)
                    }
                  </Select>
                )
              }
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="面向客户"
            >
              {
                getFieldDecorator('customerId',{
                  rules:[{
                    required:true, message: '请选择面向客户'
                  }]
                })(
                  <Select
                    className="customer-selector"
                    showSearch
                    optionFilterProp="children"
                    allowClear
                    filterOption={(input, option) => option.props.children.toLowerCase()
                      .indexOf(input.toLowerCase()) >= 0}
                  >
                    {
                      getCustomerSelectOption(customerStore.allCustomers)
                    }
                  </Select>
                )
              }
            </FormItem>
          </Form>
        </Modal>
        <Table
          dataSource={this.state.data}
          columns={columns}
          components={components}
          pagination={this.state.pagination}
          loading={this.state.loading}
          onChange={this.handleTableChange}
        />
      </div>
    );
  }
}

export default Requirement;
