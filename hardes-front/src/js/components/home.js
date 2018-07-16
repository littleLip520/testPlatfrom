import React from 'react';
import { Layout, Menu, Icon, Divider } from 'antd';
import { Router, Route, Switch } from 'react-router-dom';
import { observer } from 'mobx-react';
import {withRouter} from 'react-router-dom';
import IterationDetail from './iteration/iterationDetail';
import CreateIteration from './iteration/createIteration';
import Iteration from './iteration/iterationList';
import Exception from './iteration/exceptionList';
import ExceptionDetail from './iteration/exceptionDetail';
import history from '../utils/history';
import BaseSetting from './manage/baseSetting';
import ProductSetting from './manage/product';
import UserSetting from './manage/userSetting';
import Testcase from './testcase/testcaseList';
import CreateTestCase from './testcase/createTestcase';
import UpdateTestCase from './testcase/updateTestCase';
import TestSuite from './testsuite/testsuite';
import CreateTestSuite from './testsuite/createTestSuite';
import UpdateScript from './interface/updateScript';




import CreateEnvironment from './interface/createEnvironment';
import UpdateTestSuite from './testsuite/updateTestSuite';
import TestSuiteDetail from './testsuite/testsuiteDetail';
import TestExecuteLog from './testsuite/testExecuteLog';

import Defect from './defect/defectList';
import AnalyzeDefect from './defect/analyzeDefect';
import CreateDefect from './defect/createDefect';
import UpdateDefect from './defect/updateDefect';
import ViewChanges from './defect/viewChanges';
import MeasureDefect from './defect/measureDefect';

import '../../less/layout.less';
import mobx from '../mobx-data/mobxUser';
import EnvironmentSetting from './interface/environment';

import ScriptList from './interface/scriptList';
import InterfaceInfo from './interface/interfaceInfo';
import CreateInterfaceForm from './interface/createInterface';
import CreateScriptForm from './interface/createScript';

import SystemService from './manage/systemService';
import SaveScriptConfig from "./interface/saveScriptConfig";



const { store: { userStore } } = mobx;
const { SubMenu } = Menu;
const MenuItem = Menu.Item;
const { Header, Content, Sider } = Layout;


@observer
class Home extends React.Component {
  // history = this.props.history
  state = {
    collapsed: false,
  };
  onCollapse = (collapsed) => {
    this.setState({ collapsed });
  };
  componentWillMount(){
    const token = localStorage.getItem('token');
    const name = localStorage.getItem('name');
    if(token && name){
      // history.push('/login');
      // userAction.login(1,{token:token});
      // history.push('/login');
    }else{
      history.push('/login');
    }
  }
  handleClick = (e) =>{
    // let path = '';
    // _.reverse(e.keyPath);
    // _.each(e.keyPath,(item)=>{
    //   path+=item+'/';
    // });
    history.push(e.key);
  };


  render() {
    const reg = /\/create.*|\/update.*|\/detail.*/g;
    const path = history.location.pathname.replace(reg,'');
    // console.log(path);
    return (
      <div className="home">
        <Router history={history}>
          <Layout className="main-layout">
            <Header className="main-header">
              <div className="logo" >哈迪斯测试平台</div>
              <div className="header-right">
                <UserInfo name={userStore.name} />
                <Divider type="vertical"/>
                <div className="logout" onClick={()=>{history.push('/');}}>退出</div>
              </div>
            </Header>
            <Layout>
              <Sider
                className="main-sider"
                collapsible
                collapsed={this.state.collapsed}
                onCollapse={this.onCollapse}
              >
                <Menu
                  theme="dark"
                  className="sider-menu"
                  mode="inline"
                  defaultOpenKeys={[`${this.props.match.url}/iteration`]}
                  onClick = {this.handleClick}
                  selectedKeys={[path]}
                >
                  <SubMenu
                    key={`${this.props.match.url}/iteration`}
                    title={<span><Icon type="schedule"/><span>迭代管理</span></span>}
                  >
                    <MenuItem
                      key={`${this.props.match.url}/iteration`}
                      className="sub-menu"
                    >
                      <span>日常迭代</span>
                    </MenuItem>
                    <MenuItem
                      className="sub-menu"
                      key={`${this.props.match.url}/iteration/exception`}
                    >
                      异常事件
                    </MenuItem>
                    <MenuItem
                      className="sub-menu"
                      key={`${this.props.match.url}/iteration/task`}
                    >
                      工作任务
                    </MenuItem>

                  </SubMenu>
                  <SubMenu
                    key={`${this.props.match.url}/testsuite`}
                    title={<span><Icon type="folder"/><span>测试集管理</span></span>}
                  >
                    <MenuItem
                      key={`${this.props.match.url}/testsuite`}
                      className="sub-menu"
                    >
                      <span>测试集概览</span>
                    </MenuItem>
                    <MenuItem
                      className="sub-menu"
                      key={`${this.props.match.url}/testsuite/strategy`}
                    >
                      测试策略定义
                    </MenuItem>
                    <MenuItem
                      className="sub-menu"
                      key={`${this.props.match.url}/testsuite/analyse`}
                    >
                      测试执行分析
                    </MenuItem>
                  </SubMenu>
                  <SubMenu
                    key={`${this.props.match.url}/testcase`}
                    title={<span><Icon type="file"/><span>测试用例管理</span></span>}
                  >
                    <MenuItem
                      key={`${this.props.match.url}/testcase`}
                      className="sub-menu"
                    >
                      <span>用例设计</span>
                    </MenuItem>
                    <MenuItem
                      className="sub-menu"
                      key={`${this.props.match.url}/testcase/map`}
                    >
                      产品功能地图
                    </MenuItem>
                    <MenuItem
                      className="sub-menu"
                      key={`${this.props.match.url}/testcase/analyse`}
                    >
                      用例分析
                    </MenuItem>
                  </SubMenu>
                  <SubMenu
                    key={`${this.props.match.url}/interface`}
                    title={<span><Icon type="api"/><span>接口测试管理</span></span>}
                  >
                    <MenuItem
                      key={`${this.props.match.url}/interface/interfaceInfo`}
                      className="sub-menu"
                    >
                      <span>接口管理</span>
                    </MenuItem>
                    <MenuItem
                      className="sub-menu"

                      key={`${this.props.match.url}/interface/ScriptList`}
                    >
                      脚本管理
                    </MenuItem>
                    <MenuItem
                      className="sub-menu"
                      key={`${this.props.match.url}/interface/environment`}

                    >
                      配置项管理
                    </MenuItem>
                    <MenuItem
                      className="sub-menu"
                      key={`${this.props.match.url}/interface/analyse`}
                    >
                      接口测试分析
                    </MenuItem>
                  </SubMenu>
                  <SubMenu
                    key={`${this.props.match.url}/subject`}
                    title={<span><Icon type="fork"/><span>专项测试管理</span></span>}
                  >
                    <MenuItem
                      key={`${this.props.match.url}/subject/apiperf`}
                      className="sub-menu"
                    >
                      <span>接口压测</span>
                    </MenuItem>
                    <MenuItem
                      className="sub-menu"
                      key={`${this.props.match.url}/subject/apiperfanalyse`}
                    >
                      接口性能分析
                    </MenuItem>
                    <MenuItem
                      className="sub-menu"
                      key={`${this.props.match.url}/subject/security`}
                    >
                      安全性测试
                    </MenuItem>
                  </SubMenu>
                  <MenuItem
                    key={`${this.props.match.url}/testdata`}
                    className="sub-menu"
                  >
                    <span><Icon type="hdd"/><span>测试数据管理</span></span>
                  </MenuItem>


                  <SubMenu
                    key={`${this.props.match.url}/defect`}
                    title={<span><Icon type="line-chart"/><span>质量分析度量</span></span>}
                  >
                    <MenuItem
                      key={`${this.props.match.url}/defect/list`}
                      className="sub-menu"
                    >
                      <span>产线缺陷分析</span>
                    </MenuItem>
                    <MenuItem
                      className="sub-menu"
                      key={`${this.props.match.url}/defect/measurement`}
                    >
                      产线缺陷度量
                    </MenuItem>
                    <MenuItem
                      className="sub-menu"
                      key={`${this.props.match.url}/quality/analyse`}
                    >
                      产品质量分析
                    </MenuItem>
                  </SubMenu>

                      <SubMenu
                        key={`${this.props.match.url}/settings`}
                        title={<span><Icon type="setting"/><span>平台管理</span></span>}
                      >
                        <MenuItem
                          key={`${this.props.match.url}/settings/base`}
                        >
                          基本配置
                        </MenuItem>
                        <MenuItem
                          key={`${this.props.match.url}/settings/user`}
                        >
                          用户管理
                        </MenuItem>
                        <MenuItem
                          key={`${this.props.match.url}/settings/product`}
                        >
                          产品结构管理
                        </MenuItem>
                        <MenuItem
                          className="sub-menu"
                          key={`${this.props.match.url}/settings/authority`}

                        >

                          权限管理
                        </MenuItem>
                        <MenuItem
                          key={`${this.props.match.url}/settings/system`}
                          className="sub-menu"
                        >
                          系统服务管理
                        </MenuItem>
                        <MenuItem
                          key={`${this.props.match.url}/settings/team`}
                          className="sub-menu"
                        >
                          团队结构管理
                        </MenuItem>


                      </SubMenu>




                    </Menu>
                </Sider>
                <Layout className="right-sider">
                  <Content className="main-content">
                    <Switch>
                      <Route exact path="/dashboard/iteration" component={Iteration} />
                      {/* <Route exact path="/dashboard/iteration/" component={Iteration} /> */}
                      <Route exact path="/dashboard/iteration/list" component={Iteration} />
                      <Route exact path="/dashboard/iteration/create" component={CreateIteration} />

                      <Route exact path="/dashboard/environment/create" component={CreateEnvironment} />
                      <Route exact path="/dashboard/interfaceMgmt/create" component={CreateInterfaceForm} />

                      <Route exact path="/dashboard/iteration/update/:id" component={IterationDetail} />
                      <Route exact path="/dashboard/iteration/exception" component={Exception} />
                      <Route exact path="/dashboard/iteration/exception/list" component={Exception} />
                      <Route exact path="/dashboard/iteration/exception/list/:id" component={Exception} />
                      <Route exact path="/dashboard/iteration/exception/create" component={ExceptionDetail} />
                      <Route exact path="/dashboard/iteration/exception/update/:id" component={ExceptionDetail} />
                      <Route exact path="/dashboard/iteration/task" component={TODOPage}/>
                      <Route exact path="/dashboard/settings/base" component={BaseSetting} />
                      <Route exact path="/dashboard/settings" component={BaseSetting} />
                      <Route exact path="/dashboard/settings/product" component={ProductSetting}/>
                      <Route exact path="/dashboard/settings/user" component={UserSetting}/>

                      <Route exact path="/dashboard/interface/environment" component={EnvironmentSetting}/>
                      <Route exact path="/dashboard/interface/scriptList" component={ScriptList}/>
                      <Route exact path="/dashboard/interface/createScript" component={CreateScriptForm}/>
                      <Route exact path="/dashboard/interface/updateScript/:id" component={UpdateScript}/>
                      <Route exact path="/dashboard/interface/saveScriptConfig/:id" component={SaveScriptConfig}/>
                      <Route exact path="/dashboard/interface/interfaceInfo" component={InterfaceInfo}/>

                      <Route exact path="/dashboard/testcase" component={Testcase}/>
                      <Route exact path="/dashboard/testcase/create" component={CreateTestCase}/>
                      <Route exact path="/dashboard/testcase/update/:id" component={UpdateTestCase}/>
                      <Route exact path="/dashboard/testcase/map" component={TODOPage}/>
                      <Route exact path="/dashboard/testcase/analyse" component={TODOPage}/>
                      <Route exact path="/dashboard/testsuite/create" component={CreateTestSuite} />
                      <Route exact path="/dashboard/testsuite/update/:id" component={UpdateTestSuite} />
                      <Route exact path="/dashboard/testsuite/detail/:id" component={TestSuiteDetail} />
                      <Route exact path="/dashboard/testsuite" component={TestSuite} />
                      <Route exact path="/dashboard/testsuite/strategy" component={TODOPage}/>
                      <Route exact path="/dashboard/testsuite/analyse" component={TODOPage}/>
                      <Route exact path="/dashboard/testsuite/testExecuteLog/:id" component={TestExecuteLog}/>
                      <Route exact path="/dashboard/defect/list" component={TODOPage} />
                      <Route exact path="/dashboard/defect/create" component={TODOPage} />
                      <Route exact path="/dashboard/defect/update/:id" component={TODOPage} />
                      <Route exact path="/dashboard/defect/changes" component={TODOPage} />
                      <Route exact path="/dashboard/defect/analyze/:id" component={TODOPage} />
                      <Route exact path="/dashboard/defect/measurement" component={TODOPage}/>
                      <Route exact path="/dashboard/interface/api" component={TODOPage}/>
                      <Route exact path="/dashboard/interface/analyse" component={TODOPage}/>
                      <Route exact path="/dashboard/interface/script" component={TODOPage}/>
                      <Route exact path="/dashboard/interface/config" component={TODOPage}/>
                      <Route exact path="/dashboard/subject/apiperf" component={TODOPage}/>
                      <Route exact path="/dashboard/subject/security" component={TODOPage}/>
                      <Route exact path="/dashboard/subject/apiperfanalyse" component={TODOPage}/>
                      <Route exact path="/dashboard/testdata" component={TODOPage}/>
                      <Route exact path="/dashboard/quality/analyse" component={TODOPage}/>
                      <Route exact path="/dashboard/settings/authority" component={TODOPage}/>
                      <Route exact path="/dashboard/settings/system" component={SystemService}/>
                      <Route exact path="/dashboard/settings/team" component={TODOPage}/>
                    </Switch>
                  </Content>
                </Layout>
            </Layout>
          </Layout>
        </Router>
      </div>
    );
  }
}
const UserInfo = props => (
  <div className="user" >
    <div className="name">{localStorage.getItem('name')}</div>
  </div>);
export default withRouter(Home);

const TODOPage = () =>{
  return(
    <div className="todo">
      功能正在开发中
    </div>
  );
}
