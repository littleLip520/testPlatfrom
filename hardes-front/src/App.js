import React from 'react';
import { Router, Route, Switch } from 'react-router-dom';
import './less/layout.less';
import zhCN from 'antd/lib/locale-provider/zh_CN';
import { LocaleProvider } from 'antd';
import history from './js/utils/history';

// import Test from './js/components/test';
import Home from './js/components/home';
import Login from './js/components/login';

const App = () => (
  <LocaleProvider locale={zhCN}>
    <div className="main-app">
      <Router history={history}>
        <Switch>
          <Route exact path="/" component={Login} />
          <Route path="/login" component={Login} />
          <Route path="/dashboard" component={Home} />
        </Switch>
      </Router>
    </div>
  </LocaleProvider>
);

export default App;
