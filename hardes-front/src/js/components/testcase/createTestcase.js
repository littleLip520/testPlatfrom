import React from 'react';
import { Button, Row, Form, Col, Select, Input, Divider} from 'antd';
import { Editor } from 'react-draft-wysiwyg';
import { EditorState, convertToRaw, ContentState, convertFromHTML} from 'draft-js';
import draftToHtml from 'draftjs-to-html';
import { observer } from 'mobx-react';
import _ from 'lodash';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import '../../../less/testcase/testcase.less';
import history from '../../utils/history';
import mobxProduct from '../../mobx-data/mobxProduct';
import mobxTest from '../../mobx-data/mobxTest';
import mobx from '../../mobx-data';

const {action:{productAction}, store:{productStore}} = mobxProduct;
const {action:{testAction}, store:{testStore}} = mobxTest;
const {action:{productVersionAction}, store:{productVersionStore}} = mobx;
const FormItem = Form.Item;
const Option = Select.Option;
const template = '<ul><li><strong>前置条件</strong></li></ul><p>1.</p><ul><li><strong>测试步骤</strong></li></ul><p>1.</p><ul><li><strong>预期结果</strong></li></ul><p>1.</p>';
@Form.create()
@observer
class CreateTestCase extends React.Component{
  state = {
    productTypes:null,
    editorState: EditorState.createWithContent(
      ContentState.createFromBlockArray(
        convertFromHTML(template)
      )
    ),
    productNameIdDisabled:true,
    featureTypeIdDisabled:true,
    featureUnitIdDisabled:true,
  };

  componentDidMount(){
    productAction.getAllProductType().then((res) => {
      if (res) {
        this.setState({
          productTypes: res,
        });
      }
    });
    testAction.getTestcaseList(testStore.request);
    productVersionAction.getAllProductVersions();
  }
  getProductTypeOptions = () =>{
    let options = [];
    if (this.state.productTypes) {
      _.each(this.state.productTypes, (item)=>{
        options.push(
          <Option value={item.id} key={item.id}>
            {item.productTypeName}
          </Option>
        );
      });
    }
    return options;
  };
  getProductNameOptions = () =>{
    let options = [];

    if (productStore.productName) {
      _.each(productStore.productName,(item)=>{
        options.push(
          <Option value={item.id} key={item.id}>
            {item.productName}
          </Option>
        );
      });
    }
    return options;
  };

  getFeatureOptions =()=>{
    let options = [];

    if (productStore.featureList) {
      _.each(productStore.featureList,(item)=>{
        options.push(
          <Option value={item.id} key={item.id}>
            {item.featureType}
          </Option>
        );
      });
    }
    return options;
  };

  getUnitOptions =()=>{
    let options = [];
    if (productStore.unitList) {
      _.each(productStore.unitList,(item)=>{
        options.push(
          <Option value={item.id} key={item.id}>
            {item.feature}
          </Option>
        );
      });
    }
    return options;
  };

  getProductVersionOptions = () => {
    let options = [];
    if (productVersionStore.allProductVersions) {
      _.each(productVersionStore.allProductVersions, (item) => {
        options.push(
          <Option value={item.id} key={item.id}>
            {item.version}
          </Option>
        );
      });
    }
    return options;
  };

  onProductTypeSelect = async(id) =>{
    const {form}= this.props;
    this.state.productNameIdDisabled=false;
    this.state.featureTypeIdDisabled=true;
    this.state.featureUnitIdDisabled=true;
    form.resetFields(["productNameId"]);
    form.resetFields(["featureTypeId"]);
    form.resetFields(["featureUnitId"]);
    await productAction.getProductNameListByTypeId(id);
  };
  onProductNameSelect = async(id) =>{
    const {form}= this.props;
    this.state.featureTypeIdDisabled=false;
    this.state.featureUnitIdDisabled=true;
    form.resetFields(["featureTypeId"]);
    form.resetFields(["featureUnitId"]);
    await productAction.getFeatureListByNameId(id);
  };
  onFeatureSelect = async(id)=>{
    const {form}= this.props;
    this.state.featureUnitIdDisabled=false;
    form.resetFields(["featureUnitId"]);
    await productAction.getUnitListByFeatureId(id);
  };

  onEditorStateChange = (editorState) => {
    this.setState({
      editorState,
    });
  };
  onSave = async (e)=> {
      e.preventDefault();
      this.props.form.validateFields(async(err,values)=>{
        if (err){
          return;
        }
        const request = {
          ...values,
          steps: JSON.stringify(this.state.editorState.getCurrentContent()),
          stepsHtml: draftToHtml(convertToRaw(this.state.editorState.getCurrentContent()))
        };
        await testAction.addTestcase(request).then((flag)=>{
          if (flag){
            history.push('/dashboard/testcase');
          }
        });
      });
  };
  onCancel=()=>{
    history.push('/dashboard/testcase');
  };
  onSaveAndContinue = (e) => {
    e.preventDefault();
    this.props.form.validateFields(async(err,values)=>{
      if (err){
        return;
      }
      const request = {
        ...values,
        steps: JSON.stringify(this.state.editorState.getCurrentContent()),
        stepsHtml: draftToHtml(convertToRaw(this.state.editorState.getCurrentContent()))
      };
      await testAction.addTestcase(request);
      //history.push('/dashboard/testcase');
    });
  };
   render(){
     const { getFieldDecorator } = this.props.form;
     const formItemLayout = {
       labelCol: {
         xs: { span: 24 },
         sm: { span: 10 }
       },
       wrapperCol: {
         xs: { span: 24 },
         sm: { span: 14 }
       }
     };

     return(
       <div className="create-testcase">
         <Form
           layout="horizontal"
         >
           <Row>
             <Col span={8}>
               <FormItem
                 {...formItemLayout}
                 label="产品类别"
               >
                 {getFieldDecorator('productTypeId', {
                   rules:[{required:true, message:'请选择产品类别'}]
                 })(
                   <Select
                     showSearch
                     placehoder="选择产品类别"
                     onSelect={this.onProductTypeSelect}
                     filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                   >
                     {
                       this.getProductTypeOptions()
                     }
                   </Select>)}
               </FormItem>
             </Col>
             <Col span={8}>
               <FormItem
                 {...formItemLayout}
                 label="产品名称"
               >
                 {getFieldDecorator('productNameId',{
                   rules:[{required:true, message:'请选择产品名称'}]
                 })(
                   <Select
                     showSearch
                     placehoder="选择产品名称"
                     onSelect={this.onProductNameSelect}
                     disabled={this.state.productNameIdDisabled}
                     filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                   >
                     {
                       this.getProductNameOptions()
                     }
                   </Select>)}
               </FormItem>
             </Col>
             <Col span={8}>
               <FormItem
                 {...formItemLayout}
                 label="Feature大类"
               >
                 {getFieldDecorator('featureTypeId', {
                   rules:[{required:true, message:'请选择Feature大类'}]
                 })(
                   <Select
                     showSearch
                     placehoder="选择Feature"
                     onSelect={this.onFeatureSelect}
                     disabled={this.state.featureTypeIdDisabled}
                     filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                   >
                     {
                       this.getFeatureOptions()
                     }
                   </Select>)}
               </FormItem>
             </Col>
           </Row>
           <Row>
             <Col span={8}>
               <FormItem
                 {...formItemLayout}
                 label="功能单元"
               >
                 {getFieldDecorator('featureUnitId', {
                   rules:[{required:true, message:'请选择功能单元'}]
                 })(
                   <Select
                     showSearch
                     placehoder="选择功能单元"
                     disabled={this.state.featureUnitIdDisabled}
                     filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                   >
                     {
                       this.getUnitOptions()
                     }
                   </Select>)}
               </FormItem>
             </Col>
             <Col span={8}>
               <FormItem
                 {...formItemLayout}
                 label="用例标题"
               >
                 {getFieldDecorator('caseTitle',{
                   rules:[{required:true, message:'请输入用例标题'},{
                     max:100,
                     message: '长度不超过100',
                   }]
                 })(<Input/>)}
               </FormItem>
             </Col>
             <Col span={8}>
               <FormItem
                 {...formItemLayout}
                 label="优先级"
               >
                 {getFieldDecorator('priority',{
                   rules:[{required:true, message:'请选择优先级'}]
                 })(
                   <Select
                     alowClear
                     showSearch
                     placehoder="选择优先级"
                     filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                   >
                   <Option value={0} key={0}>
                     高
                   </Option>
                   <Option value={1} key={1}>
                     中
                   </Option>
                   <Option value={2} key={2}>
                     低
                   </Option>
                 </Select>)}
               </FormItem>
             </Col>
           </Row>
           <Row>
             <Col span={8}>
               <FormItem
                 {...formItemLayout}
                 label="产品版本号"
               >
                 {getFieldDecorator('versionId',{
                   rules:[{required:true, message:'请选择产品版本号'}]
                 })(
                   <Select
                     showSearch
                     placehoder="选择产品版本号"
                     allowClear
                     filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                   >
                     {this.getProductVersionOptions()}
                   </Select>)}
               </FormItem>
             </Col>
             <Col span={8}>
               <FormItem
                 {...formItemLayout}
                 label="禅道ID"
               >
                 {
                   getFieldDecorator('externalId')(<Input/>)
                 }
               </FormItem>
             </Col>
           {/*  <Col span={8}>
               <FormItem
                 {...formItemLayout}
                 label="备注"
               >
                 {
                   getFieldDecorator('memo',{
                   rules:[{
                   max:100,
                   message: '长度不超过100',
                 }]
                 })(<Input.TextArea />)
                 }
               </FormItem>
             </Col>*/}
             <Col span={8}>
               <FormItem
                 {...formItemLayout}
                 label="自动化状态"
               >
                 {getFieldDecorator('autoStatus',{
                   rules:[{required:true, message:'请选择自动化状态'}]
                 })(
                   <Select
                     alowClear
                     showSearch
                     placehoder="选择自动化状态"
                     filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                   >
                     <Option value={0} key={0}>
                       未自动化
                     </Option>
                     <Option value={1} key={1}>
                       计划自动化
                     </Option>
                     <Option value={2} key={2}>
                       已自动化
                     </Option>
                   </Select>)}
               </FormItem>
             </Col>
           </Row>
           <Row
           align="center"
           type="flex"
           justify="center"
           >
             <Col span={18}>
                 <Editor
                   localization={{ locale: 'zh' }}
                   editorState={this.state.editorState}
                   toolbarClassName="toolbarClassName"
                   wrapperClassName="wrapperClassName"
                   editorClassName="richText"
                   onEditorStateChange={this.onEditorStateChange}
                 />
             </Col>
           </Row>
           <Row className="actions">
             <Button type="primary" onClick={this.onSave}>保存</Button>
             <Divider type="vertical"/>
             <Button type="primary" onClick={this.onSaveAndContinue}>保存并继续添加</Button>
             <Divider type="vertical"/>
             <Button type="primary" onClick={this.onCancel}>返回</Button>
           </Row>
         </Form>
       </div>
     );
   }
}

export default CreateTestCase;
