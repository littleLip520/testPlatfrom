import React from 'react';
import { Table, Divider, Form, Popconfirm, Input, Select,Button } from 'antd';
import { observer } from 'mobx-react';
import mobx from '../../mobx-data/mobxUser';
import '../../../less/manage/baseSetting.less';
import environmentApi from '../../mobx-data/mobxEnvironment';
import history from '../../utils/history';

const {action:{userAction}, store:{userStore}} = mobx;
const {action:{environmentAction}, store:{environmentStore}} = environmentApi;
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
class BaseEnvironment extends React.Component{
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
        title: '配置名称',
        dataIndex: 'configName',
        key: 'configName',
        align: 'center',
        editable: true
      },
      {
        title: '配置类型',
        dataIndex: 'configType',
        key: 'configType',
        align: 'center',
        editable: false
      },
      {
        title: '数据库名称',
        dataIndex: 'dbName',
        key: 'dbName',
        align: 'center',
        editable: false
      },
      {
        title: '用户',
        dataIndex: 'userName',
        key: 'userName',
        align: 'center',
        editable: false
      },
      {
        title: 'IP地址',
        dataIndex: 'ip',
        key: 'ip',
        align: 'center',
        editable: true
      },
      {
        title: '端口',
        dataIndex: 'port',
        key: 'port',
        align: 'center',
        editable: true
      },
      {
        title: '连接串',
        dataIndex: 'connUrl',
        key: 'connUrl',
        align: 'center',
        editable: true
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
                  <a onClick={()=>this.edit(record.id)}>编辑</a>
                  <Divider type="vertical"/>
                   <Popconfirm
                     title="确认删除？"
                     onConfirm={() => this.deleteConfig(record.id)}
                   >
                      <a>删除</a>
                    </Popconfirm>
                </span>
              )
            }</div>
          );
        }
      }
    ];
  }

  isEditing = (record) => {
    return record.id === this.state.editingkey;
  };
  edit = (key) => {
    //console.log('test11111');
    console.log('>>'+key);
    this.setState({
      editingkey: key,
    });
  };
  //删除环境配置

  deleteConfig=(id)=>{
    const configId={
      id:id
    }
    console.log(id);
    environmentAction.deleteEvnConfig(configId).then((flag)=>{
      if(flag){
        const pageInfo={
            pageSize:10,
            pageNum:1
        };
        this.fetchData(pageInfo);
      }

    });
  }
  cancel = () => {
    this.setState({ editingkey: '' });
  };
  //保存单条记录
  save = (form, key) => {
    form.validateFields((error, row) => {
      if (error) {
        return ;
      }

      const newData = [...this.state.data];
      const index = newData.findIndex(item => key === item.id);
      console.log(index);
      console.log(row);
      if (index > -1){
        newData[index] = {
          ... newData[index],
          ... row,
        };
        environmentAction.updateEvnConfig(newData[index]).then((flag) => {
          if(flag){
            const item = newData[index];
            newData.splice(index,1,{
              ...item,
              ...row
            });
            console.log(newData);
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
  //获取环境列表
  fetchData = async (data) => {
    this.setState({
      loading: true
    });
    const pagination = {...this.state.pagination};
    await environmentAction.getEnvironmentList(data).then((res)=>{
      if(res){
        pagination.total = res.total;
        this.setState({
          loading: false,
          data: res.envList,
          pagination
        });
      }
    });
  }
  componentDidMount(){
    console.log(this.state)
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
        <Button type="primary" className="add-product-btn" onClick={()=>{history.push('/dashboard/environment/create');}} >新增环境配置</Button>

        <Table
          dataSource={this.state.data}
          columns={columns}
          onChange={this.handleTableChange}
          pagination={this.state.pagination}
          components={components}
          loading={this.state.loading}
        />
      </div>
    );
  }

}
export default BaseEnvironment;
