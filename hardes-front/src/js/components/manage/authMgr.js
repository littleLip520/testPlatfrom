import React from 'react';
import { Table, Divider, Button, Form, Popconfirm, Input, Modal,} from 'antd';
import { observer } from 'mobx-react';
import mobx from '../../mobx-data/mobxUser';
import '../../../less/manage/baseSetting.less';
const FormItem = Form.Item;

const {action:{userAction}, store:{userStore}} = mobx;

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
class AuthMgr extends React.Component{
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
      enable: false
    };
    this.columns = [
      {
        title: '权限名称',
        dataIndex: 'authName',
        width: '20%',
        key: 'authName',
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
  };
  handleTableChange = async (pagination) => {
    const pager = {...pagination};
    pager.pageNum = pagination.current;
    this.setState({
      pagination: pager
    });
    this.fetchData(pager);
  };
  isEditing = (record) => {
    return record.id === this.state.editingkey;
  };

  edit = (key) => {
    this.setState({
      editingkey: key,
    });
  };
  delete = (authId) => {
    const response =  userAction.deleteAuth({authId});
    response.then((res) => {
      if(res){
        this.fetchData(this.state.pagination);
      }
    });
  };
  save = (form, key) => {
    form.validateFields((error, row) => {
      if (error) {
        return ;
      }
      const newData = [...userStore.authList];
      const index = newData.findIndex(item => key === item.id);
      if (index > -1){
        const data = {
          id: key,
          ...row
        };
        userAction.updateAuth(data).then(
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
        newData.push(...userStore.authList);
        this.setState({ editingKey: '' });
      }
    });
  };

  cancel = (key) => {
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
      userAction.addAuth(values).then(
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

  onInputChange = (e) => {
    this.setState({
      inputName: e.target.value,
    });

  };
  fetchData = async(data) =>{
    this.setState({
      loading:true,
    });
    await userAction.getAuthList(data).then((res) =>{
      if (res){
        const pagination = {...this.state.pagination};
        pagination.total = res.total;
        this.setState({
          data: res.authList,
          pagination,
          loading: false,
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
      <div className="product">
        <Button type="primary" className="add-product-btn" onClick={this.onAddBtnClick}>新增权限</Button>
        <Modal visible={this.state.showModal}
               title="添加权限"
               closable={true}
               className="product-add-popup"
               onCancel={this.onModelCancel}
               destroyOnClose={true}
               footer={<span className="popup-btns">
                 <Button type="primary" onClick={()=>{this.onFormSubmit(false);}}>保存</Button>
                 <Button type="primary" onClick={() => {this.onFormSubmit(true);}}>保存并继续添加</Button>
                 <Button type="primary" onClick={this.onModelCancel}>取消</Button>
               </span>}
               confirmLoading={this.state.confirmLoading}
        >
          <Form>
            <FormItem
              {...formItemLayout}
              label="权限名称"
            >
              { getFieldDecorator('authName',{
                rules:[{
                  required: true, message:'请输入权限名称'
                }]
              })(<Input/>)}
            </FormItem>

          </Form>
        </Modal>
        <Table dataSource={this.state.data}
               columns={columns}
               components={components}
               loading={this.state.loading}
               onChange={this.handleTableChange}
               pagination={this.state.pagination}
               rowKey={(record) => record.id}
        />
      </div>
    );
  }
}

export default AuthMgr;

