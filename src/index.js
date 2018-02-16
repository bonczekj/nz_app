//import 'bootstrap/dist/css/bootstrap.css';
import "babel-polyfill";
import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import { BrowserRouter } from 'react-router-dom'
//import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css';

ReactDOM.render(
    <BrowserRouter>
        <App/>
    </BrowserRouter>, document.getElementById('root')
);

registerServiceWorker();
