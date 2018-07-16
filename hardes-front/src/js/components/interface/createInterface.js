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
import mobxInterface from "../../mobx-data/mobxInterface";

const {action:{environmentAction}, store:{environmentStore}} = environmentApi;
const {store: {userStore}, action: {userAction}} = mobxUser;
const {store:{iterationStore,productLineStore,customerStore}, action: {iterationAction,productLineAction,customerAction}} = mobx;
const FormItem = Form.Item;
const Option = Select.Option;
const {store: {interfaceStore}, action: {interfaceAction}} = mobxInterface;


@Form.create()
@observer
class CreateInterfaceForm extends React.Component{
  constructor(props){
    super(props);


    this.state ={
      editingkey: '',
      data: [],
      loading: false,
      pagination: {
        pageNum: 1,
        pageSize: 10,
      },
      serviceData:[],
      interfaceName: undefined,
      serviceId: undefined,
      version: 1.0,
    };
  }


  onCancel = () =>{
    history.push('/dashboard/interface/interfaceInfo');
  }


  fetchData = async (data) => {
    this.setState({
      loading: true
    });
    const pagination = {...this.state.pagination};
    await interfaceAction.getSystemList(data).then((res)=>{
      if(res){
        pagination.total = res.total;
        this.setState({
          loading: false,
          data: res.systems,
          pagination
        });
      }
    });
  }
  //查询应用信息列表
  getServiceList=()=>{
    let options=[];
    if(this.state.serviceData){
      this.state.serviceData.map((item)=>{
        options.push(
          <Option value={item.id} key={item.id}>
            {item.serviceName}
          </Option>
        );
      });
    }
    return options;
  }
  //查询系统信息列表
  getSystemLists=()=>{
    let options=[];
    if(this.state.data){
      this.state.data.map((item)=>{
        options.push(
          <Option value={item.id} key={item.id}>
            {item.systemName}
          </Option>
        );
      });
    }

    return options;
  }

  onSelect = (value) =>{
    console.log(value);
    this.setState({
      loading: true
    });
    interfaceAction.getServiceList(value).then((res)=>{
      if(res){
        this.setState({
          loading: false,
          serviceData: res.services,

        });
      }
    });

  };
  saveConfig = () => {
    // console.log(this.state.configName);
    const {form} = this.props;
    form.validateFields(async(err,values)=>{
      console.log(values);
      if (err){
        console.log(err);
        return;
      }
      else {
        if(this.state.serviceId){
          const request={
            serviceId:this.state.serviceId,
            interfaceName:this.state.interfaceName,
          };
          interfaceAction.addInterfaceInfo(request).then((flag)=>{
            if(flag){
              history.push('/dashboard/interface/interfaceInfo');
            }
          });
        }
      }
    });

  }
  componentDidMount() {
    this.fetchData(this.state.pagination);


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
        <Form
          className="interface-create-form"
          layout="horizontal">
          <Row align="center">
            <Col  span={12}>
              <FormItem
                label="系统"
                {...formItemLayout}
              >
                {getFieldDecorator('productLineId',{
                  rules:[{
                    required: true,
                    message: '请选择系统',
                  },]})(<Select
                  onSelect = {this.onSelect}
                  showSearch
                  placehoder="选择系统"
                  allowClear
                  filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                >
                  {
                    this.getSystemLists()
                  }
                </Select>)}
              </FormItem>
            </Col>
            <Col  span={12}>
              <FormItem
                label="应用"
                {...formItemLayout}
              >
                {getFieldDecorator('serviceId',{
                  rules:[{
                    required: true,
                    message: '请选择应用',
                  },]})(<Select onChange={(val) => { this.setState({serviceId: val}); }}
                  placehoder="选择应用"
                  showSearch
                  allowClear
                  filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                >
                  {
                    this.getServiceList()
                  }
                </Select>)}
              </FormItem>
            </Col>


          </Row>
          <Row
            align="center"
          >
            <Col  span={12}>
              <FormItem
                label="版本"
                {...formItemLayout}
              >
                {getFieldDecorator('version',{
                  initialValue: 1.0,
                })(
                  <Input  disabled/>)}
              </FormItem>
            </Col>
            <Col  span={12}>
              <FormItem
                {...formItemLayout}
                label="接口名称"
              >
                {getFieldDecorator('interfaceName', {
                  rules:[{
                    required: true,
                    message: '请输入接口名称',
                  },]
                })(<Input onChange={(e) => { this.setState({interfaceName: e.target.value}); }}/>)}
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

export default CreateInterfaceForm;
