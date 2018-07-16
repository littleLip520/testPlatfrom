import React from 'react';
import { Table, Divider, Form, Popconfirm, Input, Select,Button,Row,Col,Icon,Modal } from 'antd';
import { observer } from 'mobx-react';
import mobx from '../../mobx-data/mobxUser';
import '../../../less/manage/baseSetting.less';
import mobxScript from '../../mobx-data/mobxScript';
import history from '../../utils/history';
import { toJS } from 'mobx/lib/mobx';
import mobxInterface from '../../mobx-data/mobxInterface';
import moment from 'moment';

const {action:{scriptAction}, store:{scriptStore}} = mobxScript;
const FormItem = Form.Item;
const Option = Select.Option;
const EditableContext = React.createContext();
const {store: {interfaceStore}, action: {interfaceAction}} = mobxInterface;
const EditableRow = ({ form, index, ...props }) => (
  <EditableContext.Provider value={form}>
    <tr {...props} />
  </EditableContext.Provider>
);

const EditableFormRow = Form.create()(EditableRow);

@observer
class EditableCell extends React.Component{


  render(){
    const {
      editing,
      dataIndex,
      title,
      record,
      ...restProps
    } = this.props;
    return(
      <EditableContext.Consumer>
        {
          (form) => {
            const {getFieldDecorator} = form;
            return(
              <td {...restProps}>
                {editing ? (
                  <FormItem>
                    {
                      getFieldDecorator(dataIndex,{
                        initialValue: record[dataIndex],
                      })
                    }
                  </FormItem>
                ) : (
                  restProps.children
                )
                }
              </td>
            );
          }
        }
      </EditableContext.Consumer>
    );
  }
}
@Form.create()
@observer
class BaseScript extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      editingkey: '',
      inputName: '',
      infoId:null,
      interfaceCasePageRequest:{
        interfaceInfoId:null,
        pageRequest:{
          pageSize:10,
          pageNum:1
        }
      },
      pagination: {
        pageNum: 1,
        pageSize: 10,
      },
      request:{
        pageRequest: {
          pageNum: 1,
          pageSize: 10,
        },
        serviceId:null,
      },
      confirmLoading: false,
      data:[],
      serviceData:[],
      scriptData:[],
      showModal: false,
      loading: false,
    };

    this.columns = [
      {
        title: '系统名称',
        dataIndex: 'systemName',
        key: 'systemName',
        align: 'center',
        editable: false
      },
      {
        title: '服务名称',
        dataIndex: 'serviceName',
        key: 'serviceName',
        align: 'center',
        editable: false
      },
      {
        title: '版本',
        dataIndex: 'version',
        key: 'version',
        align: 'center',
        editable: false
      },
      {
        title: '接口名称',
        dataIndex: 'interfaceInfoName',
        key: 'interfaceInfoName',
        align: 'center',
        editable: false
      },
      {
        title: '脚本名称',
        dataIndex: 'scriptName',
        key: 'scriptName',
        align: 'center',
        editable: true
      },
      {
        title: '创建人',
        dataIndex: 'createBy',
        key: 'createBy',
        align: 'center',
        editable: true
      },
      {
        title: '创建日期',
        dataIndex: 'createTime',
        key: 'createTime',
        align: 'center',
        editable: true,
        render: (creater,record) => moment(record.createTime).format('YYYY-MM-DD')
      },
      {
        title: '操作',
        dataIndex: 'op',
        align: 'center',
        render: (text, record) => {
          const editable = this.isEditing(record);
          return(
            <div className="editable-row-operations">{
              editable ? (
                <span>
                  <Popconfirm
                    title="确认取消?"
                    onConfirm={()=>this.cancel()}
                  >
                    <a>取消</a>
                  </Popconfirm>
                </span>
              ) : (

                <span>
                  <span
                    onClick={this.runScript}
                  >
                    <Icon type="play-circle" style={{ fontSize: 16, color: '#08c' }}  />
                  </span>
                   <Divider type="vertical"/>
                  <a
                    onClick={() => {history.push(`/dashboard/interface/updateScript/${record.id}`);}}
                  >编辑</a>
                  <Divider type="vertical"/>
                   <Popconfirm
                     title="确认删除？"
                     onConfirm={() => this.deleteScript(record.id)}
                   >

                      <a>删除</a>
                    </Popconfirm>
                </span>
              )
            }</div>
          );
        }
      }
    ];
  }


  runScript = () => {
    this.setState({
      showModal: true
    });
  };
  onModelCancel = () => {
    this.setState({
      showModal: false,
    });
  };
  isEditing = (record) => {
    return record.id === this.state.editingkey;
  };
  edit = (key) => {

    // console.log('>>'+key);
    this.setState({
      editingkey: key,
    });
  };
  //删除脚本

  deleteScript=(id)=>{
    console.log('调用删除方法');
    const configId={
      id:id
    }
    scriptAction.deleteScript(configId).then((flag)=>{
      if(flag){
        const pageInfo={
          interfaceInfoId:this.state.infoId,
          pageRequest:{
            pageSize:10,
            pageNum:1
          }
        };
        scriptAction.getScriptList(pageInfo);
      }

    });
  }

  cancel = () => {
    this.setState({ editingkey: '' });
  };
  handleTableChange = async (pagination) => {
    const pager = {...pagination};
    pager.pageNum = pagination.current;
    this.setState({
      pagination: pager
    });
    this.fetchData(pager);
  };
  handleSubmit = async(e) =>{
    e.preventDefault();
    this.props.form.validateFields(async (err,values)=>{
      const pageRequest = this.state.interfaceCasePageRequest;
      const request = {
        ...pageRequest,
        interfaceInfoId: values.interfaceInfoId
      };
      await scriptAction.getScriptList(request).then((res)=>{
        if(res){
          this.state.infoId=values.interfaceInfoId;
        }
      })
      request.pageRequest.total =interfaceStore.total;
      this.setState({
        request
      });
    });
  };
  //获取应用选项
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

  //获取接口选项
  getIterfaceItem = (value) =>{
    this.setState({
      loading: true
    });
    scriptAction.getScriptListByServiceId(value).then((res)=>{
      if(res){
        this.setState({
          loading: false,
          scriptData: res,

        });
      }
    });

  };
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

  handleReset = () => {
    const pageRequest = this.state.interfaceCasePageRequest.pageRequest;
    const request = {
      pageRequest,
    };
    this.setState({
      request,
    });
    this.props.form.resetFields();

  };
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

  componentDidMount(){
    this.fetchData(this.state.pagination);

    scriptAction.getScriptList(this.state.interfaceCasePageRequest);
  }
  render(){
    // console.log(scriptStore);
    const components = {
      body: {
        row: EditableFormRow,
        cell: EditableCell,
      },
    };
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

    const columns = this.columns.map((col) => {
      if (!col.editable){
        return col;
      }
      return {

        ...col,
        onCell: record => ({

          record,
          dataIndex: col.dataIndex,
          title: col.title,
          editing: this.isEditing(record),
          inputtype: col.dataIndex === 'roleId' ? 'select' : 'input',
        }),
      };
    });
    return(
      <div className="iteration-container">
        <Form
          className="iteration-query-form"
          layout="horizontal"
        >
          <Row gutter={24}>
            <Col className="query-col" span={6}>
              <FormItem
                label="系统"
                {...formItemLayout}
              >
                {getFieldDecorator('systemId')(<Select
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
            <Col className="query-col" span={6}>
              <FormItem
                label="应用"
                {...formItemLayout}
              >
                {getFieldDecorator('serviceId')(<Select
                  onSelect = {this.getIterfaceItem}
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
            <Col className="query-col" span={6}>
              <FormItem
                label="版本"
                {...formItemLayout}
              >
                {getFieldDecorator('version',{
                  initialValue: 1.0,
                })(
                  <Input disabled/>)}
              </FormItem>
            </Col>
            <Col className="query-col" span={6}>
              <FormItem
                label="接口"
                {...formItemLayout}
              >
                {getFieldDecorator('interfaceInfoId')(<Select
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
          <Row align="middle"
               justify="space-between"
               gutter={24}
               className="action-btn"
          >
            <Col span={6} >
              <Button type="primary" onClick={()=>{history.push('/dashboard/interface/createScript');}}>新增脚本</Button>
            </Col>
            <Col span={18} className="op-btn" >
              <Button icon="search" htmlType="submit" onClick={this.handleSubmit}>查询</Button>
              <Divider type="vertical"/>
              <Button className="close-btn" icon="close" onClick={this.handleReset}>清除</Button>
            </Col>
          </Row>
        </Form>
        <Modal visible={this.state.showModal}
               closable={true}
               onCancel={this.onModelCancel}
               destroyOnClose={true}
               footer={<span className="popup-btns">
               </span>}

        >
          <Row>
            <Col span={12}>
              <label > 功能开发中</label>
            </Col>
          </Row>
        </Modal>
        <Table
          dataSource={toJS(scriptStore.scriptList)}
          columns={columns}
          onChange={this.handleTableChange}
          pagination={this.state.interfaceCasePageRequest}
          components={components}
          loading={this.state.loading}
        />
      </div>
    );
  }

}
export default BaseScript;
