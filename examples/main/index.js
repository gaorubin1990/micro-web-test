import React from 'react';
import ReactDOM from 'react-dom';
import { runDefaultMountEffects } from '../../esm/effects';
import { registerMicroApps, start } from '../../esm/index';
import Framework from './Framework';

function render({ appContent, loading }) {
  const container = document.getElementById('container');
  ReactDOM.render(<Framework loading={loading} content={appContent}/>, container);
}
// 路径匹配
function genActiveRule(routerPrefix) {
  return location => location.pathname.startsWith(routerPrefix);
}

render({ loading: true });
// name: app名称
// entry: 入口
// render: 函数 参数：appContent（string）、loading（boolean）
// activeRule: 激活规则 boolean
// props: 向子app传入的参数 object
registerMicroApps(
  [
    { name: 'react app', entry: '//localhost:7100', render, activeRule: genActiveRule('/react') },
    { name: 'react15 app', entry: '//localhost:7102', render, activeRule: genActiveRule('/15react15') },
    { name: 'vue app', entry: '//localhost:7101', render, activeRule: genActiveRule('/vue') },
    { name: 'dvaApp', entry: '//localhost:8000', render, activeRule: genActiveRule('/dva') },
  ],
  {
    beforeLoad: [app => {
      // console.log('before load', app);
    }],
    beforeMount: [app => {
      // console.log('before mount', app);
    }],
    afterMount: [app => {
      // console.log('after mount', app);
    }],
    afterUnmount: [app => {
      // console.log('after unount', app);
    }],
  },
);

runDefaultMountEffects('/react');

// 传参 { prefetch: boolean, jsSandbox: boolean }
start();
