import React from 'react';
import { Table, Divider, Form, Popconfirm, Input, Select } from 'antd';
import { observer } from 'mobx-react';
import mobx from '../../mobx-data/mobxUser';
import '../../../less/manage/baseSetting.less';

const {action:{userAction}, store:{userStore}} = mobx;
const FormItem = Form.Item;
const Option = Select.Option;
const EditableContext = React.createContext();
const EditableRow = ({ form, index, ...props }) => (
  <EditableContext.Provider value={form}>
    <tr {...props} />
  </EditableContext.Provider>
);

const EditableFormRow = Form.create()(EditableRow);

@observer
class EditableCell extends React.Component{
  getRoleOptions = () => {
    let options = [];
    userStore.roleList.map((item)=>{
      options.push(
        <Option value={item.roleCode} key={item.roleCode}>{item.roleName}</Option>
      );
    });
    return options;
  };
  getInput = () => {
    if (this.props.inputtype === 'input'){
      return <Input className="editable-input" />;
    }else{
      return <Select
              className="role-selector"
              placeholder="角色"
              showSearch
              optionFilterProp="children"
              allowClear
              filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
            >
              {this.getRoleOptions()}
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
class UserMgr extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      editingkey: '',
      inputName: '',
      pagination:{
        pageSize:10,
        pageNum: 1,
      },
      confirmLoading: false,
      options:[],
      data:[],
      loading: false,
    };

    this.columns = [
      {
        title: '姓名',
        dataIndex: 'disname',
        width: '20%',
        key: 'disname',
        align: 'center',
        editable: false
      },
      {
        title: '邮箱',
        dataIndex: 'email',
        width: '25%',
        key: 'email',
        align: 'center',
        editable: false
      },
      {
        title: '角色',
        dataIndex: 'roleId',
        width: '20%',
        key: 'roleId',
        align: 'center',
        editable: true,
        render: roleId => {
          let name = '';
          let role = userStore.roleList.find((item) =>{
            return item.roleCode === roleId;
          });
          if (role){
            name = role.roleName;
          }
          return name;
        }
      },
      {
        title: '操作',
        dataIndex: 'op',
        align: 'center',
        render: (text, record) => {
          const editable = this.isEditing(record);
          return(
            <div className="editable-row-operations">{
              editable ? (
                <span>
                  <EditableContext.Consumer>
                    {
                      form => (
                        <a
                          onClick={ () => this.save(form, record.id)}>
                          保存
                        </a>
                      )
                    }
                  </EditableContext.Consumer>
                  <Divider type="vertical"/>
                  <Popconfirm
                    title="确认取消?"
                    onConfirm={()=>this.cancel()}
                  >
                    <a>取消</a>
                  </Popconfirm>
                </span>
              ) : (
                <span>
                  <a
                    onClick={()=>this.edit(record.id)}
                  >
                    编辑
                  </a>
                  <Divider type="vertical"/>
                  <a onClick={()=>{this.updateUserStatus(record.id,record.active);}}>
                    {record.active === 0 ? '禁用' : '激活'}
                  </a>
                </span>
              )
            }</div>
          );
        }
      }
    ];
  }

  updateUserStatus = (id, status) =>{
    const data = {
      id,
    };
    if (status === 0){
      data.activeStatus = 'disable';
    } else if (status === -99){
      data.activeStatus = 'active';
    }
    userAction.updateUser(data).then((flag) =>{
      if (flag){
        this.fetchData(this.state.pagination);
      }
    });
  };
  isEditing = (record) => {
    return record.id === this.state.editingkey;
  };
  edit = (key) => {
    this.setState({
      editingkey: key,
    });
  };
  cancel = () => {
    this.setState({ editingkey: '' });
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
          roleId: row.roleId,
        };
        userAction.updateUser(data).then((flag) => {
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
  handleTableChange = async (pagination) => {
    const pager = {...pagination};
    pager.pageNum = pagination.current;
    this.setState({
      pagination: pager
    });
    this.fetchData(pager);
  };
  fetchData = async (data) => {
    this.setState({
      loading: true
    });
    const pagination = {...this.state.pagination};
    await userAction.getUserList(data).then((res)=>{
      if(res){
        pagination.total = res.total;
        this.setState({
          loading: false,
          data: res.userList,
          pagination
        });
      }
    });
  }
  componentDidMount(){
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
      if (!col.editable){
        return col;
      }
      return {
        ...col,
        onCell: record => ({
          record,
          dataIndex: col.dataIndex,
          title: col.title,
          editing: this.isEditing(record),
          inputtype: col.dataIndex === 'roleId' ? 'select' : 'input',
        }),
      };
    });
    return(
      <div className="user-manage">
        <Table
          dataSource={this.state.data}
          columns={columns}
          onChange={this.handleTableChange}
          pagination={this.state.pagination}
          components={components}
          loading={this.state.loading}
          rowKey={(record) => record.id}
        />
      </div>
    );
  }
}
export default UserMgr;
