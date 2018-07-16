import React from 'react';
import { Table, Divider, Button, Form, Popconfirm, Input, Modal,Select } from 'antd';
import _ from 'lodash';
import { observer } from 'mobx-react';
import mobx from '../../mobx-data/mobxUser';
import { toJS } from 'mobx';
import '../../../less/manage/baseSetting.less';
const FormItem = Form.Item;
const Option = Select.Option;
const {action:{userAction}, store:{userStore}} = mobx;

const EditableContext = React.createContext();


const EditableRow = ({ form, index, ...props }) => (
  <EditableContext.Provider value={form}>
    <tr {...props} />
  </EditableContext.Provider>
);

const EditableFormRow = Form.create()(EditableRow);

@observer
class EditableCell extends React.Component{


  getInput = () => {
    if ( this.props.dataIndex === 'roleName'){
      return <Input className="editable-input"/>;
    } else {
      console.log(this.props.record);
      return <Select
        mode="multiple"
        placeholder="权限"
        showSearch
        optionFilterProp="children"
        allowClear
        filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
        >
        {this.state.options}
      </Select>;
    }
  };
  componentWillMount(){
      let options = [];
      let authList = toJS(userStore.authList);
      if (authList){
        authList.map((item) => {
          options.push(
            <Option value={item.id} key={item.id}>
              {item.authName}
            </Option>
          );
        });
      }
    this.setState({
      options,
    });
  }
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
class RoleMgr extends React.Component{
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
      loading: false,
      data: []
    };
    this.columns = [
      {
        title: '角色名称',
        dataIndex: 'roleName',
        width: '20%',
        key: 'roleName',
        align: 'center',
        editable: true,
      },
      {
        title: '权限',
        dataIndex: 'authList',
        width: '40%',
        key: 'authList',
        align: 'center',
        editable: true,
        render: (text, record, index) => {
          let authList = toJS(record.authList);
          let ids = [];
          let userAuthList = toJS(userStore.authList);
          _.each(authList,(id) => {
           const auth =  userAuthList.find((item)=>{
              return item.id === id;
            });
            ids.push(<span className="auth-options" key={auth.roleId}>{auth.authName}</span>);
          });
          return ids;
        }
      },
      /*{
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
                         onClick={ () => this.save(form,record.roleId)}>
                        保存
                      </a>
                    )
                  }
                </EditableContext.Consumer>
                    <Divider type="vertical"/>
                <Popconfirm
                  title="确认取消？"
                  onConfirm={() => this.cancel(record.roleId)}>
                  <a>取消</a>
                </Popconfirm>
              </span>
                ) : (
                  <span>
                    <a onClick={() =>this.edit(record.roleId, toJS(record))}>编辑</a>
                    <Divider type="vertical"/>
                    <Popconfirm
                      title="确认删除？"
                      onConfirm={() => this.delete(record.roleId)}
                    >
                      <a>删除</a>
                    </Popconfirm>
                  </span>
                )
              }
            </div>
          );
        },
      }*/
    ];
  };
  handleTableChange = async (pagination) => {
    const pager = {...pagination};
    pager.pageNum = pagination.current;
    this.setState({
      pagination: pager
    });
    await this.fetchData(pager);
  };
  isEditing = (record) => {
    return record.roleId === this.state.editingkey;
  };

  edit = async(key, record) =>  {
    console.log(key,record);
    this.setState({
      editingkey: key,
    });
  };
  delete = (id) => {
    const data = {
      roleId: id
    };
    const response =  userAction.deleteRoleAuth(data);
    response.then((res) => {
      if(res){
        this.fetchData(this.state.pagination);
      }
    });
  };
  save = (form, key) => {
    form.validateFields((error, row) => {
      if (error) {
        console.error(error);
        return ;
      }
      const newData = [...this.state.data];
      const index = newData.findIndex(item => key === item.roleId);
      if (index > -1){
        const data = {
          roleId: key,
          ...row
        };
        userAction.updateRoleAuth(data).then(
          (res)=>{
            if(res){
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
          }
        );
      } else {
        newData.push(this.state.data);
        this.setState({ editingKey: '' });
      }
    });
  };

  cancel = (key) => {
    console.log('cancel'+ key);
    this.setState({ editingkey: '' });
  };

  onAddBtnClick = () => {
    this.setState({
      showModal: true
    });
  };

  onModelCancel = () => {
    this.setState({
      showModal: false,
    });
  };

  onFormSubmit = (visible) =>{
    this.props.form.validateFields((err, values) =>{
      if(err){
        return;
      }
      this.setState({
        confirmLoading: true,
      });
       userAction.addRoleAuth(values).then(
         (res) => {
          if(res){
            this.setState({
              showModal: visible,
              confirmLoading: false,
            });
            this.fetchData(this.state.pagination);
          }
        }
      );
    });
  };

  fetchData = async (pager) => {
    this.setState({
      loading: true,
    });
    await userAction.getRoleAuth(pager).then((res) =>{
      const pagination = {...this.state.pagination};
      if (res){
        pagination.total = userStore.roleAuthTotal;
        this.setState({
            data: res,
            loading: false,
            pagination
          });
      }
    });
  };
  componentWillMount(){
    this.fetchData(this.state.pagination);
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
      <div className="role-auth">
        <Button type="primary" className="add-product-btn" onClick={this.onAddBtnClick}>新增角色</Button>
        <Modal visible={this.state.showModal}
               title="添加角色"
               closable={true}
               className="product-add-popup"
               onCancel={this.onModelCancel}
               destroyOnClose={true}
               footer={<span className="popup-btns">
                 <Button type="primary" onClick={() => this.onFormSubmit(false)}>保存</Button>
                 <Button type="primary" onClick={() => {this.onFormSubmit(true);}}>保存并继续添加</Button>
                 <Button type="primary" onClick={this.onModelCancel}>取消</Button>
               </span>}
               confirmLoading={this.state.confirmLoading}
        >

          <Form className="popup-form" ref="form">

            <FormItem
              {...formItemLayout}
              label="角色名称"
            >
              {
                getFieldDecorator('roleName',{
                  rules:[{
                    required:true, message: '请输入产品名称'
                  }]
                })(<Input placeholder="角色名称"/>)
              }
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="权限"
            >
              {
                getFieldDecorator('authList',{
                  rules: [{
                    required: true, message: '请选择权限'
                  }]
                })(
                  <Select
                    mode="multiple"
                    placeholder="权限"
                    showSearch
                    optionFilterProp="children"
                    allowClear
                    filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                  >
                    {
                      userStore.authList.map((item) => {
                        return <Option value={item.id} key={item.id}>
                          {item.authName}
                        </Option>;
                      })
                    }
                  </Select>
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

export default RoleMgr;
