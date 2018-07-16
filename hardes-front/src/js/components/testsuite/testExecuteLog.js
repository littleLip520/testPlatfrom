import React from 'react';
import { Steps, Button, Form, Row, Col, Select, Input, Divider, Table ,Icon,Tooltip} from 'antd';
import { observer } from 'mobx-react';
import _ from 'lodash';
import {toJS} from 'mobx';
import mobxMain from '../../mobx-data';
import mobxTest from '../../mobx-data/mobxTest';
import '../../../less/testsuite/createTestsuite.less';
import history from '../../utils/history';

const FormItem = Form.Item;
const Option = Select.Option;
const externalLink=mobxMain.externalLink;
const {action:{testAction}, store:{testStore}} = mobxTest;


@Form.create()
@observer
class TestExecuteLog extends React.Component{

  state={
    current:0,
    pagination:{
      pageSize: 10,
      pageNum: 1,
      current: 1,
    },
    request: {
      pageRequest:null
    },
    showModal: false,
    confirming: false,
  };
  columns = [
    {
      title: '执行id',
      dataIndex: 'id',
      key: 'id',
      align: 'center',
      width: '100px'
    },
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
        return <Tooltip placement="bottom" title={record.memo}><a target="_blank" href={externalLink+"bug-view-"+record.relatedBug+".html" }>{record.relatedBug} </a></Tooltip>
      }
    },
   /* {
      title:'备注',
      width: '200px',
      dataIndex: 'memo',
      key: 'memo',
      align: 'center',
    }*/
  ];

  handleTableChange = async (pagination) => {
    const pager = {...pagination};
    pager.pageNum = pagination.current;
    const request = {
      ...this.state.request,
      pageRequest: pager
    };
    testAction.getTestExecuteLogList(request).then((res)=>{
      pager.total = res;
      this.setState({
        pagination: pager,
        request
      });
    });
  };

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

  componentDidMount(){
    const id = this.props.match.params.id;
    this.setState({
      id,
    });
    testAction.getTestSuiteCaseById(id).then((res)=>{
      const pageRequest = this.state.pagination;
      const {testSuiteId,testCaseId}=testStore.testExecute;
      testStore.testSuiteId= testSuiteId;
      const request = {
        pageRequest,
        testSuiteId: testSuiteId,
        testCaseId:testCaseId
      };
      console.log(request);
      testAction.getTestExecuteLogList(request).then((res)=>{
        pageRequest.total = res;
        this.setState({
          pagination: pageRequest,
          request
        });
      });
    });

  }

  render(){
    return(<div className="testsuite-detail">

      <Form
        className="iteration-query-form"
        layout="horizontal"
      >
        <Row align="middle"
             justify="space-between"
             gutter={24}
             className="action-btn"
        >
          <Col span={6} >
            <Button type="primary" onClick={()=>{
              history.push('/dashboard/testsuite/detail/' + testStore.testSuiteId);

            }}>返回</Button>
          </Col>
        </Row>
      </Form>

      <Table
        dataSource={toJS(testStore.testExecuteLogList)}
        columns={this.columns}
        scroll={{ x: 1800}}
        // rowSelection={rowSelection}
        loading={testStore.testSuiteLoading}
        onChange={this.handleTableChange}
        pagination={this.state.pagination}
        rowKey={record => record.id}
      />
    </div>)
   }

}

export  default TestExecuteLog;
