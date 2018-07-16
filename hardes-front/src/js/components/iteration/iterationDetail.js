import React from 'react';
import { Form, Input, Button, Select, DatePicker, Row, Col, Divider, Table, Popconfirm } from 'antd';
import moment from 'moment';
import _ from 'lodash';
import { observer } from 'mobx-react';
import {toJS} from 'mobx';
import history from '../../utils/history';
import '../../../less/iteration/createIteration.less';
import mobx from '../../mobx-data/';
import mobxUser from '../../mobx-data/mobxUser';

const {store: {userStore}, action: {userAction}} = mobxUser;
const {store:{iterationStore,productLineStore, customerStore}, action: {iterationAction,productLineAction, customerAction}} = mobx;
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
  };

  handleChange = (e) => {
    const value = e.target.value;
    this.setState({value});
    if (this.props.onChange) {
      this.props.onChange(value);
    }
  };

  check = () => {
    this.setState({
      editable: false
    });
    if (this.props.onChange) {
      this.props.onChange(this.state.value);
    }
  };

  edit = () => {
   this.setState({ editable: true });
 }

 handleSelect = (value) =>{
   this.setState({value});
   if (this.props.onChange) {
     this.props.onChange(value);
   }
 };

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
          defaultValue={value}
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
          defaultValue={value}
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
          defaultValue={value}
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
class IterationForm extends React.Component{
  state = {
    update: false,
  };
  columns=[
    {
      title: '需求名称',
      dataIndex: 'businessName',
      key: 'businessName',
      editable: true,
      align: 'center',
      width: '20%',
      render: (text, record) => <EditableCell type='input' value={text} onChange={this.onCellChange(record.id, 'businessName')} />
    },
    {
      title: '类型',
      dataIndex:'businessType',
      align: 'center',
      width: '10%',
      editable: true,
      render: (text, record) => <EditableCell type = 'type' value={text} onChange={this.onCellChange(record.id, 'businessType')} />
    },
    {
      title: '禅道ID',
      dataIndex:'externalId',
      align: 'center',
      width: '15%',
      editable: true,
      render: (text, record) => <EditableCell type='input' value={text} onChange={this.onCellChange(record.id, 'externalId')} />
    },
    // {
    //   title: '来源团队',
    //   align: 'center',
    //   width: '15%',
    //   dataIndex:'sourceTeam',
    //   editable: true,
    //   render: (text, record) => <EditableCell type='input' value={text} onChange={this.onCellChange(record.id, 'sourceTeam')} />
    // },
    {
      title: '禅道链接',
      dataIndex:'externalLink',
      align: 'center',
      width: '15%',
      editable: true,
      render: (text, record) => <EditableCell type='input' value={text} onChange={this.onCellChange(record.id, 'externalLink')} />
    },
    {
      title: '来源人',
      dataIndex:'hadesUserId',
      align: 'center',
      width: '15%',
      editable: true,
        render: (text, record) => <EditableCell type='user' value={text} onChange={this.onCellChange(record.id, 'hadesUserId')} />
    },
    {
      title: '面向客户',
      dataIndex:'customerId',
      align: 'center',
      editable: true,
      width: '15%',
      render: (text, record) => <EditableCell type='customer' value={text} onChange={this.onCellChange(record.id, 'customerId')} />
    },
    {
      title: '操作',
      align: 'center',
      dataIndex: 'operation',
      render:  (text, record) => {
        return (
          this.state.dataSource.length > 0 ?
          (
            <Popconfirm title="确认删除?" onConfirm={() => this.onDelete(record)}>
              <a href="javascript:;">删除</a>
            </Popconfirm>
          ) : null
        );
      },
    }
  ];
  onCellChange = (key, dataIndex) => {
    return (value) => {
      const dataSource = [...this.state.dataSource];
      const target = dataSource.find(item => item.id === key);
      if (target) {
        target[dataIndex] = value;
        this.setState({ dataSource });
      }
    };
  }
  onDelete = async(record) => {
    const dataSource = [...this.state.dataSource];
    if (record.id) {
      await iterationAction.deleteBusiness(record.id).then((flag)=>{
        if (flag) {
          this.setState({ dataSource: dataSource.filter(item => item.id !== record.id )});
        }
      });
    }else {
      this.setState({ dataSource: dataSource.filter(item => item.key  !== record.key )});
    }
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
    e.preventDefault();
    this.props.form.validateFields((err,values)=>{
      if (err){
        return;
      }
      const request = {
        businessUpdRequestList: this.state.dataSource,
        ...values,
        id: this.state.recordId
      };
      console.log(this.state.dataSource);
      iterationAction.updateIteration(request).then((flag)=>{
        if (flag) {
          history.push('/dashboard/iteration');
        }
      });

    });
  };

  onUpdate = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err,values)=>{
      if (err){
        return;
      }
      const request = {
        ...values,
        id: iterationStore.iterationDetail.id
      };
      iterationAction.updateIteration(request);
    });
  };
  onCancel = () =>{
  history.push('/dashboard/iteration');
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
     const recordId = this.props.match.params.id;
     iterationAction.getAllBusiness();
     iterationAction.getIterationDetailById(recordId).then((flag)=>{
       this.setState({
         recordId,
         dataSource: iterationStore.iterationDetail.businessList,
         count: iterationStore.iterationDetail.businessList.length,
         member: iterationStore.iterationDetail ? this.getTestMemberNames(iterationStore.iterationDetail.testMems):'',
       });
     });

  }
  getTestMemberNames = (members) => {
    let names = [];
    _.each(members,(item) => {
      names.push(item.disname);
    });
    return names;
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

  getBusinessOptions = () => {
    let options = [];
    if (iterationStore.allBusiness){
      _.each(iterationStore.allBusiness, (item)=>{
        options.push(
          <Option value={item.id} key={item.id}>
            {item.businessName}
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
      !iterationStore.iterationDetail && this.state.update  ? null :
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
                  },{
                    max: 100,
                    message: '长度不超过100'
                  },],
                  initialValue: iterationStore.iterationDetail ? iterationStore.iterationDetail.iterationName : ''

                })(<Input/>)}
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem
                {...formItemLayout}
                label="产品线">
                {
                  getFieldDecorator('productLineId', {
                    rules:[{
                      required: true,
                      message: '请选择一个产品线'
                    }],
                    initialValue: iterationStore.iterationDetail ? iterationStore.iterationDetail.productLineId : ''
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
                {getFieldDecorator('pmNameId', {
                  rules:[{
                    required: true,
                    message: '请选择一个产品经理'
                  }],
                    initialValue:  iterationStore.iterationDetail ? iterationStore.iterationDetail.pmNameId : ''
                })(
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
                {getFieldDecorator('devOwnerId', {
                  rules:[{
                    required: true,
                    message: '请选择一个开发负责人'
                  }],
                  initialValue: iterationStore.iterationDetail ? iterationStore.iterationDetail.devOwnerId : ''
                })(
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
                {getFieldDecorator('testOwnerId', {
                  rules:[{
                    required: true,
                    message: '请选择一个测试负责人'
                  }],
                  initialValue: iterationStore.iterationDetail ? iterationStore.iterationDetail.testOwnerId : ''
                })(
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

                {getFieldDecorator('testMemIdList', {
                  rules:[{
                    required: true,
                    message: '请选择一个测试成员'
                  }],
                  initialValue: iterationStore.iterationDetail ? iterationStore.iterationDetail.testMemIdList && iterationStore.iterationDetail.testMemIdList.length>0 ? iterationStore.iterationDetail.testMemIdList.slice(): undefined: undefined
                  })(
                  <Select
                    allowClear
                    mode="multiple"
                    autoFocus={true}
                    placehoder="测试成员"
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
                {getFieldDecorator('planDate', {
                  rules:[{
                    required: true,
                    message: '请选择计划上线日期'
                  }],
                  initialValue: iterationStore.iterationDetail ? moment(iterationStore.iterationDetail.planDate) : undefined
                })(
                  <DatePicker
                    disabledDate={this.disabledDate}
                  />
                )}
              </FormItem>
            </Col>
            {
              <Col span={8}>
                <FormItem
                  {...formItemLayout}
                  label="实际上线日期"
                >
                  {getFieldDecorator('actualDate',{
                    initialValue: iterationStore.iterationDetail && iterationStore.iterationDetail.actualDate ? moment(iterationStore.iterationDetail.actualDate) : undefined
                  })(
                    <DatePicker
                      placeholder="选择实际上线日期"
                    />
                  )}
                </FormItem>
              </Col>
            }
          </Row>
          <Row align="center" justify="center" type="flex">
            <Col span={20}>
              <Button onClick={this.handleAdd} type="primary" style={{ marginBottom: 16 }}>
                添加需求
              </Button>
              <Table
                dataSource={toJS(this.state.dataSource)}
                columns={this.columns}
                pagination={false}
                rowKey={record => record.id || record.key}
               />
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

export default IterationForm;
