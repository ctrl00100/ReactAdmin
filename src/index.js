import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';


// import App from './App';
import 'antd/dist/antd.min.css';
import MyApp from './MyApp';
import * as serviceWorker from './serviceWorker';
//
import storageUtils from './utils/storageUtils'
import memoryUtils from './utils/memoryUtils'

// 读取local中保存user, 保存到内存中
const user = storageUtils.getUser()
memoryUtils.user = user
//
ReactDOM.render(<MyApp />, document.getElementById('root'));
serviceWorker.unregister();
