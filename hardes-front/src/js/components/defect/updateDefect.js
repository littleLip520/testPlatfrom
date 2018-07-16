import React from 'react';
import { Form, Input, Button, Select, DatePicker, Row, Col, Divider, Popconfirm,Table } from 'antd';
import { Editor } from 'react-draft-wysiwyg';
import { EditorState, convertToRaw, ContentState, convertFromHTML} from 'draft-js';
import draftToHtml from 'draftjs-to-html';
import _ from 'lodash';
import { observer } from 'mobx-react';
import history from '../../utils/history';
import '../../../less/defect/defect.less';
import mobx from '../../mobx-data/';
import mobxUser from '../../mobx-data/mobxUser';

const {store: {userStore}, action: {userAction}} = mobxUser;
const {store:{defectStore,productLineStore,customerStore,defectStatusStore,defectPriorityStore,defectSeverityStore,teamStore,productVersionStore}, action: {defectAction,productLineAction,customerAction,defectStatusAction,defectPriorityAction,defectSeverityAction,teamAction,productVersionAction}} = mobx;
const Option = Select.Option;
const FormItem = Form.Item;

@Form.create()
@observer
class UpdateDefectForm extends React.Component {
  constructor(props){
    super(props);
  }
  state = {
    update: false,
  };

  //kai  新增确认和关闭按钮事件处理
  onCancel = () =>{
    history.push('/dashboard/defect/list');
  };

  onSave = async(e) =>{
    await this.onSaveAndContinue(e).then((flag)=>{
      if (flag) {
        history.push('/dashboard/defect/list');
      }
    });

  };

  onSaveAndContinue = async(e) =>{
    e.preventDefault();
    let flag = true;
    this.props.form.validateFields(async(err,values)=> {
      if (!err) {
        const request = {
          ...values
        };
        return await defectAction.updateDefect(request);
      }else {
        flag = false;
      }
    });
    return flag;
  };

  componentWillMount() {

  }

  componentDidMount(){
    this.setState({
      id: this.props.match.params.id,
    });
    productLineAction.getAllProductLine().then((res) => {
      if (res) {
        this.setState({
          productLines: res,
        });
      }
    });
    defectAction.getDefectById(this.props.match.params.id).then(async (flag) =>{
      if (flag){
        this.setState({
          editorState: defectStore.defect ? EditorState.createWithContent(
            ContentState.createFromBlockArray(
              // convertFromHTML(defectStore.defect.stepsHtml)
            )) : EditorState.createEmpty()
        });
        // await productAction.getProductNameListByTypeId(testStore.testcase.productTypeId);
        // await productAction.getFeatureListByNameId(testStore.testcase.productNameId);
        // await productAction.getUnitListByFeatureId(testStore.testcase.featureTypeId);
      }
    });
    // userAction.getAllActiveUsers();
    // customerAction.getAllCustomers();
    // defectStatusAction.getAllDefectStatus();
    // defectPriorityAction.getAllDefectPriority();
    // defectSeverityAction.getAllDefectSeverity();
    // teamAction.getAllTeams();
    // productVersionAction.getAllProductVersions();
  }

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

  getCustomerOptions = () =>{
    let options = [];
    if (customerStore.allCustomers) {
      customerStore.allCustomers.map((item)=>{
        options.push(
          <Option value={item.id} key={item.id}>
            {item.customerName}
          </Option>
        );
      });
    }
    return options;
  };

  getUserOptions = () => {
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

  getSeverityOptions = () => {
    let options = [];
    if (defectSeverityStore.allSeverities) {
      _.each(defectSeverityStore.allSeverities, (item) => {
        options.push(
          <Option value={item.id} key={item.id}>
            {item.description}
          </Option>
        );
      });
    }
    return options;
  };

  getPriorityOptions = () => {
    let options = [];
    if (defectPriorityStore.allPriorities) {
      _.each(defectPriorityStore.allPriorities, (item) => {
        options.push(
          <Option value={item.id} key={item.id}>
            {item.description}
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
    defectAction.getIterationList(request);
  };

  handleSubmit = async(e) =>{
    e.preventDefault();
    this.props.form.validateFields(async (err,values)=>{
      const pageRequest = this.state.request.pageRequest;
      const request = {
        ...values,
        pageRequest
      };
      await defectAction.getIterationList(request);
      request.pageRequest.total = defectStore.total;
      this.setState({
        request
      });
    });
  };

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
      <div className="create-defect">
        <Form>
          <Row align="center">
            <Col span={6}>
              <FormItem
                label="禅道ID"
                {...formItemLayout}
              >
                {getFieldDecorator('externalId',{
                  initialValue: defectStore.defect ? defectStore.defect.externalId : undefined
                })(
                  <Input/>
                )}
              </FormItem>
            </Col>
            <Col span={6}>
              <FormItem
                label="客户"
                {...formItemLayout}
              >
                {getFieldDecorator('customerId')(
                  <Select
                    showSearch
                    placehoder="请选择客户"
                    allowClear
                  >
                    {
                      this.getCustomerOptions()
                    }
                  </Select>)
                }
              </FormItem>
            </Col>
            <Col span={6}>
              <FormItem
                label="标题"
                {...formItemLayout}
              >
                {getFieldDecorator('subject',{
                  initialValue: defectStore.defect ? defectStore.defect.subject : undefined
                })(
                  <Input style={{width: 500}}/>)}
              </FormItem>
            </Col>
          </Row>

          <Row align="center">
            <Col span={6}>
              <FormItem
                label="原始录入人"
                {...formItemLayout}
              >
                {getFieldDecorator('authorId')(
                  <Select
                    showSearch
                    placehoder="请选择原始录入人"
                    allowClear
                  >
                    {
                      this.getUserOptions()
                    }
                  </Select>)
                }
              </FormItem>
            </Col>
            <Col span={6}>
              <FormItem
                {...formItemLayout}
                label="原始录入日期"
              >
                {getFieldDecorator('creationTime')(
                  <DatePicker/>
                )}
              </FormItem>
            </Col>
            <Col span={6}>
              <FormItem
                label="严重级别"
                {...formItemLayout}
              >
                {getFieldDecorator('severityId')(
                  <Select
                    showSearch
                    placehoder="请选择严重级别"
                    allowClear
                  >
                    {
                      this.getSeverityOptions()
                    }
                  </Select>)
                }
              </FormItem>
            </Col>
            <Col span={6}>
              <FormItem
                label="业务优先级"
                {...formItemLayout}
              >
                {getFieldDecorator('priorityId')(
                  <Select
                    showSearch
                    placehoder="请选择业务优先级"
                    allowClear
                  >
                    {
                      this.getPriorityOptions()
                    }
                  </Select>)
                }
              </FormItem>
            </Col>

          </Row>

          <Row align="center">
            <Col span={6}>
              <FormItem
                label="当前状态"
                {...formItemLayout}
              >
                {getFieldDecorator('statusId')(
                  <Select
                    showSearch
                    placehoder="请选择当前状态"
                    allowClear
                  >
                    {
                      this.getStatusOptions()
                    }
                  </Select>)
                }
              </FormItem>
            </Col>
            <Col span={6}>
              <FormItem
                label="所属产品线"
                {...formItemLayout}
              >
                {getFieldDecorator('productLineId')(
                  <Select
                    showSearch
                    placehoder="请选择所属产品线"
                    allowClear
                  >
                    {
                      this.getProductLineOptions()
                    }
                  </Select>)
                }
              </FormItem>
            </Col>
            <Col span={6}>
              <FormItem
                label="版本"
                {...formItemLayout}
              >
                {getFieldDecorator('productVersionId')(
                  <Select
                    showSearch
                    placehoder="请选择版本"
                    allowClear
                  >
                    {
                      this.getProductVersionOptions()
                    }
                  </Select>)
                }
              </FormItem>
            </Col>
            <Col span={6}>
              <FormItem
                label="所属团队"
                {...formItemLayout}
              >
                {getFieldDecorator('sourceTeamId')(
                  <Select
                    showSearch
                    placehoder="请选择所属团队"
                    allowClear
                  >
                    {
                      this.getTeamOptions()
                    }
                  </Select>)
                }
              </FormItem>
            </Col>
            <Col span={6}>
              <FormItem
                label="跟踪人"
                {...formItemLayout}
              >
                {getFieldDecorator('tracerId')(
                  <Select
                    showSearch
                    placehoder="请选择跟踪人"
                    allowClear
                  >
                    {
                      this.getUserOptions()
                    }
                  </Select>)
                }
              </FormItem>
            </Col>

          </Row>

          <Row align="center">
            <Col span={6} offset={10} >
              <Button type="primary"  onClick={this.onSave}>确定</Button>
              <Divider type="vertical"/>
              <Button type="primary" onClick={this.onCancel}>关闭</Button>
            </Col>
          </Row>
        </Form>
      </div>
    );
  }
}

export default UpdateDefectForm;