import React from 'react';
import { Table, message, Divider, Button, Form, Popconfirm, Input, Modal} from 'antd';
import { observer } from 'mobx-react';
import manage from '../../api/manage';
import fetchApi from '../../fetch/fetchApi';
import '../../../less/manage/baseSetting.less';
import mobx from '../../mobx-data';

const { action:{systemAction}} = mobx;
const FormItem = Form.Item;
const { system } = manage;

const EditableContext = React.createContext();

const EditableRow = ({ form, index, ...props }) => (
  <EditableContext.Provider value={form}>
    <tr {...props} />
  </EditableContext.Provider>
);

const EditableFormRow = Form.create()(EditableRow);

class EditableCell extends React.Component{
  getInput = () => {
    return <Input className="editable-input" />;
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
                          required: dataIndex==='name'?true:false, message: `请输入${title}`
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
class SystemTable extends React.Component{
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
      data:[]
    };
    this.columns = [
      {
        title: '系统',
        dataIndex: 'systemName',
        width: '20%',
        key: 'systemName',
        align: 'center',
        editable: true
      },
      /*{
        title: '类型',
        dataIndex: 'type',
        width: '20%',
        key: 'type',
        align: 'center',
        editable: true
      },
      {
        title: '应用/服务',
        dataIndex: 'serviceName',
        width: '20%',
        key: 'serviceName',
        align: 'center',
        editable: true
      },
      {
        title: '版本',
        dataIndex: 'version',
        width: '20%',
        key: 'version',
        align: 'center',
        editable: true
      },*/
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

  edit = (key) => {
    this.setState({
      editingkey: key,
    });
  };
  delete = (id) => {
    const response = systemAction.deleteSystem(id);
    response.then((flag)=>{
      if(flag){
        this.fetchData(this.state.pagination);
      }
    });
  };
  save = (form, key) => {
    console.log(form);
    console.log(key);
    form.validateFields((error, row) => {
      console.log(row);
      if (error) {
        return ;
      }
      const newData = [...this.state.data];
      const index = newData.findIndex(item => key === item.id);
      if (index > -1){
        const item = newData[index];
        newData.splice(index,1,{
          ...item,
          ...row
        });
        const data = row;
        data.id = key;
        const response = systemAction.updateSystem(data);
        response.then((flag) => {
          if(flag){
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
      systemAction.addSystem(values).then(
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

  onInputChange = (e) =>{
    this.setState({
      inputName: e.target.value,
    });
  };
  handleTableChange = (pagination) => {
    const pager = {...pagination};
    pager.pageNum = pagination.current;
    this.setState({
      pagination: pager
    });
    this.fetchData(pager);
  };

  fetchData = async (pager) => {
    this.setState({
      loading: true,
    });
    fetchApi(system.list,pager).then((res) => {
      const pagination = {...this.state.pagination};
      if (res.status === '0'){
        pagination.total = res.data.totalNumber;
        this.setState({
          data: res.data.systems,
          loading: false,
          pagination
        });
      } else {
        message.error(res.errorMsg);
      }
    });
  };

  componentDidMount(){
    this.fetchData(this.state.pagination);
  };

  render(){
    const components = {
      body: {
        row: EditableFormRow,
        cell: EditableCell,
      },
    };

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
    return(
      <div className="system">
        <Button type="primary" className="add-product-btn" onClick={this.onAddProductBtnClick}>新增系统</Button>
        <Modal visible={this.state.showModal}
               title="添加系统"
               closable={true}
               className="product-add-popup"
               onCancel={this.onModelCancel}
               destroyOnClose={true}
               footer={<span className="popup-btns">
                 <Button type="primary" onClick={()=>this.onFormSubmit(false)}>保存</Button>
                 <Button  type="primary" onClick={() => {this.onFormSubmitAndContinue(true);}}>保存并继续添加</Button>
                 <Button  type="primary" onClick={this.onModelCancel}>取消</Button>
               </span>}             
               confirmLoading
        >
          <Form className="popup-form" ref="form">
            <FormItem
              {...formItemLayout}
              label="系统名称"
            >
              {
                getFieldDecorator('systemName',{
                  rules: [{
                    required: true, message: '请输入系统名称'
                  }]
                })(<Input placeholder="系统名称"/>)
              }
            </FormItem>
            {/*<FormItem
              {...formItemLayout}
              label="类型"
            >
              {
                getFieldDecorator('type')(<Input placeholder="类型"/>)
              }
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="应用/服务"
            >
              {
                getFieldDecorator('serviceName')(<Input placeholder="应用/服务"/>)
              }
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="版本"
            >
              {
                getFieldDecorator('version')(<Input placeholder="1.0"/>)
              }
            </FormItem>*/}
            {/* <Col span={24} className="form-btns">
              <Button type="primary" htmlType="submit">保存</Button>
              <Button type="primary" htmlType="submit">保存并继续添加</Button>
              <Button type="primary" htmlType="submit">取消</Button>
            </Col> */}
          </Form>
        </Modal>
        <Table dataSource={this.state.data}
               columns={columns}
               components={components}
               loading={this.state.loading}
               pagination={this.state.pagination}
               onChange={this.handleTableChange}
               rowKey={(record) => record.id}
        />
      </div>
    );
  }
}

export default SystemTable;

