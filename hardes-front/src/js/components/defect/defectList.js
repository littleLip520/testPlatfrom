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
const {store:{defectStore,productLineStore,defectStatusStore,teamStore}, action: {defectAction,productLineAction,defectStatusAction,teamAction}} = mobx;
const Option = Select.Option;
const FormItem = Form.Item;


@observer
class Defect extends React.Component {
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
    // defectVisible: false,
    defect: null,
    defectId:null,
    date:null,
  };

  columns = [
    {
      title: '禅道ID',
      dataIndex: 'externalId',
      key: 'externalId',
      align: 'center',
      render: (text, record, index) =>{
        return <a onClick={() => {
          this.setState({
            defect:record,
            // defectVisible:true
          });
        }}>{text}</a>;
      }
    },
    {
      title: '客户',
      dataIndex: 'customer',
      key: 'customer',
      align: 'center'
    },
    {
      title: '严重级别',
      dataIndex: 'severity',
      key: 'severity',
      align: 'center'
    },
    {
      title: '业务优先级',
      dataIndex: 'priority',
      key: 'priority',
      align: 'center'
    },
    {
      title: '标题',
      dataIndex: 'subject',
      key: 'subject',
      align: 'center'
    },
    {
      title: '原始录入',
      dataIndex: 'author',
      key: 'author',
      align: 'center'
    },
    {
      title: '所属产品线',
      dataIndex: 'productLine',
      key: 'productLine',
      align: 'center'
    },
    {
      title: '归属团队',
      dataIndex: 'sourceTeam',
      key: 'sourceTeam',
      align: 'center'
    },
    {
      title: '关联功能单元',
      dataIndex: 'function',
      key: 'function',
      align: 'center'
    },
    {
      title: '当前状态',
      dataIndex: 'status',
      key: 'status',
      align: 'center',
    },
    {
      title: '预计解决日期',
      dataIndex: 'resolveTime',
      key: 'resolveTime',
      align: 'center',
    },
    {
      title: '跟踪人',
      dataIndex: 'tracer',
      key: 'tracer',
      align: 'center',
    },
    {
      title: '操作',
      align: 'center',
      fixed: 'right',
      render: (text, record, index) => {
        return <span>
        <a onClick={() => {
          history.push(`/dashboard/defect/update/${record.id}`);
        }}>编辑</a>
        <Divider type="vertical"/>
          <a onClick={() => {
            history.push(`/dashboard/defect/analyze/${record.id}`);
          }}>缺陷分析</a>
        <Divider type="vertical"/>
        <Popconfirm
          title="确认删除？"
          onConfirm={() => this.delete(record.id)}
        >
            <a>删除</a>
        </Popconfirm>
      </span>;
      },
      align: 'center'
    },
  ];

  delete = async (id) => {
    await defectAction.deleteDefect(id);
    await defectAction.getDefectList(this.state.request);
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
    defectAction.getDefectList(request);
    this.setState({
      pageRequest: pager,
      request
    });
  };

  componentWillMount(){
    defectAction.getDefectList(this.state.request).then((res) =>{
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
  }

  componentDidMount() {
    const pager = defectStore.pagination;
    this.setState({
      pageRequest:pager,
    });
    productLineAction.getAllProductLine();
    userAction.getAllActiveUsers();
    defectStatusAction.getAllDefectStatus();
    teamAction.getAllTeams();
  }

  expandedRows = (record) =>{
    return (
      <div>
        <Row gutter={24}>
          <div dangerouslySetInnerHTML={{__html:record.detailHtml}}/>
        </Row>
      </div>
    );
  };

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

  getStatusOptions = () => {
    let options = [];
    if (defectStatusStore.allDefectStatus) {
      _.each(defectStatusStore.allDefectStatus, (item) => {
        options.push(
          <Option value={item.id} key={item.id}>
            {item.description}
          </Option>
        );
      });
    }
    return options;
  };

  getTeamOptions = () => {
    let options = [];
    if (teamStore.allTeams) {
      _.each(teamStore.allTeams, (item) => {
        options.push(
          <Option value={item.id} key={item.id}>
            {item.teamName}
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
    defectAction.getDefectList(request);
  };

  handleSubmit = async(e) =>{
    e.preventDefault();
    this.props.form.validateFields(async (err,values)=>{
      const pageRequest = this.state.request.pageRequest;
      const request = {
        ...values,
        pageRequest
      };
      await defectAction.getDefectList(request);
      request.pageRequest.total = defectStore.total;
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
        id: this.state.defectId,
        actualDate:this.state.date,
        status:1
      };
      defectAction.updateDefectStatus(data).then((flag) => {
        if(flag){
          defectAction.getDefectList(this.state.request);
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
            <Col className="query-col" span={4}>
              <FormItem
                label="产品线"
                {...formItemLayout}
              >
                {getFieldDecorator('productLineId')(<Select
                  onSelect = {this.onSelect}
                  showSearch
                  placehoder="请选择产品线"
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
                label="缺陷状态"
                {...formItemLayout}
              >
                {getFieldDecorator('statusId')(<Select
                  placehoder="请选择缺陷状态"
                  showSearch
                  allowClear
                  filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                >
                  {
                    this.getStatusOptions()
                  }
                </Select>)}
              </FormItem>
            </Col>
            <Col className="query-col" span={4}>
              <FormItem
                label="归属团队"
                {...formItemLayout}
              >
                {getFieldDecorator('sourceTeamId')(<Select
                  placehoder="请选择归属团队"
                  showSearch
                  allowClear
                  filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                >
                  {
                    this.getTeamOptions()
                  }
                </Select>)}
              </FormItem>
            </Col>
            <Col className="query-col" span={4}>
              <FormItem
                label="禅道ID"
                {...formItemLayout}
              >
                {getFieldDecorator('externalId')(
                  <Input/>
                )}
              </FormItem>
            </Col>
            <Col className="query-col" span={4}>
              <FormItem
                label="跟踪人"
                {...formItemLayout}
              >
                {getFieldDecorator('tracerId')(
                  <Select
                    combobox
                    allowClear
                    showSearch
                    autoFocus={true}
                    placehoder="请选择跟踪人"
                    filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                  >
                    {this.getUserSelectOptions()}
                  </Select>
                )}
              </FormItem>
            </Col>
          </Row>
          <Row align="middle"
               justify="space-between"
               gutter={24}
               className="action-btn">
            <Col span={6}>
              <Button type="primary" onClick={()=>{history.push('/dashboard/defect/create');}}>新增</Button>
              <Divider type="vertical"/>
              <Button type="primary" onClick={()=>{history.push('/dashboard/defect/changes');}}>查看禅道变化</Button>
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
          className="defect-table"
          columns={this.columns}
          rowKey={record => record.id}
          dataSource={toJS(defectStore.defectList)}
          pagination={this.state.pageRequest}
          loading={defectStore.isLoading}
          onChange={this.handleTableChange}
          locale={{emptyText:'暂无数据'}}
          expandedRowRender={this.expandedRows}
        >
        </Table>
      </div>
    );
  }
}

const DefectForm = Form.create()(Defect);
export default withRouter(DefectForm);

