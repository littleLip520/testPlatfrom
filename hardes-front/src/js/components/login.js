import React from 'react';
import { Form, Icon, Input, Button, Tooltip } from 'antd';
import mobx from '../mobx-data/mobxUser';

import history from '../utils/history';
import '../../less/login.less';
import { observer } from 'mobx-react/index';

const { store:{userStore}, action: { userAction } } = mobx;

const FormItem = Form.Item;

@observer
class LoginForm extends React.Component {
  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
      }
      userAction.login(0,values).then((flag)=>{
        if(flag){
          history.push('/dashboard/iteration');
        }
      });
    });
  };
  render() {
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 6 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 18 },
      },
    };
    return (
      <div className="login-form-wrapper">
        <div className="bg" />
        {/* <div className="welcome">欢迎使用哈迪斯测试平台</div> */}
        <Form onSubmit={this.handleSubmit} className="login-form">
          <FormItem
            className="login-form-account"
            label={(
            <span>
              账号&nbsp;
              <Tooltip title="使用云砺邮箱和密码登录，注意不要带上@xforcepluce.com">
                <Icon type="question-circle-o" />
              </Tooltip>
            </span>
          )}
            {...formItemLayout}
          >
            {
              getFieldDecorator('username', {
                rules: [{ required: true, message: '请输入用户名' }],
              })(<Input prefix={<Icon type="user" />} placeholder="用户名" />)
            }
          </FormItem>
          <FormItem
            label="密码"
            {...formItemLayout}
          >
            {
            getFieldDecorator('password', {
              rules: [{ required: true, message: '请输入密码' }],
            })(<Input prefix={<Icon type="lock" />} placeholder="密码" type="password" />)
          }
          </FormItem>
          <FormItem className="login-form-item">
            <Button loading={userStore.loginLoading} type="primary" htmlType="submit" className="login-form-button">
              登录
            </Button>
          </FormItem>
        </Form>
      </div>
    );
  }
}

const WrappedForm = Form.create()(LoginForm);

export default WrappedForm;
