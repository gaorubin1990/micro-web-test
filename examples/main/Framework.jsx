/**
 * @author Kuitos
 * @since 2019-05-16
 */

import React from 'react';
import style from './index.less';

export default function Framework(props) {

  const { content, loading } = props;

  // pushState
  // state：一个与指定网址相关的状态对象，popstate事件触发时，该对象会传入回调函数。
  // title：新页面的标题，但是所有浏览器目前都忽略这个值。
  // url：新的网址，必须与当前页面处在同一个域。浏览器的地址栏将显示这个网址。
  function goto(title, href) {
    window.history.pushState({}, title, href);
  }

  return (
    <>
      <header className={style.header}>
        <nav>
          <ol>
            <li><a href="javascript: void 0" onClick={() => goto('react app', '/react')}>react16 + antd3</a></li>
            <li><a href="javascript: void 0" onClick={() => goto('react15 app', '/15react15')}>react15 + antd2</a></li>
            <li><a href="javascript: void 0" onClick={() => goto('vue app', '/vue')}>vue2 + element2</a></li>
            <li><a href="javascript: void 0" onClick={() => goto('dva app', '/dva')}>dva</a></li>
          </ol>
        </nav>
      </header>
      {loading ? <div>loading...</div> : null}
      {/* dangerouslySetInnerHTML：react标签属性，值为对象，可插入dom */}
      <div dangerouslySetInnerHTML={{ __html: content }} className={style.appContainer}/>
    </>
  );
}
