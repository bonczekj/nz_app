import "babel-polyfill";
//import 'bootstrap/dist/css/bootstrap.css';
import './App.css';
import 'semantic-ui-css/semantic.min.css';
import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import { BrowserRouter } from 'react-router-dom';
import { set_PHP_url  } from './PHP_Connector';

set_PHP_url();

ReactDOM.render(
    <BrowserRouter>
        <App/>
    </BrowserRouter>, document.getElementById('root')
);

registerServiceWorker();
