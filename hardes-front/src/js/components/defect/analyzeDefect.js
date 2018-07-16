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

Form.create()
@observer
class AnalyzeDefect extends React.Component {
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
      dataIndex: 'zendaoid',
      key: 'zendaoid',
      align: 'center',
      fixed: 'left',
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
      title: '客户',
      dataIndex: 'productLineName',
      key: 'productLineName',
      align: 'center'
    },
    {
      title: '严重级别',
      dataIndex: 'pmName',
      key: 'pmName',
      align: 'center'
    },
    {
      title: '业务优先级',
      dataIndex: 'devOwner',
      key: 'devOwner',
      align: 'center'
    },
    {
      title: '标题',
      dataIndex: 'testOwner',
      key: 'testOwner',
      align: 'center'
    },
    {
      title: '原始录入',
      dataIndex: 'reqQuantity',
      key: 'reqQuantity',
      align: 'center'
    },
    {
      title: '所属产品线',
      dataIndex: 'planDate',
      key: 'planDate',
      align: 'center'
    },
    {
      title: '归属团队',
      dataIndex: 'actualDate',
      key: 'actualDate',
      align: 'center'
    },
     {
       title: '关联功能单元',
       dataIndex: 'actualDate',
       key: 'actualDate',
       align: 'center'
     },
     {
       title: '当前状态',
       dataIndex: 'status',
       key: 'status',
       align: 'center',
       render: status => {
         let itStatus = iterationStore.iterationStatus.find((item) => {
           return item.status === status;
         });
         return itStatus.name;
       }
     },
    {
      title: '预计解决日期',
      dataIndex: 'status',
      key: 'status',
      align: 'center',
      render: status => {
          let itStatus = iterationStore.iterationStatus.find((item) => {
            return item.status === status;
          });
          return itStatus.name;
      }
    },
    {
      title: '跟踪人',
      dataIndex: 'status',
      key: 'status',
      align: 'center',
      render: status => {
        let itStatus = iterationStore.iterationStatus.find((item) => {
          return item.status === status;
        });
        return itStatus.name;
    //   render: (text, record) => {
    //     return <span className="pipeline-btns">
    //   <Button
    //     disabled = {true}
    //     onClick={() => {message.info('hello world');}}>
    //     Pipline
    //   </Button>
    //   <Divider type="vertical"/>
    //   <Button onClick={()=>message.warn('hello world again')}>
    //     异常事件
    //   </Button>
    //     <Divider type="vertical"/>
    //   <Button
    //     disabled = {true}
    //     onClick={()=>message.warn('hello world again')}>
    //     测试报告
    //   </Button>
    // </span>;
      },
      align: 'center'
    },
    {
      title: '操作',
      render: (text, record, index) => {
        return <span>
        <a onClick={() => {
          history.push(`/dashboard/quality/editDefectAnalysis/${record.id}`);
        }}>编辑</a>
        <Divider type="vertical"/>
          <a onClick={() => {
            history.push(`/dashboard/quality/analyzeDefect/${record.id}`);
          }}>缺陷分析</a>
        <Divider type="vertical"/>
        <Popconfirm
          title="确认删除？"
          onConfirm={() => this.delete(record.id)}
        >
            <a>删除</a>
        </Popconfirm>
          {/*{*/}
            {/*this.getOpType(record.status, record.id)*/}
          {/*}*/}
      </span>;
      },
      align: 'center'
    },
  ];

   getOpType = (status, id) => {
    let option = null;
    switch (status){
      case 0:
        option = [<Divider type="vertical"/>,<a onClick={()=>this.updateStatus(UpdateType.cancel,id)}>取消</a>];
        break;

      case 2:
        option =  [<Divider type="vertical"/>,<a onClick={()=>this.updateStatus(UpdateType.restart,id)}>重启</a>];
        break;
      case 3:
        option =  [<Divider type="vertical"/>,<a onClick={()=>this.updateStatus(UpdateType.release,id)}>上线</a>,<Divider type="vertical"/>,<a onClick={()=>this.updateStatus(UpdateType.cancel,id)}>取消</a>];
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
          <Row gutter={24}>
            <Col className="query-col" span={6}>
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
            <Col className="query-col" span={6}>
              <FormItem
                label="缺陷状态"
                {...formItemLayout}
              >
                {getFieldDecorator('status')(<Select
                  placehoder="选择状态"
                  showSearch
                  allowClear
                  filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                >
                  <Option value={0} key={0}>规划中</Option>
                  <Option value={1} key={1}>已上线</Option>
                  <Option value={2} key={2}>取消上线</Option>
                  <Option value={3} key={3}>重新上线</Option>
                </Select>)}
              </FormItem>
            </Col>
            <Col className="query-col" span={6}>
              <FormItem
                label="归属团队"
                {...formItemLayout}
              >
                {getFieldDecorator('iterationName')(
                  <Input/>)}
              </FormItem>
            </Col>
            <Col className="query-col" span={6}>
              <FormItem
                label="禅道ID"
                {...formItemLayout}
              >
                {getFieldDecorator('testOwnerId')(
                  <Input/>
                )}
              </FormItem>
            </Col>
          </Row>
          <Row align="middle"
                justify="space-between"
               gutter={24}
               className="action-btn"
          >
            <Col span={6} >
              <Button type="primary" onClick={()=>{history.push('/dashboard/defect/editDefectAnalysis');}}>新增</Button>
              <Divider type="vertical"/>
              <Button type="primary" onClick={()=>{history.push('/dashboard/defect/viewZendaoChange');}}>查看禅道变化</Button>
            </Col>
            <Col span={18} className="op-btn" >
            <Button icon="search" htmlType="submit" onClick={this.handleSubmit}>查询</Button>
              <Divider type="vertical"/>
            <Button className="close-btn" icon="close" onClick={this.handleReset}>清除</Button>
          </Col>
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
          >
          </Table>
        <Modal
          className="defect-modal"
          title="迭代详情"
          closable={true}
          visible={this.state.iterationVisible}
          onCancel={()=>{
            this.setState({
              iterationVisible: false,
            });
          }}
          footer={ <Button type="primary" onClick={() => {
              this.setState({
                iterationVisible: false,
              });
          }}>关闭</Button>
          }
        >
          <IterationDetailInfo iteration={this.state.iteration}/>
        </Modal>
        <Modal
          title="设置上线日期"
          closable={true}
          visible={iterationStore.showUpdateModal}
          onOk={this.onSetDateOk}
          onCancel={()=>{iterationAction.updateModalStatus();}}
        >
          <DatePicker
            onChange={this.onDateChange}
            allowClear
            autoFocus
            placeholder="请选择上线日期"
          />
        </Modal>

      </div>
    );
  }
}

const IterationDetailInfo = ({iteration}) => {
  const columns = [
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
    },
    {
      title: '来源人',
      dataIndex:'hadesUser',
      align: 'center'
    },
    {
      title: '面向客户',
      dataIndex:'customer',
      align: 'center',
    },
  ];
  const getUserNames = () =>{
    let names = [];
    if (iteration) {
      _.each(iteration.testMems,(item) => {
        names.push(item.disname);
      });
    }
    return names.toString();
  };
  if (iteration){
    return <div>
      <Row
        justify="center"
      >
        <Col span={8}>
          <div className="sub-col">
            <label>迭代名称:&nbsp;</label>
            <span><b>{iteration.iterationName}</b></span>
          </div>
        </Col>
        <Col span={8}>
          <div className="sub-col">
            <label>产品线:&nbsp;</label>
            <span><b>{iteration.productLineName}</b></span>
          </div>
        </Col>
        <Col span={8}>
          <div className="sub-col">
            <label>产品经理:&nbsp;</label>
            <span><b>{iteration.pmName}</b></span>
          </div>
        </Col>
      </Row>
      <Divider/>
      <Row
        justify="center"
      >
        <Col span={8}>
          <div className="sub-col">
            <label>开发负责人:&nbsp;</label>
            <span><b>{iteration.devOwner}</b></span>
          </div>
        </Col>
        <Col span={8}>
          <div className="sub-col">
            <label>测试负责人:&nbsp;</label>
            <span><b>{iteration.testOwner}</b></span>
          </div>
        </Col>
        <Col span={8}>
          <div className="sub-col">
            <label>需求数量:&nbsp;</label>
            <span><b>{iteration.reqQuantity}</b></span>
          </div>
        </Col>
      </Row>
      <Divider/>
      <Row
        justify="center"
      >
        <Col span={8}>
          <div className="sub-col">
            <label>测试人员:&nbsp;</label>
            <span><b>{getUserNames()}</b></span>
          </div>
        </Col>
        <Col span={8}>
          <div className="sub-col">
            <label>计划上线:&nbsp;</label>
            <span><b>{iteration.planDate}</b></span>
          </div>
        </Col>
        <Col span={8}>
          <div className="sub-col">
            <label>实际上线:&nbsp;</label>
            <span><b>{iteration.actualDate}</b></span>
          </div>
        </Col>
      </Row>
      <Divider/>
      <Row>
        <Table size="small"
          columns={columns}
          dataSource={iteration.businessList}
          pagination={false}
        />
      </Row>
      </div>;

  } else {
    return <span>No Data</span>;
  }
};
const UpdateType = {
  cancel:1,
  restart:2,
  release:3
};

export default AnalyzeDefect;

