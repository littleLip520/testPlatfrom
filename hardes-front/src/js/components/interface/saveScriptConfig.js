import React from 'react';
import {Tabs ,Form,Table,Popconfirm,Divider,Col,Row,Input,Button,Modal} from 'antd';
import '../../../less/manage/baseSetting.less';
import ScriptEdit from './scriptEdit';
import ScriptEnv from './scriptEnv';
import ScriptConfig from './scriptConfig';
import ScriptCheckPoint from './scriptCheckPoint';
import history from '../../utils/history';
import { toJS } from 'mobx/lib/mobx';


const TabPane = Tabs.TabPane;
const FormItem = Form.Item;




class SaveScriptConfig extends React.Component{
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


  }
  render(){
    // console.log(scriptStore);
    // const components = {
    //   body: {
    //     row: EditableFormRow,
    //     cell: EditableCell,
    //   },
    // };
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

export default SaveScriptConfig;