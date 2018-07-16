import React from 'react';
import { Table, Divider, Form, Row, Input, Select,Button,Col,Popconfirm } from 'antd';
import { observer } from 'mobx-react';

import '../../../less/manage/baseSetting.less';
import { toJS } from 'mobx/lib/mobx';
import mobxScript from '../../mobx-data/mobxScript';
import history from '../../utils/history';


const FormItem = Form.Item;
const Option = Select.Option;
const EditableContext = React.createContext();

const EditableRow = ({ form, index, ...props }) => (
  <EditableContext.Provider value={form}>
    <tr {...props} />
  </EditableContext.Provider>
);
const {store: {scriptStore}, action: {scriptAction}} = mobxScript;
const EditableFormRow = Form.create()(EditableRow);
const { TextArea } = Input


@observer
@Form.create()
class ScriptEdit extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      editingkey: '',
      inputName: '',
      pageRequest: {
        pageNum: 1,
        pageSize: 10,
        current: 1,
      },
      confirmLoading: false,
      options:[],
      data:[],
      loading: false,
      scriptId:null,
      interfaceInfoName:null,
    };


  }
  columns = [

    {
      title: '类型',
      dataIndex: 'systemName',
      key: 'systemName',
      align: 'center'
    },
    {
      title: '变量',
      dataIndex: 'serviceName',
      key: 'serviceName',
      align: 'center'
    },
    {
      title: '值',
      dataIndex: 'version',
      key: 'version',
      align: 'center'
    },
    {
      title: '操作',
      render: (text, record) => {
        const editable = this.isEditing(record);
        return(
          <div className="editable-row-operations">{
            editable ? (
              <span>
                  <EditableContext.Consumer>
                    {
                      form => (
                        <a
                          onClick={ () => this.save(form, record.id)}>
                          保存
                        </a>
                      )
                    }
                  </EditableContext.Consumer>
                  <Divider type="vertical"/>
                  <Popconfirm
                    title="确认取消?"
                    onConfirm={()=>this.cancel()}
                  >
                    <a>取消</a>
                  </Popconfirm>
                </span>
            ) : (
              <span>
                  <a onClick={()=>this.edit(record.id)}>编辑</a>
                  <Divider type="vertical"/>
                   <Popconfirm
                     title="确认删除？"
                     // onConfirm={() => this.deleteConfig(record.id)}
                   >
                      <a>删除</a>
                    </Popconfirm>
                </span>
            )
          }</div>
        );
      },
      align: 'center'
    },
  ];
  onCancel = () =>{
    history.push('/dashboard/interface/scriptList');
  }

  componentDidMount(){
    const id = {
      id:this.props.id
    }

    scriptAction.getInfoNameByScriptId(id).then((res)=>{
      if(res){

        this.setState({
            interfaceInfoName:res.data.interfaceName
          }
        );

      }
    });
  }
  render(){
    console.log(this.state.interfaceInfoName);
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

          <Row
          >
            <Col  span={8}>
              <FormItem
                {...formItemLayout}
                label="接口名称"
              >
                {getFieldDecorator('interfaceName', {
                  initialValue: this.state.interfaceInfoName ? this.state.interfaceInfoName :null
                })(<Input disabled />)}
              </FormItem>
            </Col>
            <Col  span={8}>
              <FormItem
                {...formItemLayout}
                label="接口类型"
              >
                {getFieldDecorator('scriptType', {
                  rules:[{
                    required: true,
                    message: '请选择接口类型',
                  },]
                })(<Select
                           placehoder="选择接口类型"
                           showSearch
                           allowClear
                           // filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                >
                  <Option value={0} key={0} >HTTP</Option>
                </Select>)}
              </FormItem>
            </Col>
            <Col  span={8}>
              <FormItem
                {...formItemLayout}
                label="请求方式"
              >
                {getFieldDecorator('scriptMode', {
                  rules:[{
                    required: true,
                    message: '请选择请求方式',
                  },]
                })
                (<Select onChange={(val) => { this.setState({serviceId: val}); }}
                           placehoder="选择接口类型"
                           showSearch
                           allowClear
                           filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                >
                  <Option value={0} key={0}>GET</Option>
                  <Option value={1} key={1}>POST</Option>
                </Select>)
                }
              </FormItem>
            </Col>
          </Row>
          <Row
               // justify="space-between"
               // gutter={24}
               // className="action-btn"
            align="center"
            type="flex"
            justify="center"
          >

            <Col span={6}>

            <label style={{'marginLeft':'1px'}}>请求报文</label>

            </Col>
            <Col span={24}>

              <FormItem
                className="iteration-query-form"
              >
                {getFieldDecorator('request', {
                  rules:[{

                    required: true,
                    message: '请输入请求报文',
                  },]
                })
                (<TextArea style={{'marginTop':'auto','minHeight':'200px'}}
                  defaultValue={'请输入请求报文'}/>)}

              </FormItem>
            </Col>
          </Row>
          <Row className='actions' >
            <Button type="primary" >添加变量</Button>

          </Row>

        </Form>
        <Table
          className="iteration-table"
          columns={this.columns}
          rowKey={record => record.id}
          dataSource={toJS(scriptStore.variableList)}
          pagination={this.state.pageRequest}
          // loading={scriptStore.editLoading}
          onChange={this.handleTableChange}
        >
        </Table>
        <Button style={{'marginTop':'10px'}} type="primary" onClick={this.saveConfig}>保存</Button>
        <Divider type="vertical"/>
        <Button style={{'marginTop':'10px'}} type="primary" onClick={this.onCancel}>返回</Button>
      </div>
    );
  }

}
export default ScriptEdit;
