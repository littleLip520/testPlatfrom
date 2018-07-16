import React from 'react';
import { Button, Row, Form, Col, Select, Input, Divider, Modal, Popconfirm, Table } from 'antd';
import { observer } from 'mobx-react';
import { toJS } from 'mobx';
import _ from 'lodash';
import moment from 'moment';
import '../../../less/testcase/testcase.less';
import history from '../../utils/history';
import mobxTest from '../../mobx-data/mobxTest';
import mobx from '../../mobx-data/';

const {action:{testAction}, store:{testStore}} = mobxTest;
const {store:{iterationStore, productLineStore}, action:{productLineAction}} = mobx;
const FormItem = Form.Item;
const Option = Select.Option;

@Form.create()
@observer
class TestSuite extends React.Component{
  state = {
    productLines:null,
    pagination:{
      current:1,
      pageSize:10,
      pageNum:1
    },
    getTestSuiteRequest : {
      pageRequest:{
        current:1,
        pageSize:10,
        pageNum:1
      },
    }
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
      title: '测试集名称',
      dataIndex: 'suiteName',
      key: 'suiteName',
      align: 'left',
      width: '200px',
      render: (text,record,index) => <a onClick={() => {
        history.push(`/dashboard/testsuite/detail/${record.id}`);
      }}>
        {text}
        </a>
    },
    {
      title: '产品线',
      dataIndex: 'productLineName',
      key: 'productLineName',
      align: 'center',
      width: '150px'
    },
    {
      title: '迭代名称',
      dataIndex: 'iterationName',
      key: 'iterationName',
      align: 'left',
      width: '150px',
    },
    {
      title: '测试策略',
      dataIndex: 'strategyName',
      key: 'strategyName',
      align: 'center',
      width: '100px',
    },
    {
      title: '运行方式',
      dataIndex: 'testWayId',
      key: 'testWayId',
      align: 'center',
      width: '100px',
      render: key => {
        let manual = '';
        switch (key){
          case 0:
            manual = '手工';
            break;
          case 1:
            manual = '自动化';
            break;
          default:
            manual = '手工';
            break;
        }
        return manual;
      }
    },
    // {
    //   title: '总用例/场景数',
    //   dataIndex: 'featureUnit',
    //   key: 'featureUnit',
    //   align: 'center',
    //   width: '150px',
    // },
    {
      title: '通过用例/总用例',
      dataIndex: 'allPassCaseNum',
      key: 'allPassCaseNum',
      align: 'center',
      width: '180px',
      render: (text,record,index) => `${record.allPassCaseNum}/${record.allCaseNum}`
    },
    {
      title: '通过率',
      dataIndex: 'passRate',
      key: 'passRate',
      align: 'center',
      width: '100px',
    },
    {
      title: '迭代状态',
      dataIndex: 'iterationStatus',
      key: 'iterationStatus',
      width: '100px',
      render: iterationStatus => {
        let name = '';
        let itStatus = iterationStore.iterationStatus.find((item) => {
          return item.status === iterationStatus;
        });
        if(itStatus){
          name = itStatus.name;
        }
        return name;
      }
    },
    /*{
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      align: 'center',
      width: '100px',
      render: status => {
        let statusName = '';
        switch (status) {
          case 0:
            statusName = '开始';
            break;
          case 1:
            statusName = '进行中';
            break;
          case 2:
            statusName = '已结束';
            break;
          default:
            statusName='未运行';
        }
        return statusName;
      }
    },*/
    {
      title: '创建日期',
      dataIndex: 'createTime',
      key: 'createTime',
      align: 'center',
      width: '150px',
      render: text => moment(text).format('YYYY-MM-DD')
    },
    {
      title: '最后运行日期',
      dataIndex: 'executeLastTime',
      key: 'executeLastTime',
      align: 'center',
      width: '150px',
      render: text => text ? moment(text).format('YYYY-MM-DD') : null
    },
    {
      title: '创建人',
      dataIndex: 'creater',
      key: 'creater',
      align: 'center',
      width: '100px',
    },

    {
      title:'操作',
      align: 'center',
      width: '180px',
      render: (text, record, index)=>{
        return <span>
        <a onClick={() => {
          history.push(`/dashboard/testsuite/update/${record.id}`);
        }}>
          编辑
        </a>
        <Divider type="vertical"/>
        <Popconfirm
          title="确认删除？"
          onConfirm={() => this.onDelete(record.id)}
        >
            <a>删除</a>
        </Popconfirm>
        <Divider type="vertical"/>
        <a onClick={() => {
          history.push(`/dashboard/testsuite/detail/${record.id}`);
        }}>
          开始测试
        </a>
      </span>;
      }
    }
  ];
  onDelete = (id) => {
    testAction.deleteTestSuite(id).then((flag)=>{
      if (flag){
        testAction.getTestSuiteList(this.state.getTestSuiteRequest);
      }
    });
  };
  getProductLineOptions = () =>{
    let options = [];
    if (productLineStore.productLines) {
      _.each(productLineStore.productLines, (item)=>{
        options.push(
          <Option value={item.id} key={item.id}>
            {item.productLineName}
          </Option>
        );
      });
    }
    return options;
  };


  componentDidMount(){
    productLineAction.getAllProductLine().then((res) => {
      if (res) {
        this.setState({
          productLines: res,
        });
      }
    });
    testAction.getTestSuiteList(this.state.getTestSuiteRequest).then((total)=>{
      const pager = {
        ...this.state.pagination,
        total
      };
      this.setState({
        pagination:pager,
        getTestSuiteRequest:{
          pageRequest:pager,
        }
      });
    });
  };
  handleTableChange = (pagination) => {
    const pager = {
        ...this.state.pagination,
        pageNum: pagination.current,
        current: pagination.current
    };

    const request = {
      pageRequest: pager
    };
    testAction.getTestSuiteList(request).then((total)=>{
      pager.total = total;
      this.setState({
        pagination: pager,
        getTestSuiteRequest:{
          pageRequest:pager
        }
      });
    });
  };
  handleSubmit = (e) =>{
    e.preventDefault();
    this.props.form.validateFields((err,values)=> {
      const pageRequest = this.state.getTestSuiteRequest.pageRequest;
      const request = {
        ...values,
        pageRequest
      };
      testAction.getTestSuiteList(request)
        .then((total) => {
          pageRequest.total = total;
          this.setState({
            pagination: pageRequest,
            getTestSuiteRequest: {
              pageRequest
            }
          });
        });
    });
  };

  handleReset = () =>{
    const pageRequest = this.state.getTestSuiteRequest.pageRequest;
    const request = {
      pageRequest,
    };
    this.setState({
      request,
    });
    this.props.form.resetFields();
    testAction.getTestSuiteList(request).then((total)=>{
      pageRequest.total = total;
      this.setState({
        pagination: pageRequest,
        getTestSuiteRequest:{
          pageRequest:pageRequest
        }
      });
    });
  };
  render(){
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
          <Row gutter={24}>
            <Col className="query-col" span={8}>
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
            <Col className="query-col" span={8}>
              <FormItem
                label="迭代状态"
                {...formItemLayout}
              >
                {getFieldDecorator('iterationStatus')(<Select
                  placehoder="选择迭代状态"
                  showSearch
                  allowClear
                  filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                >
                  <Option value={0} key={0}>规划中</Option>
                  <Option value={1} key={1}>已上线</Option>
                  <Option value={2} key={2}>已取消</Option>
                  <Option value={3} key={3}>进行中</Option>
                </Select>)}
              </FormItem>
            </Col>
            <Col className="query-col" span={8}>
              <FormItem
                label="迭代名称"
                {...formItemLayout}
              >
                {getFieldDecorator('iterationName')(
                  <Input/>)}
              </FormItem>
            </Col>
          </Row>
          <Row align="middle"
               justify="space-between"
               gutter={24}
               className="action-btn"
          >
            <Col span={6} >
              <Button type="primary" onClick={()=>{history.push('/dashboard/testsuite/create');}}>新增测试集</Button>
            </Col>
            <Col span={18} className="op-btn" >
              <Button icon="search" htmlType="submit" onClick={this.handleSubmit}>查询</Button>
              <Divider type="vertical"/>
              <Button className="close-btn" icon="close" onClick={this.handleReset}>清除</Button>
            </Col>
          </Row>
        </Form>
        <Table
          scroll={{ x: 1800}}
          className="iteration-table"
          columns={this.columns}
          rowKey={record => record.id}
          dataSource={toJS(testStore.testSuiteList)}
          pagination={this.state.pagination}
          loading={testStore.testSuiteLoading}
          onChange={this.handleTableChange}
        >
        </Table>
        <Modal
          className="iteration-modal"
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
          <div>hello world</div>
        </Modal>
      </div>
    );
  }
}

  export default TestSuite;


