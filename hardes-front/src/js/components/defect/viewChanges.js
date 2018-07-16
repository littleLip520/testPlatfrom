import React from 'react';
import { Col, Form, Input, Row, Select, Table, Button, Divider, message, Modal, Popconfirm, DatePicker } from 'antd';
import { observer } from 'mobx-react';
import {toJS} from 'mobx';
import {withRouter} from 'react-router-dom';
import _ from 'lodash';
import '../../../less/defect/defect.less';
import history from '../../utils/history';
import mobx from '../../mobx-data/';
import mobxUser from '../../mobx-data/mobxUser';

const {store: {userStore}, action: {userAction}} = mobxUser;
const {store:{iterationStore,productLineStore}, action: {iterationAction,productLineAction}} = mobx;
const Option = Select.Option;
const FormItem = Form.Item;

@Form.create()
@observer
class ViewChanges extends React.Component {
  state = {
    data: [],
    pageRequest: {
      pageNum: 1,
      pageSize: 10,
      current: 1,
    },
    loading: false,
    visible: false,
    request:{
      pageRequest: {
        pageNum: 1,
        pageSize: 10,
        current:1,
      }
    },
    iterationVisible: false,
    iteration: null,
    iterationId:null,
    date:null,
  };

  columns = [
    {
      title: '禅道ID',
      dataIndex: 'iterationName',
      key: 'iterationName',
      align: 'center',
      /*fixed: 'left',*/
      render: (text, record, index) =>{
        return <a onClick={() => {
          this.setState({
            iteration:record,
            iterationVisible:true
          });
        }}>{text}</a>;
      }
    },
    {
      title: '标题',
      dataIndex: 'productLineName',
      key: 'productLineName',
      align: 'center'
    },
    {
      title: '当前状态',
      dataIndex: 'pmName',
      key: 'pmName',
      align: 'center'
    },
    {
      title: '严重级别',
      dataIndex: 'devOwner',
      key: 'devOwner',
      align: 'center'
    },
    {
      title: '修复人',
      dataIndex: 'reqQuantity',
      key: 'reqQuantity',
      align: 'center'
    },
    {
      title: '修复日期',
      dataIndex: 'planDate',
      key: 'planDate',
      align: 'center'
    },
    {
      title: '关闭人',
      dataIndex: 'actualDate',
      key: 'actualDate',
      align: 'center'
    },
    {
      title: '关闭日期',
      dataIndex: 'actualDate',
      key: 'actualDate',
      align: 'center'
    },
  ];



  updateStatus = async (status, id)=>{
    const data = {
      id,
    };
    switch (status){
      case 1:
        data.status = 2;
        break;
      case 2:
        data.status = 3;
        break;
      case 3:
        data.status = 1;
        break;
      default:
        data.status = 0;
    }
    if(status !== 3){
      await iterationAction.updateIterationStatus(data).then((flag) =>{
        if(flag){
          iterationAction.getIterationList(this.state.request);
        }
      });
    }else{
      this.setState({
        iterationId:id,
      });
      iterationAction.updateModalStatus();
    }
  };
  showModal = () =>{
    this.setState({
      visible:true
    });
  };

  delete = async (id) => {
    await iterationAction.deleteIteration(id);
    await iterationAction.getIterationList(this.state.request);
  };

  handleOk = (e) => {
    this.setState({
      visible: false,
    });
  };
  handleCancel = (e) => {
    this.setState({
      visible: false,
    });
  };

  handleTableChange = (pagination, filters, sorter) => {
    const pager = { ...pagination };
    pager.pageNum = pagination.current;
    pager.current = pagination.current;
    const request = this.state.request;
    request.pageRequest = pager;
    iterationAction.getIterationList(request);
    this.setState({
      pageRequest: pager,
      request
    });
  };

  componentWillMount(){
    iterationAction.getIterationList(this.state.request).then((res) =>{
      if(res){
        const pager = this.state.pageRequest;
        pager.total = res.totalNumber;
        this.setState({
          pageRequest: pager,
          request:{
            pageRequest: pager
          }
        });
      }
    });
    productLineAction.getAllProductLine();
    userAction.getAllActiveUsers();
  }
  componentDidMount() {
    const pager = iterationStore.pagination;
    this.setState({
      pageRequest:pager,
    });
  }
  onSelect = (value) =>{
    console.log(value);
  };

  getProductLineOptions = () =>{
    let options = [];
    if (productLineStore.productLines) {
      productLineStore.productLines.map((item)=>{
        options.push(
          <Option value={item.id} key={item.id}>
            {item.productLineName}
          </Option>
        );
      });
    }
    return options;
  };
  handleReset = () => {
    const pageRequest = this.state.request.pageRequest;
    const request = {
      pageRequest,
    };
    this.setState({
      request,
    });
    this.props.form.resetFields();
    iterationAction.getIterationList(request);
  };

  handleSubmit = async(e) =>{
    e.preventDefault();
    this.props.form.validateFields(async (err,values)=>{
      const pageRequest = this.state.request.pageRequest;
      const request = {
        ...values,
        pageRequest
      };
      await iterationAction.getIterationList(request);
      request.pageRequest.total =iterationStore.total;
      this.setState({
        request
      });
    });
  };

  getUserSelectOptions = () => {
    let options = [];
    if (userStore.allActiveUser) {
      _.each(userStore.allActiveUser, (item) => {
        options.push(
          <Option value={item.id} key={item.id}>
            {item.disname}
          </Option>
        );
      });
    }
    return options;
  };
  onDateChange = (date, dateString) => {
    this.setState({
      date: dateString,
    });
    console.log(this.state);
  }
  onSetDateOk = () =>{
    if(this.state.date){
      const data = {
        id: this.state.iterationId,
        actualDate:this.state.date,
        status:1
      };
      iterationAction.updateIterationStatus(data).then((flag) => {
        if(flag){
          iterationAction.getIterationList(this.state.request);
        }
      });
    }else{
      message.error('日期不能为空');
    }
  }
  render() {

    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 8 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 }
      }
    };

    return (
      <div className="defect-container">
        <Form
          className="defect-query-form"
          layout="horizontal"
        >

          <Row align="middle"
               justify="space-between"
               gutter={24}
               className="action-btn"
          >

          </Row>

        </Form>
        <Table
          scroll={{ x: 1500 }}
          className="iteration-table"
          columns={this.columns}
          rowKey={record => record.id}
          dataSource={toJS(iterationStore.iterationList)}
          pagination={this.state.pageRequest}
          loading={iterationStore.isLoading}
          onChange={this.handleTableChange}
          locale={{emptyText:'暂无数据'}}
          expandedRowRender={this.expandedRows}
        >
        </Table>
      </div>
    );
  }
}


const UpdateType = {
  cancel:1,
  restart:2,
  release:3
};

export default ViewChanges;

