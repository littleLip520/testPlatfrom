import React from 'react';
import { Table, Divider, Form, Row, Input, Select,Button,Col,Popconfirm } from 'antd';
import { observer } from 'mobx-react';

import '../../../less/manage/baseSetting.less';
import { toJS } from 'mobx/lib/mobx';
import mobxScript from '../../mobx-data/mobxScript';


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



@observer
@Form.create()
class ScriptCheckPoint extends React.Component{
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
    };


  }

  columns = [
    {
      title: '被检查字段名',
      dataIndex: 'interfaceName',
      key: 'interfaceName',
      align: 'center',
      editable: true,

      render: (text, record, index) =>{
        return <a onClick={() => {
          this.setState({
            iteration:record,
            iterationVisible:true
          });
        }}>{text}</a>;
      }
    },
    {
      title: '类型',
      dataIndex: 'systemName',
      key: 'systemName',
      align: 'center'
    },
    {
      title: '预期结果',
      dataIndex: 'serviceName',
      key: 'serviceName',
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
        <Button type="primary" onClick={this.saveConfig}>保存</Button>
        <Divider type="vertical"/>
        <Button type="primary" onClick={this.onCancel}>返回</Button>
      </div>
    );
  }
}
export default ScriptCheckPoint;
