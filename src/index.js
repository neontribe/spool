import React from 'react';
import ReactDOM from 'react-dom';
import Relay from 'react-relay';
import { Router, Route, IndexRoute, IndexRedirect, hashHistory, applyRouterMiddleware } from 'react-router';
import useRelay from 'react-router-relay';
import AuthService from './auth/AuthService';
import App from './App';
import { HomeContainer } from './components/Home';
import Login from './components/Login';
import './index.css';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/css/bootstrap-theme.css';


import { TimelineContainer } from './components/Timeline';

const auth = new AuthService(process.env.REACT_APP_AUTH0_CLIENT_ID, process.env.REACT_APP_AUTH0_DOMAIN);

// onEnter callback to validate authentication in private routes
const requireAuth = (nextState, replace) => {
  if (!auth.loggedIn()) {
    replace({ pathname: '/login' });
  }
};
// OnEnter for callback url to parse access_token
const parseAuthHash = (nextState, replace) => {
  auth.parseHash(nextState.location.hash);
  replace('/home');
}

const ViewerQueries = {
    viewer: () => Relay.QL`query { viewer }`,
};


Relay.injectNetworkLayer(new Relay.DefaultNetworkLayer('http://localhost:3001/graphql'));

ReactDOM.render(
  // TODO: Shift to browserHistory only blocked by auth0 access_token handling
  // see: https://auth0.com/forum/t/having-trouble-with-login-following-the-react-guide/3084
  <Router history={hashHistory} environment={Relay.Store} render={applyRouterMiddleware(useRelay)}>
    <Route path="/" component={App} auth={auth}>
        <IndexRedirect to="/home" />
        <Route path="home" component={HomeContainer} queries={ViewerQueries} onEnter={requireAuth}>
            <IndexRoute component={TimelineContainer} queries={ViewerQueries} onEnter={requireAuth} />
        </Route>
        <Route path="login" component={Login} />
        <Route path="access_token=:token" onEnter={parseAuthHash} />
    </Route>
  </Router>,
  document.getElementById('root')
);
