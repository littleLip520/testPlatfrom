import React from 'react';
import { Table, Divider, Form, Row, Input, Select,Button,Col,Popconfirm } from 'antd';
import { observer } from 'mobx-react';

import '../../../less/manage/baseSetting.less';
import history from '../../utils/history';
import { toJS } from 'mobx/lib/mobx';


const FormItem = Form.Item;
const Option = Select.Option;
const EditableContext = React.createContext();
const EditableRow = ({ form, index, ...props }) => (
  <EditableContext.Provider value={form}>
    <tr {...props} />
  </EditableContext.Provider>
);

const EditableFormRow = Form.create()(EditableRow);



@observer
@Form.create()
class ScriptConfig extends React.Component{
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
    this.columns = [
      {
        title: '序号',
        dataIndex: 'systemName',
        key: 'systemName',
        align: 'center',
        editable: false
      },
      {
        title: '类型',
        dataIndex: 'serviceName',
        key: 'serviceName',
        align: 'center',
        editable: false
      },
      {
        title: '应用名称/数据库',
        dataIndex: 'version',
        key: 'version',
        align: 'center',
        editable: false
      },
      {
        title: '前/后置',
        dataIndex: 'interfaceInfoName',
        key: 'interfaceInfoName',
        align: 'center',
        editable: false
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

  componentDidMount(){
    //获取脚本ID
    const id = {
      id:this.props.id
    };

  }

  render(){
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
            <Col  span={8}>
              <FormItem
                label="配置类型"
                {...formItemLayout}
              >
                {getFieldDecorator('productLineId',{
                  rules:[{
                    required: true,
                    message: '请选择配置类型',
                  },]})(<Select
                  onSelect = {this.onSelect}
                  showSearch
                  placehoder="选择配置类型"
                  allowClear
                  filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                >
                  {/*<option>脚本配置</option>*/}
                  {/*<option>数据库查询</option>*/}
                  {/*<option>数据库修改</option>*/}

                </Select>)}
              </FormItem>
            </Col>


              <Button  type="primary"
              // onClick={() => {history.push(`/dashboard/interface/updateScript/${this.state.id}`);}}
              >添加</Button>



          </Row>


        </Form>
        <Table
          dataSource={toJS()}
          columns={columns}
          // onChange={this.handleTableChange}
          // pagination={this.state.interfaceCasePageRequest}
          // components={components}
          // loading={this.state.loading}
        />
      </div>
    );
  }
}
export default ScriptConfig;
