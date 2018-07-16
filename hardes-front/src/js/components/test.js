import React from 'react';
import { Button } from 'antd';
import { observer } from 'mobx-react';
import '../../less/test.less';
import mobx from '../mobx-data';

const { store, action } = mobx;
// const baseUrl = `${pcocess.env.REACT_APP_API_URL}/api/pb/v1/user/login`;
// const url = `${process.env.REACT_APP_API_URL}/api/pb/v1/user/login`;

const changeTitle = () => {
  document.title = `测试${store.test.num}`;
};
const update = () => {
  action.test.add();
  changeTitle();
};

@observer
class Test extends React.Component {
  render() {
    return (
      <div className="test">
        <Button type="primary" onClick={update}>点我看看</Button>
          <div className="text">Test{store.test.num}</div>
      </div>
    );
  }
}


export default Test;
