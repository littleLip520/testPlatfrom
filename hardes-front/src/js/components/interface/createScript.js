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
import scriptApi from "../../mobx-data/mobxScript";

const {action:{environmentAction}, store:{environmentStore}} = environmentApi;

const FormItem = Form.Item;
const Option = Select.Option;
const {store: {interfaceStore}, action: {interfaceAction}} = mobxInterface;
const {action:{scriptAction}, store:{scriptStore}} = scriptApi;

@Form.create()
@observer
class CreateScriptForm extends React.Component{
  constructor(props){
    super(props);


    this.state ={
      scriptId:null,
      interfaceName: undefined,
      serviceId: undefined,
      data:[],
      serviceData:[],
      scriptData:[],
      version: 1.0,
      pagination: {
        pageNum: 1,
        pageSize: 10,
      },
    };
  }


  onCancel = () =>{
    history.push('/dashboard/interface/scriptList');
  }
  //跳转到编辑页面
  toEditPage = (id) =>{
    history.push(`/dashboard/interface/updateScript/${id}`);
  }

  //获取系统列表数据
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

  //筛选应用信息选项
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



  //获取脚本列表
  getIterfaceItem = (value) =>{
    console.log(value)
    this.setState({
      loading: true
    });
    scriptAction.getScriptListByServiceId(value).then((res)=>{
      if(res){
        console.log(res)
        this.setState({
          loading: false,
          scriptData: res,
        });
      }
    });

  };
  //获取应用列表
  getServiceItem = (value) =>{
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

  //查询接口信息列表
  getInterfaceList=()=>{
    let options=[];
    if(this.state.scriptData){
      this.state.scriptData.map((item)=>{
        options.push(
          <Option value={item.id} key={item.id}>
            {item.interfaceName}
          </Option>
        );
      });
    }
    return options;
  }


  saveConfig = () => {

    const {form} = this.props;
    form.validateFields(async(err,values)=>{
      if (!err){
        const data={
          interfaceInfoId:values.interfaceInfoId,
          interfaceName:values.interfaceName
        }
        scriptAction.addScript(data).then((flag)=>{
          if(flag){
            history.push('/dashboard/interface/scriptList');
          }
        });
      }
    });

  }
  componentDidMount(){
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
                {getFieldDecorator('systemId',{
                  rules:[{
                    required: true,
                    message: '请选择系统',
                  },]})(<Select
                  onSelect = {this.getServiceItem}
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
                  },]})(<Select
                  // onChange={(val) => { this.setState({serviceId: val}); }}
                  onSelect={this.getIterfaceItem}
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
                  <Input defaultValue={1.0} disabled/>)}
              </FormItem>
            </Col>
            <Col  span={12}>
              <FormItem
                {...formItemLayout}
                label="接口名称"
              >
                {getFieldDecorator('interfaceInfoId', {
                  rules:[{
                    required: true,
                    message: '请选择接口',
                  },]
                })(<Select onChange={(val) => { this.setState({serviceId: val}); }}
                           placehoder="选择接口"
                           showSearch
                           allowClear
                           filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                >
                  {
                    this.getInterfaceList()
                  }
                </Select>)}
              </FormItem>
            </Col>

          </Row>
          <Row>
            <Col  span={12}>
              <FormItem
                {...formItemLayout}
                label="脚本名称"
              >
                {getFieldDecorator('interfaceName', {
                  rules:[{
                    required: true,
                    message: '请输入接口名称',
                  },]
                })(<Input onChange={(e) => { this.setState({scriptName: e.target.value}); }}/>)}
              </FormItem>
            </Col>
          </Row>

          <Row className='actions' >

            <Button type="primary" onClick={this.saveConfig}>保存</Button>
            <Divider type="vertical"/>
            <Button type="primary" onClick={()=>this.toEditPage(this.state.scriptId)} disabled >下一步</Button>
            <Divider type="vertical"/>
            <Button type="primary" onClick={this.onCancel}>返回</Button>


          </Row>
        </Form>
      </div>
    );
  }
}

export default CreateScriptForm;
