import React from 'react';
import { Button, Row, Form, Col, Select, Input, Divider, message, Popconfirm, Table, Menu,Dropdown,Icon } from 'antd';
import { observer } from 'mobx-react';
import moment from 'moment';
import _ from 'lodash';
import {toJS} from 'mobx';
import '../../../less/testcase/testcase.less';
import history from '../../utils/history';
import mobxProduct from '../../mobx-data/mobxProduct';
import mobxTest from '../../mobx-data/mobxTest';
import mobx from '../../mobx-data/';

const {action:{productAction}, store:{productStore}} = mobxProduct;
const {action:{productVersionAction}, store:{productVersionStore}} = mobx;
const {action:{testAction}, store:{testStore}} = mobxTest;
const FormItem = Form.Item;
const Option = Select.Option;


@Form.create()
@observer
class Testcase extends React.Component{
  state = {
    productTypes:null,
    pagination:{
      pageSize: 10,
      pageNum: 1,
      current: 1,
    },
    productNameIdDisabled:true,
    featureTypeIdDisabled:true,
    featureUnitIdDisabled:true,
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
      title: '用例标题',
      dataIndex: 'caseTitle',
      key: 'caseTitle',
      align: 'left',
      width: '200px',
    },
    {
      title: '产品类别',
      dataIndex: 'productType',
      key: 'productType',
      align: 'center',
      width: '120px'
    },
    {
      title: '产品名称',
      dataIndex: 'productName',
      key: 'productName',
      align: 'center',
      width:'120px'
    },
    {
      title: 'Feature大类',
      dataIndex: 'featureType',
      key: 'featureType',
      align: 'center',
      width: '120px'
    },
    {
      title: '功能单元',
      dataIndex: 'featureUnit',
      key: 'featureUnit',
      align: 'center',
      width:'120px',
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
      title: '产品版本号',
      dataIndex: 'version',
      key: 'version',
      align: 'center',
      width:'100px'
    },
    {
      title: '优先级',
      dataIndex: 'priority',
      key: 'priority',
      align: 'center',
      width: '130px',
      render: text => {
        let priority = '';
        switch (text){
          case 0:
            priority = 'P0-冒烟级';
            break;
          case 1:
            priority = 'P1-核心场景';
            break;
          case 2:
            priority = 'P2-次要功能';
            break;
          default:
            priority = 'P3-辅助功能';
            break;
        }
        return priority;
      }
    },
    {
      title:'状态',
      width: '80px',
      dataIndex:'status',
      align: 'center',
      render: status => status === 0 ? '有效' : '无效'
    },
    {
      title:'自动化状态',
      dataIndex:'autoStatus',
      align: 'center',
      width: '100px',
      render: autoStatus => {
        let status = '';
        switch(autoStatus){
          case 0:
            status = '未自动化';
            break;
          case 1:
            status = '计划自动化';
            break;
          case 2:
            status = '已自动化';
            break;
          default:
            status = '未自动化';
        }
        return status;
      }
    },
    {
      title: '评审状态',
      dataIndex: 'reviewStatus',
      key: 'reviewStatus',
      align: 'center',
      width: '100px',
      render: text => {
        let reviewStatus = '';
        switch (text){
          case 0:
            reviewStatus = '未评审';
            break;
          case 1:
            reviewStatus = '评审通过';
            break;
            case 2:
            reviewStatus = '评审不通过';
            break;
          default:
              reviewStatus = '未评审';
              break;
        }
        return reviewStatus;
      }
    },

    {
      title:'操作',
      align: 'center',
      width: '200px',
      render: (text, record, index)=>{
        return <span>
        <a onClick={() => {
          history.push(`/dashboard/testcase/update/${record.id}`);
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
          <Dropdown overlay={this.getBtnGroup(record.reviewStatus, record.status, record.id)}>
            <a>更多操作&nbsp;<Icon type="down"/></a>
          </Dropdown>
      </span>;
      }
    }
  ];
  updateReviewStatus = async(reviewStatus,id) =>{
    const data = {
      reviewStatus,
      id,
    };
    await testAction.updateReviewStatus(data);
    await testAction.getTestcaseList(testStore.request);

  };
  updateStatus = async (status, id) =>{
    const data = {
      status,
      id,
    };
    await testAction.updateStatus(data);
    await testAction.getTestcaseList(testStore.request);
  };
  onDelete = async(id) =>{
    await testAction.deleteTestCase(id);
    await testAction.getTestcaseList(testStore.request);
  };
  getBtnGroup = (reviewStatus, validStatus, key) =>{
    let menues = [];
    switch (reviewStatus){
      case 0:
        menues.push(
          <Menu.Item key={1}>
            <a onClick = {()=>this.updateReviewStatus(1,key)}> 评审通过</a>
          </Menu.Item>
        );
        menues.push(
          <Menu.Item key={2}>
            <a onClick = {()=>this.updateReviewStatus(2,key)}>评审不通过</a>
          </Menu.Item>
        );
        break;
      case 1:
        menues.push(
          <Menu.Item key={3}>
            <a onClick = {()=>this.updateReviewStatus(2,key)}>评审不通过</a>
          </Menu.Item>
        );
        break;
      case 2:
        menues.push(
          <Menu.Item key={4} onClick = {()=>this.updateReviewStatus(1,key)}>
            <a onClick = {()=>this.updateReviewStatus(1,key)}>评审通过</a>
          </Menu.Item>
        );
        break;
    }
    switch (validStatus){
      case 0:
        menues.push(
          <Menu.Item key={1}>
            <a onClick={()=>this.updateStatus(1,key)}>标为失效</a>
          </Menu.Item>
        );
        break;
      case 1:
        menues.push(
          <Menu.Item key={2}>
            <a onClick={()=>this.updateStatus(0,key)}>标为有效</a>
          </Menu.Item>
        );
        break;
    }
    return <Menu>{menues}</Menu>;
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
    productAction.getAllProductType().then((res) => {
      if (res) {
        this.setState({
          productTypes: res,
        });
      }
    });
    const pageRequest = this.state.pagination;
    const request = {
      pageRequest
    };
    testAction.updatePagination(pageRequest);
    testAction.getTestcaseList(request);
    productVersionAction.getAllProductVersions();
  };

  getProductTypeOptions = () =>{
    let options = [];
    if (this.state.productTypes) {
      _.each(this.state.productTypes, (item)=>{
        options.push(
          <Option value={item.id} key={item.id}>
            {item.productTypeName}
          </Option>
        );
      });
    }
    return options;
  };
  getProductNameOptions = () =>{
    let options = [];

    if (productStore.productName) {
        _.each(productStore.productName,(item)=>{
          options.push(
            <Option value={item.id} key={item.id}>
              {item.productName}
            </Option>
        );
      });
    }
    return options;
  };

  getProductVersionOptions = () => {
    let options = [];
    if (productVersionStore.allProductVersions) {
      _.each(productVersionStore.allProductVersions, (item) => {
        options.push(
          <Option value={item.id} key={item.id}>
            {item.version}
          </Option>
        );
      });
    }
    return options;
  };

  getFeatureOptions =()=>{
    let options = [];

    if (productStore.featureList) {
        _.each(productStore.featureList,(item)=>{
          options.push(
            <Option value={item.id} key={item.id}>
              {item.featureType}
            </Option>
        );
      });
    }
    return options;
  };

  getUnitOptions =()=>{
    let options = [];
    if (productStore.unitList) {
        _.each(productStore.unitList,(item)=>{
          options.push(
            <Option value={item.id} key={item.id}>
              {item.feature}
            </Option>
        );
      });
    }
    return options;
  };
  onProductTypeSelect = async(id) =>{
    const {form}= this.props;
    this.setState({
      productNameIdDisabled: false,
      featureTypeIdDisabled: true,
      featureUnitIdDisabled: true
    });
    form.resetFields(['productNameId']);
    form.resetFields(['featureTypeId']);
    form.resetFields(['featureUnitId']);
    await productAction.getProductNameListByTypeId(id);
  };
  onProductNameSelect = async(id) =>{
    const {form}= this.props;
    this.state.featureTypeIdDisabled=false;
    this.state.featureUnitIdDisabled=true;
    form.resetFields(['featureTypeId']);
    form.resetFields(['featureUnitId']);
    await productAction.getFeatureListByNameId(id);
  };
  onFeatureSelect = async(id)=>{
    const {form}= this.props;
    this.state.featureUnitIdDisabled=false;
    form.resetFields(['featureUnitId']);
    await productAction.getUnitListByFeatureId(id);
  };
  handleReset = () => {
    this.setState({
      productNameIdDisabled: true,
      featureTypeIdDisabled: true,
      featureUnitIdDisabled: true,
    });
      const pageRequest = {...testStore.request.pageRequest};
      const request = {
        pageRequest,
      };
      testAction.updateRequestData(request);
      this.props.form.resetFields();
      testAction.getTestcaseList(testStore.request);
    };
  handleTableChange = async (pagination) => {
    const pager = {...pagination};
    pager.pageNum = pagination.current;
    testAction.updatePagination(pager);
    testAction.getTestcaseList(testStore.request);
  };
  onSearch = () =>{
    this.props.form.validateFields((err,values)=>{
      if (!err){
        const request = {...testStore.request,...values};
        testAction.getTestcaseList(request);
        testAction.updateRequestData(request);
      }
    });
  };
  render(){
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 10 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 14 }
      }
    };
    return(
      <div className="testcase-container">
        <Form
          className="testcase-form"
          layout="horizontal"
        >
          <Row>
            <Col span={4}>
                <FormItem
                  {...formItemLayout}
                  label="产品类别"
                >
                  {getFieldDecorator('productTypeId')(
                    <Select
                      showSearch
                      placehoder="选择产品类别"
                      onSelect={this.onProductTypeSelect}
                      filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                    >
                      {
                        this.getProductTypeOptions()
                      }
                    </Select>)}
                </FormItem>
            </Col>
            <Col span={4}>
              <FormItem
                {...formItemLayout}
                label="产品名称"
              >
                {getFieldDecorator('productNameId')(
                  <Select
                    showSearch
                    placehoder="选择产品名称"
                    disabled={this.state.productNameIdDisabled}
                    onSelect={this.onProductNameSelect}
                    filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                  >
                    {
                      this.getProductNameOptions()
                    }
                  </Select>)}
              </FormItem>
            </Col>
            <Col span={4}>
              <FormItem
                {...formItemLayout}
                label="Feature大类"
              >
                {getFieldDecorator('featureTypeId')(
                  <Select
                    showSearch
                    placehoder="选择Feature"
                    disabled={this.state.featureTypeIdDisabled}
                    onSelect={this.onFeatureSelect}
                    filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                  >
                    {
                      this.getFeatureOptions()
                    }
                  </Select>)}
              </FormItem>
            </Col>
            <Col span={4}>
              <FormItem
                {...formItemLayout}
                label="功能单元"
              >
                {getFieldDecorator('featureUnitId')(
                  <Select
                    showSearch
                    placehoder="选择功能单元"
                    disabled={this.state.featureUnitIdDisabled}
                    filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                  >
                    {
                      this.getUnitOptions()
                    }
                  </Select>)}
              </FormItem>
            </Col>
            <Col span={4}>
              <FormItem
                {...formItemLayout}
                label="状态"
              >
                {getFieldDecorator('status')(
                  <Select
                    showSearch
                    placehoder="选择状态"
                    allowClear
                    filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                  >
                    <Option value={0} key={0}>有效</Option>
                    <Option value={1} key={1}>无效</Option>
                  </Select>)}
              </FormItem>
            </Col>
            <Col span={4}>
              <FormItem
                {...formItemLayout}
                label="自动化状态"
              >
              {getFieldDecorator('autoStatus')(
                  <Select
                    showSearch
                    placehoder="选择状态"
                    allowClear
                    filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                  >
                    <Option value={0} key={0}>未自动化</Option>
                    <Option value={1} key={1}>计划自动化</Option>
                    <Option value={2} key={2}>已自动化</Option>
                  </Select>)}
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span={4}>
              <FormItem
                {...formItemLayout}
                label="禅道ID"
              >
                {getFieldDecorator('externalId')(
                  <Input/>)}
              </FormItem>
            </Col>
            <Col span={4}>
              <FormItem
                {...formItemLayout}
                label="产品版本号"
              >
                {getFieldDecorator('versionId')(
                  <Select
                    showSearch
                    placehoder="选择产品版本号"
                    allowClear
                    filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                  >
                    {this.getProductVersionOptions()}
                  </Select>)}
              </FormItem>
            </Col>
            <Col span={4}>
              <FormItem
                {...formItemLayout}
                label="用例标题"
              >
                {getFieldDecorator('caseTitle')(
                  <Input/>)}
              </FormItem>
            </Col>
            <Col span={4}>
              <FormItem
                {...formItemLayout}
                label="评审状态"
              >
                {getFieldDecorator('reviewStatus')(<Select
                  placehoder="选择评审状态"
                  showSearch
                  allowClear
                  filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                >
                  <Option value={0} key={0}>未评审</Option>
                  <Option value={1} key={1}>评审通过</Option>
                  <Option value={2} key={2}>评审不通过</Option>
                </Select>)}
              </FormItem>
            </Col>
            <Col span={4}>
              <FormItem
                {...formItemLayout}
                label="优先级"
              >
                {getFieldDecorator('priority')(<Select
                  placehoder="选择优先级"
                  showSearch
                  allowClear
                  filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                >
                  <Option value={0} key={0}>P0-冒烟级</Option>
                  <Option value={1} key={1}>P1-核心场景</Option>
                  <Option value={2} key={2}>P2-次要功能</Option>
                  <Option value={3} key={3}>P3-辅助功能</Option>
                </Select>)}
              </FormItem>
            </Col>
            <Col span={4} className="action-btn" align="right">
              <FormItem>
                <Button icon="search" onClick={this.onSearch}>查询</Button>
                <Divider type="vertical"/>
                <Button icon="close" onClick={this.handleReset}>清除</Button>
              </FormItem>
            </Col>
            <Col span={4} align="right">
              <FormItem>
                <Button type="primary" onClick={() =>{history.push('/dashboard/testcase/create');}}>新增用例</Button>
                <Divider type="vertical"/>
                <Button type="primary" onClick={() => {message.warn('别点了，功能还没做');}}>缺陷参考</Button>
                </FormItem>
            </Col>
          </Row>
        </Form>
        <Divider/>
        <Table
          className="tc-table"
          scroll={{ x: 1800 }}
          dataSource={toJS(testStore.dataSource)}
          pagination={testStore.request.pageRequest}
          loading={testStore.testCaseLoading}
          columns={this.columns}
          expandedRowRender={this.expandedRows}
          rowKey={record => record.id}
          onChange={this.handleTableChange}
          locale={{emptyText:'暂无数据'}}
        />
      </div>
    );
  }
}

export default Testcase;
