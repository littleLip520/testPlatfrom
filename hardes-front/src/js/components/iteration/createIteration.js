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
        title: '需求名称',
        dataIndex: 'businessName',
        key: 'businessName',
        editable: true,
        align: 'center',
        width: '20%',
        render: (text, record) => <EditableCell type='input' value={text} onChange={this.onCellChange(record.key, 'businessName')} />
      },
      {
        title: '类型',
        dataIndex:'businessType',
        align: 'center',
        width: '10%',
        editable: true,
        render: (text, record) => <EditableCell type = 'type' value={text} onChange={this.onCellChange(record.key, 'businessType')} />
      },
      {
        title: '禅道ID',
        dataIndex:'externalId',
        align: 'center',
        width: '15%',
        editable: true,
        render: (text, record) => <EditableCell type='input' value={text} onChange={this.onCellChange(record.key, 'externalId')} />
      },
      {
        title: '禅道链接',
        dataIndex:'externalLink',
        align: 'center',
        width: '15%',
        editable: true,
        render: (text, record) => <EditableCell type='input' value={text} onChange={this.onCellChange(record.key, 'externalLink')} />
      },
      // {
      //   title: '来源团队',
      //   align: 'center',
      //   width: '15%',
      //   dataIndex:'sourceTeam',
      //   editable: true,
      //   render: (text, record) => <EditableCell type='input' value={text} onChange={this.onCellChange(record.key, 'sourceTeam')} />
      // },
      {
        title: '来源人',
        dataIndex:'hadesUserId',
        align: 'center',
        width: '15%',
        editable: true,
          render: (text, record) => <EditableCell type='user' value={text} onChange={this.onCellChange(record.key, 'hadesUserId')} />
      },
      {
        title: '面向客户',
        dataIndex:'customerId',
        align: 'center',
        editable: true,
        width: '15%',
        render: (text, record) => <EditableCell type='customer' value={text} onChange={this.onCellChange(record.key, 'customerId')} />
      },
      {
        title: '操作',
        align: 'center',
        dataIndex: 'operation',
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
  };

  onSave = async(e) =>{
    const {form} = this.props;
    form.validateFields(async(err,values)=>{
      if (!err){
        const request = {
          ...values,
          businessAddRequestList:this.state.dataSource,
        };
        iterationAction.addIteration(request).then((flag)=>{
          if (flag){
            history.push('/dashboard/iteration/');
          }
        });
      }
    });
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
      iterationAction.addIteration(request);
    });
  };

  onCancel = () =>{
    history.push('/dashboard/iteration');
  };

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
   // iterationAction.getAllBusiness();
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

  getBtnGroup = () => {
    return <Row className='actions'>
      <Button type="primary" onClick={this.onSave}>保存</Button>
      <Divider type="vertical"/>
      <Button type="primary" onClick={this.onSaveAndContinue}>保存并继续添加</Button>
      <Divider type="vertical"/>
      <Button type="primary" onClick={this.onCancel}>返回</Button>
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
          <Row align="center">
            <Col span={8}>
              <FormItem
                {...formItemLayout}
                label="迭代名称"
              >
                {getFieldDecorator('iterationName', {
                  rules:[{
                    required: true,
                    message: '请输入迭代名称'
                  },]
                })(<Input/>)}
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem
                {...formItemLayout}
                label="产品线">
                {
                  getFieldDecorator('productLineId',{
                    rules:[{required:true,message:'请选择产品线'}]
                  })(
                    <Select
                      showSearch
                      placehoder="选择一个产品线"
                      allowClear
                    >
                      {
                        this.getProductLineOptions()
                      }
                    </Select>)
                }
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem
                {...formItemLayout}
                label="产品经理"
              >
                {getFieldDecorator('pmNameId',{
                  rules:[{
                  required: true,
                  message: '请选择一个产品经理'
                }]})(
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
          </Row>
          <Row align="center">
            <Col span={8}>
              <FormItem
                {...formItemLayout}
                label="开发负责人"
              >
                {getFieldDecorator('devOwnerId',{
                  rules:[{
                    required: true,
                    message: '请选择一个开发负责人'
                  }]})(
                  <Select
                    combobox
                    allowClear
                    showSearch
                    autoFocus={true}
                    placehoder="开发负责人"
                    filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                  >
                    {this.getUserSelectOptions()}
                  </Select>
                )}
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem
                {...formItemLayout}
                label="测试负责人"
              >
                {getFieldDecorator('testOwnerId',{
                  rules:[{
                    required: true,
                    message: '请选择一个测试负责人'
                  }]})(
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
            <Col span={8}>
              <FormItem
                {...formItemLayout}
                label="测试成员"
              >
                {getFieldDecorator('testMemIdList')(
                  <Select
                    allowClear
                    mode="multiple"
                    autoFocus={true}
                    placehoder="测试负责人"
                    filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                  >
                    {this.getUserSelectOptions()}
                  </Select>
                )}
              </FormItem>
            </Col>
          </Row>
          <Row align="center">
            <Col span={8}>
              <FormItem
                {...formItemLayout}
                label="计划上线日期"
              >
                {getFieldDecorator('planDate',{
                  rules:[{
                    required: true,
                    message: '请选择计划上线日期'
                  }]})(
                  <DatePicker
                    disabledDate={this.disabledDate}
                  />
                )}
              </FormItem>
            </Col>
          </Row>
          <Row align="center" justify="center" type="flex">
            <Col span={20}>
              <Button onClick={this.handleAdd} type="primary" style={{ marginBottom: 16 }}>
                添加需求
              </Button>
              <Table dataSource={this.state.dataSource} columns={this.columns} />
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
