import React from 'react';
import { Form, Input, Button, Select, DatePicker, Row, Col, Divider, Popconfirm,Table } from 'antd';
import moment from 'moment';
import _ from 'lodash';
import { observer } from 'mobx-react';
import history from '../../utils/history';
import '../../../less/environment/createEnvironment.less';
import mobx from '../../mobx-data/';
import mobxEnvironment from '../../mobx-data/mobxEnvironment';
import mobxUser from '../../mobx-data/mobxUser';
import environmentApi from '../../mobx-data/mobxEnvironment';

const {action:{environmentAction}, store:{environmentStore}} = environmentApi;
const {store: {userStore}, action: {userAction}} = mobxUser;
const {store:{iterationStore,productLineStore,customerStore}, action: {iterationAction,productLineAction,customerAction}} = mobx;
const FormItem = Form.Item;
const Option = Select.Option;



@Form.create()
@observer
class CreateEnvironmentForm extends React.Component{
  constructor(props){
    super(props);


    this.state ={
      configName: undefined,
      configType: undefined,
      dbName: undefined,
      cName: undefined,
      userName: undefined,
      password: undefined,
      ip: undefined,
      port: undefined,
      connUrl: undefined,
      remark: undefined,
    };
  }


  onCancel = () =>{
    history.push('/dashboard/interface/environment');
  }




  // componentWillMount() {
  //   productLineAction.getAllProductLine();
  //   userAction.getAllActiveUsers();
  //   iterationAction.getAllBusiness();
  //   customerAction.getAllCustomers();
  // }
  // componentDidMount(){
  //      iterationAction.getAllBusiness();
  //      this.setState({
  //        member: iterationStore.iterationDetail ? this.getTestMemberNames(iterationStore.iterationDetail.testMems):'',
  //      });
  // }



  saveConfig = () => {
    // console.log(this.state.configName);
    const {form} = this.props;
    form.validateFields(async(err,values)=>{
      if (!err){
        const data=this.state;
        environmentAction.addEvnConfig(data).then((flag)=>{
          if(flag){
          }
        });
      }
    });

  }

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
      <div className="create-environment">
        <Form>
          <Row align="center">
            <Col span={8}>
              <FormItem
                {...formItemLayout}
                label="配置名称"
              >
                {getFieldDecorator('configName', {
                  rules:[{
                    required: true,
                    message: '请输入配置名称',
                  },]
                })(<Input onChange={(e) => { this.setState({configName: e.target.value}); }}/>)}
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem
                {...formItemLayout}
                label="配置类型">
                {
                  getFieldDecorator('configType',{
                    rules:[{required:true,message:'请选择产品线'}]
                  })(
                    <Select onChange={(val) => { this.setState({configType: val}); }}
                      showSearch
                      placehoder="选择配置类型"
                      allowClear
                    >
                      <Select.OptGroup >
                        <Option value="database">database</Option>
                        <Option value="service">service</Option>
                      </Select.OptGroup>
                    </Select>)
                }
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem
                {...formItemLayout}
                label="数据库名"
              >
                {getFieldDecorator('dbName', {
                  rules:[{
                    required: true,
                    message: '请输入数据库名称',
                  },]
                })(<Input onChange={(e) => { this.setState({dbName: e.target.value}); }}/>)}
              </FormItem>
            </Col>
          </Row>
          <Row align="center">
            <Col span={8}>
              <FormItem
                {...formItemLayout}
                label="数据库中文名"
              >
                {getFieldDecorator('cName', {
                  rules:[{
                    required: true,
                    message: '请输入数据库中文名称',
                  },]
                })(<Input onChange={(e) => { this.setState({cName: e.target.value}); }}/>)}
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem
                {...formItemLayout}
                label="用户名"
              >
                {getFieldDecorator('userName', {
                  rules:[{
                    required: true,
                    message: '请输入用户名',
                  },]
                })(<Input onChange={(e) => { this.setState({userName: e.target.value}); }}/>)}
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem
                {...formItemLayout}
                label="密码"
              >
                {getFieldDecorator('password', {
                  rules:[{
                    required: true,
                    message: '请输入密码',
                  },]
                })(<Input onChange={(e) => { this.setState({password: e.target.value}); }}/>)}

              </FormItem>
            </Col>
          </Row>
          <Row align="center">
            <Col span={8}>
              <FormItem
                {...formItemLayout}
                label="ip地址"
              >
                {getFieldDecorator('ip', {
                  rules:[{
                    required: true,
                    message: '请输入ip地址',
                  },]
                })(<Input onChange={(e) => { this.setState({ip: e.target.value}); }}/>)}

              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem
                {...formItemLayout}
                label="端口"
              >
                {getFieldDecorator('port', {
                  rules:[{
                    required: true,
                    message: '请输入数据库中文名称',
                  },]
                })(<Input onChange={(e) => { this.setState({port: e.target.value}); }}/>)}

              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem
                {...formItemLayout}
                label="备注"
              >
                {getFieldDecorator('remark', {
                  rules:[{
                    required: false,
                    message: '',
                  },]
                })(<Input onChange={(e) => { this.setState({remark: e.target.value}); }}/>)}

              </FormItem>
            </Col>
          </Row>

          <Row className='actions' >

            <Button type="primary" onClick={this.saveConfig}>保存</Button>
            <Divider type="vertical"/>
            <Button type="primary" onClick={this.onCancel}>返回</Button>


          </Row>
        </Form>
      </div>
    );
  }
}

export default CreateEnvironmentForm;
