import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import ExplainBindingsComponent from './App';
import * as serviceWorker from './serviceWorker';
// import {firstname as foo } from './file2.js'
import developer from './file2.js'
// 声明式导入引入fortawesome
// import FontAwesomeIcon from '@fortawesome/react-fontawesome';
// import { faCoffee } from '@fortawesome/fontawesome-free-solid';

ReactDOM.render(<App />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
