import React from 'react';
import { Col, Form, Input, Row, Select, Table, Button, Divider, message, Modal, Popconfirm, DatePicker } from 'antd';
import { observer } from 'mobx-react';
import {toJS} from 'mobx';
import {withRouter} from 'react-router-dom';
import '../../../less/iteration/iteration.less';
import history from '../../utils/history';
import mobx from '../../mobx-data/';
import mobxInterface from '../../mobx-data/mobxInterface';

const {store: {interfaceStore}, action: {interfaceAction}} = mobxInterface;
const {store:{iterationStore,productLineStore}, action: {iterationAction,productLineAction}} = mobx;
const Option = Select.Option;
const FormItem = Form.Item;
const EditableContext = React.createContext();
const EditableRow = ({ form, index, ...props }) => (
  <EditableContext.Provider value={form}>
    <tr {...props} />
  </EditableContext.Provider>
);

@observer
@Form.create()
class InterfaceInfoList extends React.Component {
  state = {
    editingkey: '',
    data: [],
    serviceData:[],
    pagination: {
      pageNum: 1,
      pageSize: 10,
    },
    loading: false,
    visible: false,
    request:{
      pageRequest: {
        pageNum: 1,
        pageSize: 10,
      },
      serviceId:null,
    },
  };

  columns = [
    {
      title: '接口名称',
      dataIndex: 'interfaceName',
      key: 'interfaceName',
      align: 'center',
      editable: true

    },
    {
      title: '系统',
      dataIndex: 'systemName',
      key: 'systemName',
      align: 'center'
    },
    {
      title: '应用',
      dataIndex: 'serviceName',
      key: 'serviceName',
      align: 'center'
    },
    {
      title: '版本',
      dataIndex: 'version',
      key: 'version',
      align: 'center'
    },
    {
      title: '创建者',
      dataIndex: 'creator',
      key: 'creator',
      align: 'center'
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      key: 'createTime',
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
                  {/*<a onClick={()=>this.edit(record.id)}>编辑</a>*/}
                  {/*<Divider type="vertical"/>*/}
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
  edit = (key) => {
    console.log('>>'+key);
    this.setState({
      editingkey: key,
    });
  };
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

//   deleteConfig=(id)=>{
//     interfaceAction.getServiceList()
// }
  //保存单条记录
  save = (form, key) => {
    form.validateFields((error, row) => {
      if (error) {
        return ;
      }

      const newData = [...this.state.data];
      const index = newData.findIndex(item => key === item.id);
      if (index > -1){
        newData[index] = {
          ... newData[index],
          ... row,
        };
        interfaceAction.updateInterfaceInfo(newData[index]).then((flag) => {
          if(flag){
            const item = newData[index];
            newData.splice(index,1,{
              ...item,
              ...row
            });
            console.log(newData);
            this.setState({
              data: newData,
              editingkey: ''
            });
          }
        });

      } else {
        newData.push(this.state.data);
        this.setState({ data: newData, editingKey: '' });
      }
    });

  };

  cancel = () => {
    this.setState({ editingkey: '' });
  };

  handleTableChange = (pagination, filters, sorter) => {
    const pager = { ...pagination };
    pager.pageNum = pagination.current;
    pager.current = pagination.current;
    const request = this.state.request;
    request.pagination = pager;

    this.setState({
      pagination: pager,
      request
    });
  };

  isEditing = (record) => {
    console.log(record);
    return record.id === this.state.editingkey;
  };
  componentDidMount() {
    this.fetchData(this.state.pagination);
    // const pager = interfaceStore.pagination;
    const pager = this.state.request;

    interfaceAction.getInterfaceList(pager);
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
  handleReset = () => {
    const pageRequest = this.state.request.pageRequest;
    const request = {
      pageRequest,
    };
    this.setState({
      request,
    });
    this.props.form.resetFields();

  };

  handleSubmit = async(e) =>{
    e.preventDefault();
    this.props.form.validateFields(async (err,values)=>{
      const pageRequest = this.state.request;
      const request = {
        ...values,
        pageRequest
      };
      await interfaceAction.getInterfaceList(request);
      request.pageRequest.total =interfaceStore.total;
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
      <div className="iteration-container">
        <Form
          className="iteration-query-form"
          layout="horizontal"
        >
          <Row gutter={24}>
            <Col className="query-col" span={8}>
              <FormItem
                label="系统"
                {...formItemLayout}
              >
                {getFieldDecorator('productLineId')(<Select

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
            <Col className="query-col" span={8}>
              <FormItem
                label="应用"
                {...formItemLayout}
              >
                {getFieldDecorator('serviceId')(<Select
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
            <Col className="query-col" span={8}>
              <FormItem

                label="版本"
                {...formItemLayout}
              >
                {getFieldDecorator('iterationName',{
                  initialValue: 1.0,
                  }
                )(
                  <Input  disabled/>)}
              </FormItem>
            </Col>

          </Row>
          <Row align="middle"
               justify="space-between"
               gutter={24}
               className="action-btn"
          >
            <Col span={6} >
              <Button type="primary" onClick={()=>{history.push('/dashboard/interfaceMgmt/create');}}>新增接口</Button>
            </Col>
            <Col span={18} className="op-btn" >
              <Button icon="search" htmlType="submit" onClick={this.handleSubmit}>查询</Button>
              <Divider type="vertical"/>
              <Button className="close-btn" icon="close" onClick={this.handleReset}>清除</Button>
            </Col>
          </Row>
        </Form>
        <Table
          className="iteration-table"
          columns={this.columns}
          rowKey={record => record.id}
          dataSource={toJS(interfaceStore.interfaceInfoList)}
          pagination={this.state.pagination}
          loading={iterationStore.isLoading}
          onChange={this.handleTableChange}
        >
        </Table>

      </div>
    );
  }
}




export default InterfaceInfoList;

