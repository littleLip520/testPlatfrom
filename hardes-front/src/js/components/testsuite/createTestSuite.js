import React from 'react';
import { Steps, Button, Form, Row, Col, Select, Input, Divider, Table } from 'antd';
import { observer } from 'mobx-react';
import _ from 'lodash';
import {toJS} from 'mobx';
import moment from 'moment';
import mobx from '../../mobx-data/mobxProduct';
import mobxMain from '../../mobx-data';
import mobxTest from '../../mobx-data/mobxTest';
import '../../../less/testsuite/createTestsuite.less';
import history from '../../utils/history';
const Step = Steps.Step;
const FormItem = Form.Item;
const Option = Select.Option;
const { action: {productAction},store:{productStore} } = mobx;
const {action:{strategyAction,iterationAction, productLineAction,productVersionAction},store:{strategyStore,iterationStore, productLineStore,productVersionStore}} = mobxMain;
const {action:{testAction}, store:{testStore}} = mobxTest;

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

const onFormSubmit = (form) => {
  console.log(form);
};
@Form.create()
@observer
class CreateTestSuite extends React.Component{
  state={
    productTypes:null,
    current:0,
    suiteName:'',
    productLineId: null,
    status: null,
    iterationName: null
  };

  next() {
    const {form} = this.formRef.props;
    form.validateFields((err, values)=>{
      if (!err){
        const data = {
          ...values
        };
        delete data.status;
        testAction.addTestSuite(data).then((flag) => {
          if (flag){
            const current = this.state.current + 1;
            this.setState({ current });
            testAction.setAddTestCaseList([]);
          }
        });
      }
    });
    // const current = this.state.current + 1;
    // this.setState({ current });
  }
  // prev() {
  //   const current = this.state.current - 1;
  //   this.setState({ current });
  // }

  componentDidMount(){
    strategyAction.getAllStrategy();
    productLineAction.getAllProductLine();
    testAction.getTestcaseList(testStore.request);
    productVersionAction.getAllProductVersions();
  }

   steps = [
    {
      title: '创建测试集',
      content: <CreateTestSuiteForm wrappedComponentRef = {(inst) => this.formRef = inst}/>
    },
    {
      title: '添加测试用例',
      content: <TestCaseList/>
    }
  ];
 onAdd = () => {
   const data = {
     testSuiteId: testStore.testSuiteId,
     testCaseIds: testStore.selectedTestCaseRowKeys
   };
   testAction.addOrUpdateTestCaseList(data).then((flag)=>{
     if (flag){
       this.toListPage();
       testAction.updateSelectRowKeys([]);
     }
   });
 };

 toListPage = () =>{
   testAction.updateSelectRowKeys([]);
   history.push('/dashboard/testsuite');
   testAction.updateSelectRowKeys([]);
 };
  getButtonGroup = () => {
    return(
      <Row
        justify="space-between"
        type="flex"
      >
        <Col className="complete" span={24}>

          <Button
            type="primary"
            disabled={!testStore.selectedTestCaseRowKeys.length > 0}
            onClick={this.onAdd}>
            { testStore.selectedTestCaseRowKeys.length > 0 ? `添加${testStore.selectedTestCaseRowKeys.length}条用例` :'添加'}
          </Button>

          <Button style={{ marginLeft: 8 }} onClick={this.toListPage}>
            暂不添加用例
          </Button>
        </Col>
      </Row>
    );
  };

  getStepActionBtnGroup = () => {
    return(
      <Row>
        <Col span={8}>
          <Button loading={testStore.addBtnLoading} type="primary" onClick={() => this.next()}>下一步</Button>
          <Button style={{ marginLeft: 8 }} onClick={this.toListPage}>取消</Button>
        </Col>
      </Row>
    );
  };


  render(){
    const { current } = this.state;
    return (
      <div className="create-testsuite">
        <Steps current={current}>
          {this.steps.map(item => <Step key={item.title} title={item.title} />)}
        </Steps>
        <div className="steps-content">{this.steps[this.state.current].content}</div>
        <div className="steps-action">
          {
            this.state.current < this.steps.length - 1
            &&
            this.getStepActionBtnGroup()
          }
          {
            this.state.current === this.steps.length - 1
            &&
            this.getButtonGroup()
          }
        </div>
      </div>
    );
  }
}

@Form.create()
@observer
class CreateTestSuiteForm extends React.Component{
  state={
    status:null,
    productLineId:null,
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

  getIterationNameOptions = () => {
    let options = [];
    if (iterationStore.iterationList) {
      _.each(iterationStore.iterationList, (item)=>{
        options.push(
          <Option value={item.id} key={item.id}>
            {item.iterationName}
          </Option>
        );
      });
    }
    return options;
  };

  getStrategyOptions = () =>{
    let options = [];
    if (strategyStore.allStrategy) {
      _.each(strategyStore.allStrategy, (item)=>{
        options.push(
          <Option value={item.id} key={item.id}>
            {item.strategyName}
          </Option>
        );
      });
    }
    return options;
  };
  onCreateProductLineSelected = (productLineId) => {
    const status = this.state.status;
    const request = {
      productLineId,
      status,
    };
    this.setState({
      productLineId,
    });
    iterationAction.getIterationListByPrdIdAndStatus(request);
  };

  onStatusSelect = (status) => {
    const productLineId = this.state.productLineId;
    const request = {
      productLineId,
      status,
    };
    this.setState({
      status,
    });
    iterationAction.getIterationListByPrdIdAndStatus(request);
  };
  onStrategySelected = (value,option) =>{
    const {form}= this.props;
    let testSuiteName = '';
    this.setState({
      strategyName: option.props.children,
    });
    if (this.state.iterationName){
      testSuiteName = `${this.state.iterationName} - ${option.props.children}`;
    }
    form.setFieldsValue({suiteName: testSuiteName});
  };
  onIterationNameSelected = (value, option) => {
    const {form}= this.props;
    let testSuiteName = '';
    if (this.state.strategyName){
      testSuiteName = `${option.props.children} - ${this.state.strategyName}`;
    }
    form.setFieldsValue({suiteName: testSuiteName});
    this.setState({
      iterationName: option.props.children,
    });
  };
  render(){
    const {getFieldDecorator} = this.props.form;
    return(
      <Form layout="horizontal"
        onSubmit={()=>onFormSubmit}
      >
        <Row gutter={{ xs: 8, sm: 16, md: 24}}
             type="flex"
             justify="space-around"
        >
          <Col span={6}>
            <FormItem
              {...formItemLayout}
              label="产品线"
            >
              {
                getFieldDecorator('productLineId', {
                  rules:[{required:true,message:'请选择产品线'}]
                })(<Select
                  showSearch
                  placehoder="选择一个产品线"
                  allowClear
                  onSelect={this.onCreateProductLineSelected}
                  filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                >
                  {this.getProductLineOptions()}
                </Select>)
              }
            </FormItem>
          </Col>
          <Col span={6}>
            <FormItem
              {...formItemLayout}
              label="迭代状态"
            >
              {getFieldDecorator('status',{
                rules:[{
                  required: true,
                  message: '请选择迭代状态'
                }]
              })(<Select
                placehoder="选择状态"
                showSearch
                allowClear
                onSelect={this.onStatusSelect}
                filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
              >
                <Option value={0} key={0}>规划中</Option>
                <Option value={1} key={1}>已上线</Option>
                <Option value={2} key={2}>已取消</Option>
                <Option value={3} key={3}>进行中</Option>
              </Select>)}
            </FormItem>
          </Col>
          <Col span={6}>
            <FormItem
              {...formItemLayout}
              label="迭代名称"
            >
              {getFieldDecorator('iterationId',{
                rules:[{
                  required: true,
                  message: '请选择迭代名称'
                }]
              })(<Select
                placehoder="迭代名称"
                showSearch
                allowClear
                onSelect={this.onIterationNameSelected}
                disabled={iterationStore.iterationNameDisabled}
                filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
              >
                {
                  this.getIterationNameOptions()
                }
              </Select>)}
            </FormItem>
          </Col>
        </Row>
        <Row gutter={{ xs: 8, sm: 16, md: 24}}
             type="flex"
             justify="space-around"
        >
          <Col span={6}>
            <FormItem
              {...formItemLayout}
              label="测试策略"
            >
              {
                getFieldDecorator('strategyId',{
                  rules:[{
                    required: true,
                    message: '请选择测试策略'
                  }]
                })(<Select
                  placehoder="测试策略"
                  showSearch
                  allowClear
                  onSelect={this.onStrategySelected}
                  filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                >
                  {this.getStrategyOptions()}
                </Select>)
              }
            </FormItem>
          </Col>
          <Col span={6}>
            <FormItem
              {...formItemLayout}
              label="运行方式"
            >
              {
                getFieldDecorator('testWayId',{
                  rules:[{
                    required: true,
                    message: '请选择运行方式'
                  }]
                })(<Select
                  placehoder="运行方式"
                  showSearch
                  allowClear
                  filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                >
                  <Option value={0} key={0}>
                    手工
                  </Option>
                  <Option value={1} key={1}>
                    自动化
                  </Option>
                </Select>)
              }
            </FormItem>
          </Col>
          <Col span={6}>
            <FormItem
              {...formItemLayout}
              label="测试集名称"
            >
              {
                getFieldDecorator('suiteName',{
                  rules:[{
                    required: true,
                    message: '测试集名称不为能空'
                  }]
                })(<Input disabled/>)
              }
            </FormItem>
          </Col>
        </Row>
      </Form>
    );
  }
}

@Form.create()
@observer
class  TestCaseList extends React.Component{
  state={
    productTypes:null,
    productNameIdDisabled:true,
    featureTypeIdDisabled:true,
    featureUnitIdDisabled:true,
  };
  columns = [
    {
      title: '用例ID',
      dataIndex: 'id',
      key: 'id',
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
      title: '产品版本号',
      dataIndex: 'version',
      key: 'version',
      align: 'center',
      width: '100px',
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
    }
  ];

  expandedRows = (record) =>{
    return (
      <div>
        <Row gutter={24}>
          <div dangerouslySetInnerHTML={{__html:record.stepsHtml}}/>
        </Row>
      </div>

    );
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
  componentDidMount(){
    productAction.getAllProductType().then((res) => {
      if (res) {
        this.setState({
          productTypes: res,
        });
      }
    });
  }
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
    this.setState({
      featureTypeIdDisabled: false,
      featureUnitIdDisabled: true
    });
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
      featureUnitIdDisabled: true
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
    const rowSelection = {
      onChange: (selectedRowKeys, selectedRows) => {
        testAction.updateSelectRowKeys(selectedRowKeys);
        console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
      },
      selectedRowKeys: toJS(testStore.selectedTestCaseRowKeys),
      getCheckboxProps: record => {
        let result = toJS(testStore.executeCaseIdList).find((item)=>{
          return record.id === item;
        });
        const flag = !!result;
        return {
          disabled: flag,
        };
      },
    };
    const {getFieldDecorator} = this.props.form;
    return (
      <div>
        <Form
          className="testcase-form"
          layout="horizontal"
        >
          <Row >
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
                    onSelect={this.onProductNameSelect}
                    disabled={this.state.productNameIdDisabled}
                    filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                  >
                    {
                      this.getProductNameOptions()
                    }
                  </Select>)}
              </FormItem>
            </Col>
            <Col span={5}>
              <FormItem
                {...formItemLayout}
                label="Feature大类"
              >
                {getFieldDecorator('featureTypeId')(
                  <Select
                    showSearch
                    placehoder="选择Feature"
                    onSelect={this.onFeatureSelect}
                    disabled={this.state.featureTypeIdDisabled}
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
            <Col span={2}>
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
            <Col span={5}>
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
                    <Option value={0} key={0}>没有自动化</Option>
                    <Option value={1} key={1}>计划自动化</Option>
                    <Option value={2} key={2}>已经自动化</Option>
                  </Select>)}
              </FormItem>
            </Col>
          </Row>
          <Row >


            <Col span={4}>
              <FormItem
                {...formItemLayout}
                label="禅道ID"
              >
                {getFieldDecorator('externalId')(
                  <Input/>)}
              </FormItem>
            </Col>
            <Col span={5}>
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
            <Col span={3}>
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
            <Col span={4} className="action-btn">
              <FormItem>
                <Button icon="search" onClick={this.onSearch}>查询</Button>
                <Divider type="vertical"/>
                <Button icon="close" onClick={this.handleReset}>清除</Button>
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
          rowSelection={rowSelection}
        />
      </div>
    );
  }
}



export default CreateTestSuite;
