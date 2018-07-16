import React from 'react';
import { Table, Divider, Form, Row, Input, Select,Button,Col } from 'antd';
import { observer } from 'mobx-react';

import '../../../less/manage/baseSetting.less';
import mobxEnvironment from '../../mobx-data/mobxEnvironment';


const FormItem = Form.Item;
const Option = Select.Option;
const EditableContext = React.createContext();
const EditableRow = ({ form, index, ...props }) => (
  <EditableContext.Provider value={form}>
    <tr {...props} />
  </EditableContext.Provider>
);
const {store: {environmentStore}, action: {environmentAction}} = mobxEnvironment;
const EditableFormRow = Form.create()(EditableRow);



@observer
@Form.create()
class ScriptEnv extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      editingkey: '',
      inputName: '',
      pagination:{
        pageSize:10,
        pageNum: 1,
      },
      confirmLoading: false,
      options:[],
      data:[],
      loading: false,
    };


  }
  getServiceItem =  async(id) =>{
    console.log(id)
    const {form}= this.props;
    this.setState({
      loading: true
    });
    this.state.data.map((item)=>{
      if(item.id===id){
        form.setFieldsValue({'configType':item.configType});
        form.setFieldsValue({'ip':item.ip});
      }
    });

  };

  //获取环境列表
  getEnvlist=()=>{
    let options=[];
    if(this.state.data){
      this.state.data.map((item)=>{
        options.push(
          <Option value={item.id} key={item.id}>
            {item.configName}
          </Option>
        );
      });
    }
    return options;
  }

  //获取系统列表数据
  fetchData = async () => {
    await environmentAction.listAll().then((res)=>{
      if(res){
        this.setState({
          data: res,
        });
      }
    });
  }

  componentDidMount(){
    environmentAction.listAll().then((res)=>{
      if(res){
        console.log(res);
        this.setState({
          data: res,

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
        <Form
          className="interface-create-form"
          layout="horizontal">
          <Row align="center">
            <Col  span={18}>
              <FormItem
                label="选择环境配置"
                {...formItemLayout}
              >
                {getFieldDecorator('EnvConfigId',{
                  rules:[{
                    required: true,
                    message: '请选择环境配置',
                  },]})(<Select
                  onSelect = {this.getServiceItem}
                  showSearch
                  placehoder="选择系统"
                  allowClear
                  filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                >
                  {
                    this.getEnvlist()
                  }
                </Select>)}
              </FormItem>
            </Col>
          </Row>
          <Row align="center">
            <Col  span={18}>
              <FormItem
                label="配置类型"
                {...formItemLayout}
              >
                {getFieldDecorator('configType',{
                  rules:[{
                    required: true,
                    message: '请选择配置类型',
                  },]})(<Input  disabled/>)}
              </FormItem>
            </Col>
          </Row>
          <Row
            align="center"
          >
            <Col  span={18}>
              <FormItem
                label="IP"
                {...formItemLayout}
              >
                {getFieldDecorator('ip')(
                  <Input  disabled/>)}
              </FormItem>
            </Col>

          </Row>
          <Row>
            <Button type="primary" onClick={this.saveConfig}>保存</Button>
            <Divider type="vertical"/>
            <Button type="primary" onClick={this.onCancel}>返回</Button>
          </Row>

        </Form>
      </div>
    );
  }
}
export default ScriptEnv;
