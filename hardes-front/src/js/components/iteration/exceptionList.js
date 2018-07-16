import React from 'react';
import { Col, Form, Input, Row, Select, Table, Button, Divider, message, Modal, Popconfirm } from 'antd';
import { observer } from 'mobx-react';
import _ from 'lodash';
import {toJS} from 'mobx';
import '../../../less/iteration/iteration.less';
import history from '../../utils/history';
import mobx from '../../mobx-data/';
import mobxUser from '../../mobx-data/mobxUser';

const {store: {userStore}, action: {userAction}} = mobxUser;
const {store:{iterationStore,productLineStore}, action: {iterationAction,productLineAction}} = mobx;
const Option = Select.Option;
const FormItem = Form.Item;



@observer
class ExceptionList extends React.Component {
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
    exceptionVisible: false,
    exception: null,
  };

  columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      align: 'center',
      width: '70px'
    },
    {
      title: '异常事件描述',
      dataIndex: 'eventDesc',
      key: 'eventDesc',
      align: 'left',
      width: '200px',
      render: (text, record, index) =>{
        return <a onClick={() => {
          console.log(record);
          this.setState({
            exception:record,
            exceptionVisible:true
          });
        }}>{text}</a>;
      }
    },
    {
      title: '迭代名称',
      dataIndex: 'iterationName',
      key: 'iterationName',
      align: 'left',
      width: '150px'
    },
    {
      title: '事件类别',
      dataIndex: 'eventType',
      key: 'eventType',
      align: 'center',
      width: '80px'
    },
    {
      title: '产品线',
      dataIndex: 'productLineName',
      key: 'productLineName',
      align: 'center',
      width: '80px'
    },


    {
      title: '迭代里程碑',
      dataIndex: 'iterationStone',
      key: 'iterationStone',
      align: 'center',
      width: '100px'
    },
    {
      title: '责任人',
      dataIndex: 'owner',
      key: 'owner',
      align: 'center',
      width: '80px'
    },
    {
      title: '审计人',
      dataIndex: 'reviewer',
      key: 'reviewer',
      align: 'center',
      width: '80px'
    },
    {
      title: '耽误时长(H)',
      dataIndex: 'delayTime',
      key: 'delayTime',
      align: 'center',
      width: '100px'
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      align: 'center',
      width: '80px',
      render: status => {
        let exStatus = iterationStore.exceptionStatus.find((item) => {
          return item.status === status;
        });
        return exStatus.name;
      }
    },
    {
      title: '审计日期',
      dataIndex: 'reviewDate',
      key: 'reviewDate',
      align: 'center',
      width: '150px'
    },
   /* {
      title: '影响分析',
      dataIndex: 'affectAnalysis',
      key: 'affectAnalysis',
      align: 'center',
      width: '100px'
    },*/

  /*  {
      title: '解决建议',
      dataIndex: 'suggest',
      key: 'suggest',
      align: 'center',
      width: '100px'
    },*/

    {
      title: '操作',
      render: (text, record, index) => {
        return <span>
        <a onClick={() => {
          history.push(`/dashboard/iteration/exception/update/${record.id}`);
        }}>编辑</a>
        <Divider type="vertical"/>
        <Popconfirm
          title="确认删除？"
          onConfirm={() => this.delete(record.id)}
        >
            <a>删除</a>
        </Popconfirm>
         <Divider type="vertical"/>
          {
            this.getOpType(record.status, record.id)
          }
      </span>;
      },
      align: 'center',
      width: '200px',
      //fixed: 'right'
    },
  ];

  getOpType = (status, id) => {
    let option = null;
    switch (status){
      case 0:
        option = <a onClick={()=>this.updateStatus(status,id)}>已解决</a>;
        break;
      case 1:
        option =  <a onClick={()=>this.updateStatus(status,id)}>开启</a>;
        break;
      default:
        option = null;
        break;
    }
    return option;
  };

  updateStatus = async (status, id)=>{
    const data = {
      id,
    };
    switch (status){
      case 0:
        data.status = 1;
        break;
      case 1:
        data.status = 0;
        break;
    }
    await iterationAction.updateExceptionStatus(data);
    await iterationAction.getExceptionList(this.state.request);

  };
/*
  getStatus= (status)=>{
    switch (status){
      case 0:
        return "开启";
      case 1:
        return "已解决";
    }
};*/

  showModal = () =>{
    this.setState({
      visible:true
    });
  };

  delete = async (id) => {
    await iterationAction.deleteException(id);
    await iterationAction.getExceptionList(this.state.request);
  };

  handleOk = (e) => {
    console.log(e);
    this.setState({
      visible: false,
    });
  };
  handleCancel = (e) => {
    console.log(e);
    this.setState({
      visible: false,
    });
  };

  handleTableChange = (pagination, filters, sorter) => {
    const pager = { ...pagination };
    pager.current = pagination.current;
    pager.pageNum = pagination.current;
    const request = this.state.request;
    request.pageRequest = pager;
    iterationAction.getExceptionList(request);
    this.setState({
      pageRequest: pager,
      request
    });
  };

  expandedRows = (record) =>{
    return (

      <div>
        <Row gutter={24}>
          <div >
            <label>影响分析：&nbsp;</label>
            <span><b>{record.affectAnalysis}</b></span>
          </div>
         </Row>
        <Row gutter={24}>
          <div >
            <label>解决建议：&nbsp;</label>
            <span><b>{record.suggest}</b></span>
          </div>
       </Row>
      </div>

    );
  };

  componentWillMount(){
    const recordId = this.props.match.params.id;
    const request = this.state.request;
    if(recordId!=null){
      iterationAction.getIterationDetailById(recordId);
      request.iterationId=recordId;
     }else{
      iterationStore.iterationDetail=null;
    }
    iterationAction.getExceptionList(request).then((res) =>{
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

  showReturn(){
    const recordId = this.props.match.params.id;
    if(recordId!=null){
     return(
       <Button
        type="primary"
        onClick={() => {
          this.handleReset();
          history.push('/dashboard/iteration/exception');
        }}
      >
        返回
      </Button>)
    }
  }
  showDivider(){
    const recordId = this.props.match.params.id;
    if(recordId!=null){
      return(
        <Divider type="vertical"/>)
    }
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
    iterationStore.iterationDetail=null;
    const pageRequest = this.state.request.pageRequest;
    const request = {
      pageRequest,
    };
    this.setState({
      request,
    });
    this.props.form.resetFields();
    iterationAction.getExceptionList(request);
  };

  handleSubmit = async(e) =>{
    e.preventDefault();
    this.props.form.validateFields(async (err,values)=>{
      const pageRequest = this.state.request.pageRequest;
      const request = {
        ...values,
        pageRequest
      };
      console.log(request);

      await iterationAction.getExceptionList(request);
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
      <div className="iteration-container">
        <Form
          className="iteration-query-form"
          layout="horizontal"
        >
          <Row align="middle" justify="center"  gutter={24}>
            <Col className="query-col" span={4}>
              <FormItem
                label="产品线"
                {...formItemLayout}
              >
                {getFieldDecorator('productLineId')(<Select
                  onSelect = {this.onSelect}
                  showSearch
                  placehoder="选择一个产品线"
                  allowClear
                  filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                >
                  {
                    this.getProductLineOptions()
                  }
                </Select>)}
              </FormItem>
            </Col>

            <Col className="query-col" span={4}>
              <FormItem
                label="迭代名称"
                {...formItemLayout}
              >
                {getFieldDecorator('iterationName')(
                  <Input/>)}
              </FormItem>
            </Col>
            <Col className="query-col" span={4}>
              <FormItem
                label="状态"
                {...formItemLayout}
              >
                {getFieldDecorator('status')(<Select
                  placehoder="状态"
                  showSearch
                  allowClear
                  filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                >
                  <Option value={0} key={0}>Open</Option>
                  <Option value={1} key={1}>Closed</Option>
                </Select>)}
              </FormItem>
            </Col>
            <Col className="query-col" span={4}>
              <FormItem
                label="责任人"
                {...formItemLayout}
              >
                {getFieldDecorator('ownerId')(
                  <Select
                    combobox
                    allowClear
                    showSearch
                    autoFocus={true}
                    placehoder="责任人"
                    filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                  >
                    {this.getUserSelectOptions()}
                  </Select>
                )}
              </FormItem>
            </Col>
            <Col className="query-col" span={4}>
              <FormItem
                label="审计人"
                {...formItemLayout}
              >
                {getFieldDecorator('reviewerId')(
                  <Select
                    combobox
                    allowClear
                    showSearch
                    autoFocus={true}
                    placehoder="审计人"
                    filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                  >
                    {this.getUserSelectOptions()}
                  </Select>
                )}
              </FormItem>
            </Col>
            <Col span={4} className="query-col" >
              <FormItem>
                <Button icon="search" htmlType="submit" onClick={this.handleSubmit}>查询</Button>
                <Divider type="vertical"/>
                <Button className="close-btn" icon="close" onClick={this.handleReset}>清除</Button>
              </FormItem>
            </Col>
          </Row>
          <Row align="middle"
               justify="space-between"
               gutter={24}
               className="action-btn"
          >
            <Col span={8} >
              <Button type="primary" onClick={()=>{history.push('/dashboard/iteration/exception/create');}}>新增异常事件</Button>
              {this.showDivider()}
              {this.showReturn()}
            </Col>

          </Row>
        </Form>
        <Table
          scroll={{ x: 1500 }}
          className="iteration-table"
          columns={this.columns}
          expandedRowRender={this.expandedRows}
          rowKey={record => record.id}
          dataSource={toJS(iterationStore.exceptionList)}
          pagination={this.state.pageRequest}
          loading={iterationStore.isLoading}
          onChange={this.handleTableChange}
          locale={{emptyText:'暂无数据'}}
        >
        </Table>
        <Modal
          className="iteration-modal"
          title="异常事件详情"
          closable={true}
          visible={this.state.exceptionVisible}
          onCancel={()=>{
            this.setState({
              exceptionVisible: false,
            });
          }}
          footer={ <Button type="primary" onClick={() => {
            this.setState({
              exceptionVisible: false,
            });
          }}>关闭</Button>
          }
        >
          <ExceptionDetailInfo exception={this.state.exception}/>
        </Modal>
      </div>
    );
  }
}

const ExceptionDetailInfo = ({exception}) => {

  const getStatus= (status)=>{
    switch (status){
      case 0:
        return "Open";
      case 1:
        return "Closed";
    }
  };
  /*const getUserNames = () =>{
    let names = [];
    if (exception) {
      _.each(iteration.testMems,(item) => {
        names.push(item.disname);
      });
    }
    console.log(names);
    return names.toString();
  };*/
  if (exception){
    console.log(exception);
    return <div>
      <Row
        justify="center"
      >
        <Col span={8}>
          <div className="sub-col">
            <label>产品线:&nbsp;</label>
            <span><b>{exception.productLineName}</b></span>
          </div>
        </Col>
        <Col span={8}>
          <div className="sub-col">
            <label>事件类别:&nbsp;</label>
            <span><b>{exception.eventType}</b></span>
          </div>
        </Col>
        <Col span={8}>
          <div className="sub-col">
            <label>迭代里程碑:&nbsp;</label>
            <span><b>{exception.iterationStone}</b></span>
          </div>
        </Col>
      </Row>

      <Divider/>
      <Row
        justify="center"
      >

        <Col span={8}>
          <div className="sub-col">
            <label>责任人:&nbsp;</label>
            <span><b>{exception.owner}</b></span>
          </div>
        </Col>
        <Col span={8}>
          <div className="sub-col">
            <label>审计人:&nbsp;</label>
            <span><b>{exception.reviewer}</b></span>
          </div>
        </Col>
        <Col span={8}>
          <div className="sub-col">
            <label>审计日期:&nbsp;</label>
            <span><b>{exception.reviewDate}</b></span>
          </div>
        </Col>
      </Row>
      <Divider/>
      <Row
        justify="center"
      > <Col span={8}>
        <div className="sub-col">
          <label>耽误时长（H）&nbsp;</label>
          <span><b>{exception.delayTime}</b></span>
        </div>
      </Col>
        <Col span={8}>
          <div className="sub-col">
            <label>状态&nbsp;</label>
            <span><b>
              {getStatus(exception.status)}
          </b></span>
          </div>
        </Col>
      </Row>
      <Divider/>
      <Row
        justify="center"
      > <Col >
        <div >
          <label>异常事件描述:&nbsp;</label>
          <span><b>{exception.eventDesc}</b></span>
        </div>
      </Col>
      </Row>
      <Divider/>
      <Row
        justify="center"
      > <Col >
        <div >
          <label>影响分析:&nbsp;</label>
          <span><b>{exception.affectAnalysis}</b></span>
        </div>
      </Col>
      </Row>
      <Divider/>
      <Row
        justify="center"
      >  <Col >
          <div >
            <label>解决意见&nbsp;</label>
            <span><b>{exception.suggest}</b></span>
          </div>
        </Col>
      </Row>
    </div>;

  } else {
    return <span>No Data</span>;
  }
};
const Exceptions = Form.create()(ExceptionList);

export default Exceptions;
