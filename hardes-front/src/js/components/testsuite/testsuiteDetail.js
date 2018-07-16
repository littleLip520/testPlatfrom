import React from 'react';
import { Button, Form, Row, Col, Input, Divider, Table, Icon, Modal,Tooltip } from 'antd';
import { observer } from 'mobx-react';
import {toJS} from 'mobx';
import moment from 'moment';
import mobxMain from '../../mobx-data';
import mobxTest from '../../mobx-data/mobxTest';
import '../../../less/testsuite/iterationDetail.less';
import history from '../../utils/history';


const FormItem = Form.Item;
const {action:{strategyAction, productLineAction}} = mobxMain;
const {action:{testAction}, store:{testStore}} = mobxTest;
const externalLink=mobxMain.externalLink;
const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 4 }
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 16 }
  }
};

@Form.create()
@observer
class TestSuiteDetail extends React.Component{
  state={
    productTypes:null,
    current:0,
    suiteName:'',
    productLineId: null,
    status: null,
    iterationName: null,
    pagination:{
      pageSize: 10,
      pageNum: 1,
      current: 1,
    },
    request: {
      suiteId:null,
      pageRequest:null
    },
    showModal: false,
    confirming: false,
  };
  columns = [
    {
      title: '用例ID',
      dataIndex: 'testCaseId',
      key: 'testCaseId',
      align: 'center',
      width: '100px'
    },
    {
      title: '用例标题',
      dataIndex: 'caseTitle',
      key: 'caseTitle',
      align: 'left',
      width: '200px',
      render: (text,record,index) => <a onClick={() => {
        history.push(`/dashboard/testsuite/testExecuteLog/${record.id}`);
      }}>
        {record.caseTitle}
      </a>
    },
    {
      title: '创建人',
      dataIndex: 'creater',
      key: 'creater',
      align: 'center',
      width:'150px',
      render: (creater,record) => creater?creater+'/' +moment(record.createTime).format('YYYY-MM-DD'):moment(record.createTime).format('YYYY-MM-DD')
    },
    {
      title: '禅道ID',
      dataIndex: 'externalId',
      key: 'externalId',
      align: 'center',
      width:'100px'
    },
    {
      title: '优先级',
      dataIndex: 'priority',
      key: 'priority',
      align: 'center',
      width: '80px',
      render: priority => {
        let text = '';
        switch (priority){
          case 0:
            text = '高';
            break;
          case 1:
            text = '中';
            break;
          case 2:
            text = '低';
            break;
          default:
            text = '高';
            break;
        }
        return text;
      }
    },
    {
      title:'状态',
      width: '80px',
      dataIndex:'testCaseStatus',
      key:'testCaseStatus',
      align: 'center',
      render: status => status === 0 ? '有效' : '无效'
    },
    {
      title: '执行人',
      width: '100px',
      align: 'center',
      dataIndex: 'executorName',
      key: 'executorName'
    },
    {
      title: '执行时间',
      width: '150px',
      align: 'center',
      dataIndex: 'dateChangeLastTime',
      key: 'dateChangeLastTime',
      //render: text => text ? moment(text).format('YYYY-MM-DD hh:mm:ss'):null,
    },
    {
      title:'测试结果',
      width: '80px',
      dataIndex: 'status',
      key: 'status',
      align: 'center',
      render: status => this.getTestResult(status)
    },
    {
      title:'相关bug',
      width: '120px',
      align: 'center',
      dataIndex: 'relatedBug',
      key: 'relatedBug',
      render:(text, record, index)=>{
        return  <Tooltip placement="bottom" title={record.memo}><a target="_blank" href={externalLink+"bug-view-"+record.relatedBug+".html" }>{record.relatedBug} </a></Tooltip>
      }
    },
   /* {
      title:'备注',
      width: '200px',
      dataIndex: 'memo',
      key: 'memo',
      align: 'center',
    },*/
    {
      title:'操作',
      align: 'center',
      width: '240px',
      render:  (text, record, index) => {
        return (
          <span>
            <a onClick={()=>this.onPassClick(record.id)}>通过</a>
            <Divider type="vertical"/>
            <a onClick={() => this.onFailAndBlockClick(record.id, 3)}>失败</a>
            <Divider type="vertical"/>
            <a onClick={() => this.onFailAndBlockClick(record.id, 4)}>阻塞</a>
          </span>
        );
      }
    },
  ];

  getTestResult = (status) => {
    let result = null;
    switch (status){
      case 0:
        result = <Icon style={{color: 'grey',fontSize: 16}} type="pause-circle" />;
        break;
      case 2:
        result = <Icon style={{color: 'green',fontSize: 16}} type="check-circle" />;
        break;
      case 3:
        result = <Icon style={{color: 'red',fontSize: 16}} type="close-circle" />;
        break;
      case 4:
        result = <Icon style={{color: 'purple',fontSize: 16}} type="minus-circle" />;
        break;
    }
    return result;
  };

  onFailAndBlockClick = (id, status) => {
    console.log(id,status);
    this.setState({
      caseId:id,
      status,
      showModal: true
    });
  };
  onPassClick = (id) => {
    const data = {
      testSuiteId: this.state.id,
      id,
      status:2,
    };

    testAction.executeCase(data).then((flag)=>{
      if (flag){
        testAction.getTestCaseListBySuiteId(this.state.request);
        testAction.getTestSuiteById(this.state.id);
      }
    });
  };
  onModalOk = () => {
    const {form} = this.props;
    form.validateFields((err,values)=>{
      if (!err) {
        this.setState({
          confirming: true
        });
        const data = {
          testSuiteId: this.state.id,
          status: this.state.status,
          id: this.state.caseId,
          ...values
        };
        testAction.executeCase(data).then((flag) => {
            if (flag) {
              testAction.getTestCaseListBySuiteId(this.state.request);
              testAction.getTestSuiteById(this.state.id);
              this.setState({
                showModal: false,
              });
            }
            this.setState({
              confirming: false,
            });
          });
      }
    });
  };
  expandedRows = (record) =>{
    return (
      <div>
        <Row gutter={24}>
          <div dangerouslySetInnerHTML={{__html:record.stepsHtml}}/>
        </Row>
      </div>

    );
  };

  componentDidMount(){
    strategyAction.getAllStrategy();
    productLineAction.getAllProductLine();
    testAction.getTestcaseList(testStore.request);
    const id = this.props.match.params.id;
    this.setState({
      id,
    });
    testAction.getTestSuiteById(id);
    const pageRequest = this.state.pagination;
    const request = {
      pageRequest,
      testSuiteId: id,
    };
    testAction.getTestCaseListBySuiteId(request).then((res)=>{
      pageRequest.total = res;
      this.setState({
        pagination: pageRequest,
        request
      });
    });
  }

  onAdd = () => {
    const data = {
      testSuiteId: testStore.testSuiteId,
      testCaseIds: testStore.selectedTestCaseRowKeys
    };
    testAction.addOrUpdateTestCaseList(data).then((flag)=>{
      if (flag){
        // this.toListPage();
        //testAction.updateSelectRowKeys([]);
      }
    });
  };
  toListPage = () =>{
    testAction.updateSelectRowKeys([]);
    history.push('/dashboard/testsuite');
  };

  getTestMethodName = (id) => {
    if (id === 0){
      return '手工';
    } else if (id === 1) {
      return '自动化';
    }else {
      return null;
    }
  };
  getIterationStatusName = (id) => {
    let name = '';
    switch (id) {
      case 0:
        name = '规划中';
        break;
      case 1:
        name = '已上线';
        break;
      case 2:
        name = '已取消';
        break;
      case 3:
        name = '进行中';
        break;
      default:
        name = '';
    }
    return name;
  };
  getStatusName = (id) => {
    let name = '';
    switch (id) {
      case 0:
        name = '开始';
        break;
      case 1:
        name = '进行中';
        break;
      case 2:
        name = '已结束';
        break;
      default:
        name = '';
    }
    return name;
  };
  handleTableChange = async (pagination) => {
    const pager = {...pagination};
    pager.pageNum = pagination.current;
    const request = {
      ...this.state.request,
      pageRequest: pager
    };
    testAction.getTestCaseListBySuiteId(request).then((res)=>{
      pager.total = res;
      this.setState({
        pagination: pager,
        request
      });
    });
  };

  render(){
    const {getFieldDecorator} = this.props.form;
    const suite = testStore.testSuite;
    return (
      <div className="testsuite-detail">
        <div className="detail-info">
          <Row
            className="data-row"
            gutter={24}
            type="flex"
            justify="space-around"
          >
            <Col span={5}>
              <div className="sub-col">
                <label>测试集名称:&nbsp;</label>
                <span><b>{suite ? suite.suiteName : null}</b></span>
              </div>
            </Col>
            <Col span={5}>
              <div className="sub-col">
                <label>产品线:&nbsp;</label>
                <span><b>{suite ? suite.productLineName: null}</b></span>
              </div>
            </Col>
            <Col span={5}>
              <div className="sub-col">
                <label>迭代名称:&nbsp;</label>
                <span><b>{suite ? suite.iterationName : null}</b></span>
              </div>
            </Col>
            <Col span={5}>
              <div className="sub-col">
                <label>测试策略:&nbsp;</label>
                <span><b>{suite ? suite.strategyName : null}</b></span>
              </div>
            </Col>
          </Row>
          <Divider/>
          <Row
            className="data-row"
            gutter={24}
            type="flex"
            justify="space-around"
          >
            <Col span={5}>
              <div className="sub-col">
                <label>运行方式:&nbsp;</label>
                <span><b>{suite ? this.getTestMethodName(suite.testWayId) : null }</b></span>
              </div>
            </Col>
            <Col span={5}>
              <div className="sub-col">
                <label>通过用例/总用例:&nbsp;</label>
                <span><b>{suite? `${suite.allPassCaseNum}/${suite.allCaseNum}` : null}</b></span>
              </div>
            </Col>
            <Col span={5}>
              <div className="sub-col">
                <label>通过率:&nbsp;</label>
                <span><b>{suite ? suite.passRate : null}</b></span>
              </div>
            </Col>
            <Col span={5}>
              <div className="sub-col">
                <label>迭代状态:&nbsp;</label>
                <span><b>{suite ? this.getIterationStatusName(suite.iterationStatus) : null}</b></span>
              </div>
            </Col>
          </Row>
          <Divider/>
          <Row
            className="data-row"
            gutter={24}
            type="flex"
            justify="space-around"
          >
           {/* <Col span={5}>
              <div className="sub-col">
                <label>状态:&nbsp;</label>
                <span><b>{suite ? this.getStatusName(suite.status) : null}</b></span>
              </div>
            </Col>*/}
            <Col span={5}>
              <div className="sub-col">
                <label>创建日期:&nbsp;</label>
                <span><b>{suite ? moment(suite.createTime).format('YYYY-MM-DD') : null}</b></span>
              </div>
            </Col>
            <Col span={5}>
              <div className="sub-col">
                <label>最后运行日期:&nbsp;</label>
                <span><b>{suite && suite.executeLastTime ? moment(suite.executeLastTime).format('YYYY-MM-DD') : null}</b></span>
              </div>
            </Col>
            <Col span={5}>
              <div className="sub-col">
                <label>创建人:&nbsp;</label>
                <span><b>{suite ? suite.creater : null}</b></span>
              </div>
            </Col>
            <Col span={5}>
              <div className="sub-col">

              </div>
            </Col>
          </Row>
          <Divider/>
        </div>
        <div className="action-btn">
          <Button
            type="primary"
            onClick={() => {
              history.push('/dashboard/testsuite');
            }}
          >
            返回
          </Button>
          <Divider type="vertical"/>
          <Button
            type="primary"
            onClick={() => {
              history.push(`/dashboard/testsuite/update/${this.state.id}`);
            }}
          >
            编辑
          </Button>
          {/*<Button type="primary">结束测试集</Button>*/}
        </div>
        <Table
          dataSource={toJS(testStore.testCaseList)}
          columns={this.columns}
          scroll={{ x: 1800}}
          // rowSelection={rowSelection}
          loading={testStore.testCaseLoading}
          expandedRowRender={this.expandedRows}
          onChange={this.handleTableChange}
          pagination={this.state.pagination}
          rowKey={record => record.id}
        />
        <Modal
          okText="提交"
          visible={this.state.showModal}
          onCancel={()=>{this.setState({
            showModal: false
          });}}
          onOk={this.onModalOk}
          confirmLoading={this.state.confirming}
          destroyOnClose
        >
          <Form>
            <FormItem
              {...formItemLayout}
              label="关联bug"
            >
              {
                getFieldDecorator('relatedBug')(<Input/>)
              }
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="备注"
            >
              {
                getFieldDecorator('memo')(<Input.TextArea/>)
              }
            </FormItem>
          </Form>
        </Modal>
      </div>
    );
  }
}

export default TestSuiteDetail;
