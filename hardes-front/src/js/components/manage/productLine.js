import React from 'react';
import { Table, message, Divider, Button, Form, Popconfirm, Input, Modal, Row, Col } from 'antd';
import { observer } from 'mobx-react';
import mobx from '../../mobx-data';
import manage from '../../api/manage';
import fetchApi from '../../fetch/fetchApi';

import '../../../less/manage/baseSetting.less';
const FormItem = Form.Item;
const {action:{productLineAction}} = mobx;
const apiConfig = manage.productLine;
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
class ProductLine extends React.Component{
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
        title: '产品线名称',
        dataIndex: 'productLineName',
        width: '20%',
        key: 'name',
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
  };
  handleTableChange = async (pagination) => {
    const pager = {...pagination};
    pager.pageNum = pagination.current;
    this.setState({
      pagination: pager
    });
    this.fetchData(pager);
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
          data: res.data.productLines,
          loading: false,
          pagination
      });
      } else {
        message.error(res.errorMsg);
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
  delete = (id) => {
   const response =  productLineAction.deleteProductLine(id);
   response.then((res) => {
    if(res){
    this.fetchData(this.state.pagination);
    }
  });
    // this.fetchData(this.state.pagination);
  };
  save = (form, key) => {
    form.validateFields((error, row) => {
      if (error) {
        return ;
      }
      console.log(row);
      const newData = [...this.state.data];
      const index = newData.findIndex(item => key === item.id);
      if (index > -1){
        const data = {
          id: key,
          productLineName: row.productLineName
        };
        productLineAction.updateProductLine(data).then(
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

  onProductLineAdd = (name) => {
    if (!name){
      message.error('请输入产品线名称');
    } else {
      this.setState({
        confirmLoading: true,
      });
      productLineAction.addProductLine(name).then(
        (res) => {
          if(res){
            this.setState({
              showModal: false,
              confirmLoading: false,
            });
            this.fetchData(this.state.pagination);
          }
        }
      );
    }
  };
  onProductLineAddAndContinue = (name) => {
    if (!name){
      message.error('请输入产品线名称');
    }else {
      this.setState({
        confirmLoading: true,
      });
      productLineAction.addProductLine(name).then(
        (res) => {
          if(res) {
            this.fetchData(this.state.pagination);
          }
        }
      );
    }
  };

  onInputChange = (e) => {
    this.setState({
      inputName: e.target.value,
    });

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
      <div className="product">
        <Button type="primary" className="add-product-btn" onClick={this.onAddProductBtnClick}>新增产品线</Button>
        <Modal visible={this.state.showModal}
               title="添加产品线"
               closable={true}
               className="product-add-popup"
               onCancel={this.onModelCancel}
               destroyOnClose={true}
               footer={<span className="popup-btns">
                 <Button type="primary" onClick={()=>{this.onProductLineAdd(this.state.inputName);}}>保存</Button>
                 <Button type="primary" onClick={() => {this.onProductLineAddAndContinue(this.state.inputName);}}>保存并继续添加</Button>
                 <Button type="primary" onClick={this.onModelCancel}>取消</Button>
               </span>}
               confirmLoading={this.state.confirmLoading}
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
              <Input placeholder="产品线名称"
              onChange={this.onInputChange}
              onPressEnter={()=>{this.onProductLineAdd(this.state.inputName);}}
              />
            </Col>
          </Row>
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

export default ProductLine;

