import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, IndexRoute, browserHistory } from 'react-router';
import App from './App';
import Home from './components/Home';
import './index.css';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/css/bootstrap-theme.css';

ReactDOM.render(
  <Router history={browserHistory}>
    <Route path="/" component={App}>
        <IndexRoute component={Home} />
    </Route>
  </Router>,
  document.getElementById('root')
);
