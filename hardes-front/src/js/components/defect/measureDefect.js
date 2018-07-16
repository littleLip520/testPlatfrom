import React from 'react';
import { Form, Input, Button, Select, DatePicker, Row, Col, Divider, Popconfirm,Table } from 'antd';
import moment from 'moment';
import _ from 'lodash';
import { observer } from 'mobx-react';
import history from '../../utils/history';
import '../../../less/iteration/createIteration.less';
import mobx from '../../mobx-data/';
import mobxUser from '../../mobx-data/mobxUser';

const {store: {userStore}, action: {userAction}} = mobxUser;
const {store:{iterationStore,productLineStore,customerStore}, action: {iterationAction,productLineAction,customerAction}} = mobx;
const FormItem = Form.Item;
const Option = Select.Option;


const formAreaLayout = {
  labelCol: {
    xs: { span: 12 },
    sm: { span: 2 },
  },
  wrapperCol: {
    xs: { span: 12 },
    sm: { span: 16 },
  },
  area:{


  }
};



const getUserSelectOption = (data) => {
  let options = [];
  if (data) {
    _.each(data, (item) => {
      options.push(
        <Option value={item.id} key={item.id}>
          {item.disname}
        </Option>
      );
    });
  }
  return options;
};


const getCustomerSelectOption = (data) => {
  let options = [];
  if (data) {
    _.each(data, (item) => {
      options.push(
        <Option value={item.id} key={item.id}>
          {item.customerName}
        </Option>
      );
    });
  }
  return options;
};

@observer
class EditableCell extends React.Component {
  state ={
    value: this.props.value,
  }


  //kai  新增确认和关闭按钮事件处理
  onCancel = () =>{
    history.push('/dashboard/quality/defect/list');
  }
  onSure = () =>{
    history.push('/dashboard/quality/defect/list');
  }

  handleChange = (e) => {
    const value = e.target.value;
    this.setState({value});
    if (this.props.onChange) {
      this.props.onChange(value);
    }
  }

  check = () => {
    this.setState({
      editable: false
    });
    if (this.props.onChange) {
      this.props.onChange(this.state.value);
    }
  }

  edit = () => {
    this.setState({ editable: true });
  }

  handleSelect = (value) =>{
    this.setState({value});
    if (this.props.onChange) {
      this.props.onChange(value);
    }
  }

  render() {
    const { value } = this.state;
    const {type} = this.props;
    if (type === 'input') {
      return (
        <div className="editable-cell">
          {
            <Input
              value={value}
              onChange={this.handleChange}
            />
          }
        </div>
      );
    }
    if (type === 'user') {
      return(
        <Select
          combobox
          allowClear
          showSearch
          autoFocus={true}
          onSelect={this.handleSelect}
          filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
        >
          {
            getUserSelectOption(userStore.allActiveUser)
          }
        </Select>
      );
    }
    if (type==='customer') {
      return(
        <Select
          className="customer-selector"
          showSearch
          optionFilterProp="children"
          allowClear
          onSelect={this.handleSelect}
          filterOption={(input, option) => option.props.children.toLowerCase()
            .indexOf(input.toLowerCase()) >= 0}
        >
          {
            getCustomerSelectOption(customerStore.allCustomers)
          }
        </Select>
      );
    }
    if (type === 'type') {
      return(
        <Select
          className="requirement-type-selector"
          showSearch
          optionFilterProp="children"
          allowClear
          onSelect={this.handleSelect}
          filterOption={(input, option) => option.props.children.toLowerCase()
            .indexOf(input.toLowerCase()) >= 0}
        >
          <Option value={0} key={0}>
            BUG
          </Option>
          <Option value={1} key={1}>
            需求
          </Option>
        </Select>
      );
    }
  }
}


@Form.create()
@observer
class CreateIterationForm extends React.Component{
  constructor(props){
    super(props);
    this.columns=[
      {
        title: '禅道ID',
        dataIndex: 'businessName',
        key: 'businessName',
        editable: true,
        align: 'center',
        width: '10%',
        render: (text, record) => <EditableCell type='input' value={text} onChange={this.onCellChange(record.key, 'businessName')} />
      },
      {
        title: '客户',
        dataIndex:'businessType',
        align: 'center',
        width: '10%',
        editable: true,
        render: (text, record) => <EditableCell type = 'type' value={text} onChange={this.onCellChange(record.key, 'businessType')} />
      },
      {
        title: '严重级别',
        dataIndex:'externalId',
        align: 'center',
        width: '10%',
        editable: true,
        render: (text, record) => <EditableCell type='input' value={text} onChange={this.onCellChange(record.key, 'externalId')} />
      },
      {
        title: '标题',
        align: 'center',
        width: '10%',
        dataIndex:'sourceTeam',
        editable: true,
        render: (text, record) => <EditableCell type='input' value={text} onChange={this.onCellChange(record.key, 'sourceTeam')} />
      },
      {
        title: '原始录入日期',
        dataIndex:'hadesUserId',
        align: 'center',
        width: '10%',
        editable: true,
        render: (text, record) => <EditableCell type='user' value={text} onChange={this.onCellChange(record.key, 'hadesUserId')} />
      },
      {
        title: '所属产品线',
        dataIndex:'customerId',
        align: 'center',
        editable: true,
        width: '10%',
        render: (text, record) => <EditableCell type='customer' value={text} onChange={this.onCellChange(record.key, 'customerId')} />
      },
      {
        title: '归属团队',
        dataIndex:'customerId',
        align: 'center',
        editable: true,
        width: '10%',
        render: (text, record) => <EditableCell type='customer' value={text} onChange={this.onCellChange(record.key, 'customerId')} />
      },
      {
        title: '关联功能单元',
        dataIndex:'customerId',
        align: 'center',
        editable: true,
        width: '10%',
        render: (text, record) => <EditableCell type='customer' value={text} onChange={this.onCellChange(record.key, 'customerId')} />
      },
      {
        title: '当前状态',
        dataIndex:'customerId',
        align: 'center',
        editable: true,
        width: '10%',
        render: (text, record) => <EditableCell type='customer' value={text} onChange={this.onCellChange(record.key, 'customerId')} />
      },
      {
        title: '选择',
        align: 'center',
        dataIndex: 'operation',
        width: '10%',
        render:  (text, record) => {
          return (
            this.state.dataSource.length > 0 ?
              (
                <Popconfirm title="Sure to delete?" onConfirm={() => this.onDelete(record.key)}>
                  <a href="javascript:;">删除</a>
                </Popconfirm>
              ) : null
          );
        },
      }
    ];
    
    this.state ={
      dataSource:[],
      count: 0
    };
  }

  onCellChange = (key, dataIndex) => {
    return (value) => {
      const dataSource = [...this.state.dataSource];
      const target = dataSource.find(item => item.key === key);
      if (target) {
        target[dataIndex] = value;
        this.setState({ dataSource });
      }
    };
  }
  onDelete = (key) => {
    const dataSource = [...this.state.dataSource];
    this.setState({ dataSource: dataSource.filter(item => item.key !== key) });
  }
  handleAdd = () => {
    const { count, dataSource } = this.state;
    const newData = {
      key: count,
      businessName: '',
      businessType: 0,
      externalId: '',
      sourceTeam:'',
      hadesUserId:null,
      customerId: null,
    };
    this.setState({
      dataSource: [...dataSource, newData],
      count: count + 1,
    });
  }

  onSave = async(e) =>{
    await this.onSaveAndContinue(e);
    history.push('/dashboard/iteration');
  };
  onSaveAndContinue = async(e) => {
    e.preventDefault();
    this.props.form.validateFields(async(err,values)=>{
      if (err){
        return;
      }
      const request = {
        ...values,
        businessAddRequestList:this.state.dataSource,
      };
      await iterationAction.addIteration(request);
    });
  }

  onCancel = () =>{
    history.push('/dashboard/iteration');
  }

  getTestMemberNames = (members) => {
    let names = [];
    _.each(members,(item) => {
      names.push(item.disname);
    });
    return names;
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
  disabledDate = (current)=> {
    return current < moment().endOf('day');
  };
  componentWillMount() {
    productLineAction.getAllProductLine();
    userAction.getAllActiveUsers();
    iterationAction.getAllBusiness();
    customerAction.getAllCustomers();
  }
  componentDidMount(){
    iterationAction.getAllBusiness();
    this.setState({
      member: iterationStore.iterationDetail ? this.getTestMemberNames(iterationStore.iterationDetail.testMems):'',
    });
  }

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

  analysisAdd = () => {
    const { count, dataSource } = this.state;
    const newData = {
      key: count,
      pmNameId: '',
      businessType: 0,
      externalId: '',
      sourceTeam:'',
      hadesUserId:null,
      customerId: null,
    };
    this.setState({
      dataSource: [...dataSource, newData],
      count: count + 1,
    });
  }

  getBtnGroup = () => {
    return <Row className='actions'>
      {/*<Button type="primary" onClick={this.onSave}>保存</Button>
      <Divider type="vertical"/>
      <Button type="primary" onClick={this.onSaveAndContinue}>保存并继续添加</Button>
      <Divider type="vertical"/>
      <Button type="primary" onClick={this.onCancel}>返回</Button>*/}
    </Row>;
  };
  render(){
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      labelCol: {
        xs: { span: 12 },
        sm: { span: 8 },
      },
      wrapperCol: {
        xs: { span: 12 },
        sm: { span: 16 },
      },
    };
    return(
      <div className="create-iteration">
        <Form>
          <Row align="center" gutter={24}>
            <Col span={5}>
              <FormItem
                {...formItemLayout}
                label="产品类别"
              >
                {getFieldDecorator('pmNameId')(
                  <Select
                    combobox
                    allowClear
                    showSearch
                    autoFocus={true}
                    placehoder="产品经理"
                    filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                  >
                    {this.getUserSelectOptions()}
                  </Select>
                )}
              </FormItem>
            </Col>
            <Col span={5}>
              <FormItem
                {...formItemLayout}
                label="产品名称"
              >
                {getFieldDecorator('pmNameId')(
                  <Select
                    combobox
                    allowClear
                    showSearch
                    autoFocus={true}
                    placehoder="产品经理"
                    filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                  >
                    {this.getUserSelectOptions()}
                  </Select>
                )}
              </FormItem>
            </Col>
            <Col span={5}>
              <FormItem
                {...formItemLayout}
                label="Feature大类"
              >
                {getFieldDecorator('pmNameId')(
                  <Select
                    combobox
                    allowClear
                    showSearch
                    autoFocus={true}
                    placehoder="产品经理"
                    filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                  >
                    {this.getUserSelectOptions()}
                  </Select>
                )}
              </FormItem>
            </Col>
            <Col span={5}>
              <FormItem
                {...formItemLayout}
                label="功能单元"
              >
                {getFieldDecorator('devOwnerId')(
                  <Select
                    combobox
                    allowClear
                    showSearch
                    autoFocus={true}
                    placehoder="测试负责人"
                    filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                  >
                    {this.getUserSelectOptions()}
                  </Select>
                )}
              </FormItem>
            </Col>
            <Col className="query-col"  offset={22}>
              <Button icon="plus"  type="primary"  onClick={this.analysisAdd}>再次添加</Button>
            </Col>
          </Row>
          
          <Row align="left">
            <Col span={24}>
              <FormItem
                {...formAreaLayout}
                label="备注"
              >
                {getFieldDecorator('suggest', {
                  rules:[{
                    required: false,
                    message: '请输入备注'
                  },],
                  initialValue: this.state.update && iterationStore.exceptionDetail ? iterationStore.exceptionDetail.suggest : ''
                })(<Input.TextArea className="area"/>)}
              </FormItem>
            </Col>
            <Col className="query-col"  offset={24}>
              <Button   type="primary"  onClick={this.onSure}>确定</Button>
            </Col>
            <Col className="query-col"  offset={24}>
              <Button   type="primary"  onClick={this.onSure}>确定并关闭</Button>
            </Col>
          </Row>
          <Row align="center" justify="center" type="flex">
            <Col span={24}>
              <Button onClick={this.handleAdd} type="primary" style={{ marginBottom: 16 }}>
                查询
              </Button>
              <Divider type="vertical" />
              <Button  type="primary" style={{ marginBottom: 16 }}>
                确定并关闭
              </Button>
              <Table dataSource={this.state.dataSource} columns={this.columns} />
            </Col>
          </Row>

          <Row align="left">
            <Col span={24} align="left">
              <FormItem
                {...formAreaLayout}
                label="负责人初步分析"
              >
                {getFieldDecorator('suggest', {
                  rules:[{
                    required: false,
                    message: '请输入测试负责人初步分析'
                  },],
                  initialValue: this.state.update && iterationStore.exceptionDetail ? iterationStore.exceptionDetail.suggest : ''
                })(<Input.TextArea className="area"/>)}
              </FormItem>
            </Col>
            <Col className="query-col"  offset={24}>
              <Button   type="primary"  onClick={this.onSure}>确定</Button>
            </Col>
            <Col className="query-col"  offset={24}>
              <Button   type="primary"  onClick={this.onSure}>确定并关闭</Button>
            </Col>
            <Col className="query-col">
              {/*<button type="primary">确定并关闭 style={{ marginBottom: 16 }}</button>*/}
            </Col>
          </Row>
          <Row align="left">
            <Col span={24} align="left">
              <FormItem
                {...formAreaLayout}
                label="当前缺陷已于 2018年6月23日  分配给 叶飞 去解决，预计修复日期是："
              >
                {getFieldDecorator('suggest', {
                  rules:[{
                    required: false,
                    message: '当前解决方案描述'
                  },],
                  initialValue: this.state.update && iterationStore.exceptionDetail ? iterationStore.exceptionDetail.suggest : ''
                })(<Input.TextArea className="area"/>)}
              </FormItem>
            </Col>
            <Col className="query-col"  offset={24}>
              <Button   type="primary"  onClick={this.onSure}>刷新</Button>
            </Col>
            <Col className="query-col"  offset={24}>
              <Button   type="primary"  onClick={this.onSure}>确定</Button>
            </Col>
            <Col className="query-col"  offset={24}>
              <Button   type="primary"  onClick={this.onSure}>确定并关闭</Button>
            </Col>
            <Col className="query-col">
              {/*<button type="primary">确定并关闭 style={{ marginBottom: 16 }}</button>*/}
            </Col>
          </Row>
          <Row align="left">
            <Col span={24} align="left">
              <FormItem
                {...formAreaLayout}
                label=" 当前缺陷已于 2018年6月28日  由 马龙 标记为已解决，测试负责人需继续分析："
              >
                {getFieldDecorator('suggest', {
                  rules:[{
                    required: false,
                    message: '归因分析描述',
                  },],
                  initialValue: this.state.update && iterationStore.exceptionDetail ? iterationStore.exceptionDetail.suggest : ''
                })(<Input.TextArea className="area"/>)}
              </FormItem>
            </Col>
            <Col className="query-col"  offset={24}>
              <Button   type="primary"  onClick={this.onSure}>刷新</Button>
            </Col>
            
            <Col className="query-col">
              {/*<button type="primary">确定并关闭 style={{ marginBottom: 16 }}</button>*/}
            </Col>
          </Row>
          <Row align="left">
            <Col span={24} align="left">
              <FormItem
                {...formAreaLayout}
                label="是否临时解决方案？"
              >
                {getFieldDecorator('suggest', {
                  rules:[{
                    required: false,
                    message: '永久解决方案描述：',
                  },],
                  initialValue: this.state.update && iterationStore.exceptionDetail ? iterationStore.exceptionDetail.suggest : ''
                })(<Input.TextArea className="area"/>)}
              </FormItem>
            </Col>

            <Col className="query-col">
              {/*<button type="primary">确定并关闭 style={{ marginBottom: 16 }}</button>*/}
            </Col>
          </Row>
          <Row align="left">
            <Col span={24} align="left">
              <FormItem
                {...formAreaLayout}
                label="是否可通过测试改进避免/缓释？"
              >
                {getFieldDecorator('suggest', {
                  rules:[{
                    required: false,
                    message: '如能避免缓释，建议采取什么行动？',
                  },],
                  initialValue: this.state.update && iterationStore.exceptionDetail ? iterationStore.exceptionDetail.suggest : ''
                })(<Input.TextArea className="area"/>)}
              </FormItem>
            </Col>
            <Col className="query-col">
            </Col>
          </Row>
          <Row gutter={24}>
            <Col span={6} offset={10} >
              <Button type="primary"  onClick={this.onCancel}>确定并确定</Button>
              <Divider type="vertical"/>
              <Button type="primary" onClick={this.onCancel}>关闭</Button>
            </Col>
          </Row>
          {
            this.getBtnGroup()
          }
        </Form>
      </div>
    );
  }
}

export default CreateIterationForm;
