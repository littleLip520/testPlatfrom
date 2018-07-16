import React from 'react';
import { Form, Input, Button, message, Select, DatePicker, Row, Col, Divider } from 'antd';
import moment from 'moment';
import _ from 'lodash';
import { observer } from 'mobx-react';
import history from '../../utils/history';
import '../../../less/iteration/createIteration.less';
import mobx from '../../mobx-data/';
import mobxUser from '../../mobx-data/mobxUser';


const {store: {userStore}, action: {userAction}} = mobxUser;
const {store:{iterationStore,productLineStore,basicStore}, action: {iterationAction,productLineAction,basicAction}} = mobx;
const FormItem = Form.Item;
const Option = Select.Option;


@Form.create()
@observer
class ExceptionForm extends React.Component{
  state = {
    update: false,
  };
  onSave = async(e) =>{
    e.preventDefault();
    this.props.form.validateFields(async(err,values)=>{
      if (err){
        return;
      }
      const request = {
        ...values,
      };
      await iterationAction.addException(request).then((flag)=>{
        console.log(flag);
        if (flag){
          history.push('/dashboard/iteration/exception');
        }
      });
    });
  };

  onUpdate = async(e) => {
    e.preventDefault();
    this.props.form.validateFields(async(err,values)=>{
      if (err){
        return;
      }
      const request = {
        ...values,
        id: iterationStore.exceptionDetail.id
      };
      await iterationAction.updateException(request).then((flag)=>{
        if (flag){
          history.push('/dashboard/iteration/exception');
        }
      });
    });
  };
  onCancel = () =>{
  history.push('/dashboard/iteration/exception');
};
  onSaveAndContinue = () => {
    message.info('保存成功');
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
    basicAction.getAllExceptionType();
    basicAction.getAlIterationMileStone();
  }
  componentDidMount(){
    if (this.props.match.path === '/dashboard/iteration/exception/create'){
      this.setState({
        update: false
      });
     } else {
       const recordId = this.props.match.params.id;
       iterationAction.getExceptionDetailById(recordId);
       this.setState({
         update: true,
         recordId,
       });
     }
  }

  getUserNameOptions = () => {
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

  getExceptionEventTypeOptions = () => {
    let options = [];
    if (basicStore.allExceptionType) {
      _.each(basicStore.allExceptionType, (item) => {
        options.push(
          <Option value={item.id} key={item.id}>
            {item.eventType}
          </Option>
        );
      });
    }
    return options;
  };


  getIterationMileStoneOptions = () => {
    let options = [];
    if (basicStore.allIterationMileStone) {
      _.each(basicStore.allIterationMileStone, (item) => {
        options.push(
          <Option value={item.id} key={item.id}>
            {item.iterationStoneName}
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



  getBtnGroup = () => {
    if (this.state.update) {
      return <Row className='actions'>
        <Button type="primary" onClick={this.onUpdate}>保存</Button>
        <Divider type="vertical"/>
        <Button type="primary" onClick={this.onCancel}>返回</Button>
      </Row>;
    }else {
      return <Row className='actions'>
        <Button type="primary" onClick={this.onSave}>保存</Button>
        <Divider type="vertical"/>
        <Button type="primary" onClick={this.onSaveAndContinue}>保存并继续添加</Button>
        <Divider type="vertical"/>
        <Button type="primary" onClick={this.onCancel}>返回</Button>
      </Row>;
    }
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
    const formAreaLayout = {
      labelCol: {
        xs: { span: 12 },
        sm: { span: 2 },
      },
      wrapperCol: {
        xs: { span: 12 },
        sm: { span: 16 },
      },

    };
    return(

      !iterationStore.exceptionDetail && this.state.update  ? null :
      <div className="create-iteration">
        <Form>
          <Row align="center">

            <Col span={8}>
              <FormItem
                {...formItemLayout}
                label="产品线">
                {
                  getFieldDecorator('productLineId',{
                    rules:[{
                  required: true,
                  message: '选择一个产品线'
                }],
                    initialValue: iterationStore.exceptionDetail&& this.state.update ? iterationStore.exceptionDetail.productLineId : ''
                  })(
                    <Select
                      showSearch
                      placehoder="选择一个产品线"
                      allowClear
                      onSelect={this.onCreateProductLineSelected}
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
                label="迭代状态"
              >
                {getFieldDecorator('iterationStatus',{
                  rules:[{
                    required: true,
                    message: '请选择迭代状态'
                  }],
                  initialValue: iterationStore.exceptionDetail&& this.state.update ? iterationStore.exceptionDetail.iterationStatus : ''
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
            <Col span={8}>
              <FormItem
                {...formItemLayout}
                label="迭代名称"
              >
                {getFieldDecorator('iterationId',{
                  rules:[{
                    required: true,
                    message: '请选择迭代名称'
                  }],
                  initialValue: iterationStore.exceptionDetail&& this.state.update ? iterationStore.exceptionDetail.iterationId : ''
                })(<Select
                  placehoder="迭代名称"
                  showSearch
                  allowClear
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
          <Row align="center">
            <Col span={8}>
              <FormItem
                {...formItemLayout}
                label="异常事件描述"
              >
                {getFieldDecorator('eventDesc', {
                  rules:[{
                    required: true,
                    message: '请输入异常事件描述',

                  },{
                    max:50,
                    message: '长度不超过50',
                  }],
                  initialValue: iterationStore.exceptionDetail&& this.state.update ? iterationStore.exceptionDetail.eventDesc : ''
                })(<Input/>)}
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem
                {...formItemLayout}
                label="事件类别"
              >
                {getFieldDecorator('eventTypeId',{rules:[{
                  required: true,
                  message: '请选择事件类别'
                }],
                  initialValue: iterationStore.exceptionDetail&& this.state.update ? iterationStore.exceptionDetail.eventTypeId : ''
                })(
                  <Select
                    combobox
                    allowClear
                    showSearch
                    autoFocus={true}
                    placehoder="事件类别"
                    filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                  >
                    {this.getExceptionEventTypeOptions()}
                  </Select>
                )}
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem
                {...formItemLayout}
                label="迭代里程碑"
              >
                {getFieldDecorator('iterationStoneId',{rules:[{
                    required: true,
                    message: '请选择迭代里程碑'
                  }],
                  initialValue: iterationStore.exceptionDetail&& this.state.update ? iterationStore.exceptionDetail.iterationStoneId : ''
                })(
                  <Select
                    combobox
                    allowClear
                    showSearch
                    autoFocus={true}
                    placehoder="迭代里程碑"
                    filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                  >
                    {this.getIterationMileStoneOptions()}
                  </Select>
                )}
              </FormItem>
            </Col>


          </Row>
          <Row align="center">
            <Col span={8}>
              <FormItem
                {...formItemLayout}
                label="延误时长(H)"
              >
                {getFieldDecorator('delayTime', {
                /*  rules:[{
                    required: true,
                    message: '请输入延误时长',
                  },{
                    max:20,
                    message: '长度不超过20',
                  }
                  ],*/
                  initialValue: iterationStore.exceptionDetail&& this.state.update ? iterationStore.exceptionDetail.delayTime : ''
                })(<Input/>)}
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem
                {...formItemLayout}
                label="责任人"
              >
                {getFieldDecorator('ownerId',{rules:[{
                    required: true,
                    message: '请选择责任人'
                  }],
                  initialValue: iterationStore.exceptionDetail&& this.state.update ? iterationStore.exceptionDetail.ownerId : ''
                })(
                  <Select
                    combobox
                    allowClear
                    showSearch
                    autoFocus={true}
                    placehoder="责任人"
                    filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                  >
                    {this.getUserNameOptions()}
                  </Select>
                )}
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem
                {...formItemLayout}
                label="审计人"
              >
                {getFieldDecorator('reviewerId',{rules:[{
                    required: true,
                    message: '请选择审计人'
                  }],
                  initialValue: iterationStore.exceptionDetail&& this.state.update ? iterationStore.exceptionDetail.reviewerId : ''
                })(
                  <Select
                    combobox
                    allowClear
                    showSearch
                    autoFocus={true}
                    placehoder="审计人"
                    filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                  >
                    {this.getUserNameOptions()}
                  </Select>
                )}
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem
                {...formItemLayout}
                label="审计日期"
              >
                {getFieldDecorator('reviewDate',{rules:[{
                    required: true,
                    message: '请选择审计日期'
                  }],
                  initialValue: iterationStore.exceptionDetail&& this.state.update ? moment(iterationStore.exceptionDetail.reviewDate) : null
                })(
                  <DatePicker />
                )}
              </FormItem>
            </Col>

          </Row>
          <Row align="left">
            <Col span={24}>
              <FormItem
                {...formAreaLayout}
                label="影响分析"
              >
                {getFieldDecorator('affectAnalysis', {
                  rules:[{
                    required: true,
                    message: '请输入影响分析'
                  },],
                  initialValue: iterationStore.exceptionDetail&& this.state.update ? iterationStore.exceptionDetail.affectAnalysis : ''
                })(<Input.TextArea className="area"/>)}
              </FormItem>
            </Col>
          </Row>
          <Row align="left">
            <Col span={24}>
              <FormItem
                {...formAreaLayout}
                 label="解决建议"
              >
                {getFieldDecorator('suggest', {
                  rules:[{
                    required: true,
                    message: '请输入解决建议'
                  },],
                  initialValue: iterationStore.exceptionDetail&& this.state.update ? iterationStore.exceptionDetail.suggest : ''
                })(<Input.TextArea className="area"/>)}
              </FormItem>
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

export default ExceptionForm;
