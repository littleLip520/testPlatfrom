import React from 'react';
import { Table, message, Divider, Button, Form, Popconfirm, Input, Modal, Row, Col } from 'antd';
import { observer } from 'mobx-react';
import fetchApi from '../../fetch/fetchApi';
import mobx from '../../mobx-data';
import manage from '../../api/manage';
import '../../../less/manage/baseSetting.less';

const apiConfig = manage.milestone;
const { action: {milestoneAction} } = mobx;
const FormItem = Form.Item;

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
class Milestone extends React.Component{
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
        title: '迭代里程碑',
        dataIndex: 'iterationStoneName',
        width: '20%',
        key: 'iterationStoneName',
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
    milestoneAction.deleteMilestone(id).then((flag) => {
      if(flag){
        this.fetchData(this.state.pagination);
      }
    });
    console.log(id);
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
          iterationStoneName: row.iterationStoneName,
        };
        milestoneAction.updateMilestone(data).then((flag) => {
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
    console.log('cancel'+ key);
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

  onCustomerAdd = (name,visible) => {
    milestoneAction.addMilestone(name).then((flag)=>{
      if(flag){
        this.setState({
          showModal: visible,
        });
        this.fetchData(this.state.pagination);
      }
    });

  };
  onCustomerAddAndContinue = (name,visible) => this.onCustomerAdd(name,visible);
  onInputChange = (e) =>{
    this.setState({
      inputName: e.target.value,
    });
  };

  fetchData = async (pager) => {
    this.setState({
      loading: true
    });
    fetchApi(apiConfig.list, pager).then((res) => {
      const pagination = {...this.state.pagination};
      if ((res.status === '0')){
        pagination.total = res.data.totalNumber;
        this.setState({
          data: res.data.iterationMilestones,
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
      <div className="customer">
        <Button type="primary" className="add-product-btn" onClick={this.onAddProductBtnClick}>新增迭代里程碑</Button>
        <Modal visible={this.state.showModal}
               title="添加迭代里程碑"
               closable={true}
               className="product-add-popup"
               onCancel={this.onModelCancel}
               destroyOnClose={true}
               footer={<span className="popup-btns">
                 <Button type="primary" onClick={()=>{this.onCustomerAdd(this.state.inputName,false);}}>保存</Button>
                 <Button type="primary" onClick={() => {this.onCustomerAddAndContinue(this.state.inputName,true);}}>保存并继续添加</Button>
                 <Button type="primary" onClick={this.onModelCancel}>取消</Button>
               </span>}
               confirmLoading
        >
          <Row
            className="product-add-popup-row"
            justify="space-between"
            style={{
              display: 'flex',
              'alignItems': 'center',
              'justifyContent': 'center'}}
            gutter={24}
          >
            <Col span={6}>
              <span>产品线名称：</span>
            </Col>
            <Col span={12}>
              <Input placeholder="迭代里程碑" onChange={this.onInputChange}/>
            </Col>
          </Row>
        </Modal>
        <Table dataSource={this.state.data}
               columns={columns}
               components={components}
               onChange={this.handleTableChange}
               pagination={this.state.pagination}
               rowKey={(record) => record.id}
        />
      </div>
    );
  }
}

export default Milestone;

