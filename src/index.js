import React from 'react';
import ReactDOM from 'react-dom';
import Relay from 'react-relay';
import { RelayNetworkLayer, urlMiddleware, authMiddleware } from 'react-relay-network-layer';
import { Router, Route, IndexRoute, IndexRedirect, browserHistory, applyRouterMiddleware } from 'react-router';
import useRelay from 'react-router-relay';
import AuthService from './auth/AuthService';
import App from './App';
import { HomeContainer } from './components/Home';
import SimpleLogin from './components/SimpleLogin';
import { AddEntryContainer } from './components/AddEntry';
import TopicForm from './components/TopicForm';
import SentimentForm from './components/SentimentForm';
import MediaForm from './components/MediaForm';
import VideoForm from './components/VideoForm';
import ImageForm from './components/ImageForm';
import TextForm from './components/TextForm';

import 'bootstrap/dist/css/bootstrap.css';
// import 'bootstrap/dist/css/bootstrap-theme.css';
import './override-bootstrap.css';
import './index.css';

import { TimelineContainer } from './components/Timeline';

const auth = new AuthService(process.env.AUTH0_CLIENT_ID, process.env.AUTH0_DOMAIN);

function setupRelayNetworkLayer() {
    Relay.injectNetworkLayer(new RelayNetworkLayer([
        urlMiddleware({
            url: process.env.REACT_APP_GRAPHQL_ENDPOINT || '/graphql'
        }),
        authMiddleware({
            token: () => auth.getToken()
        })
    ], { disableBatchQuery:  true }));
}

// onEnter callback to validate authentication in private routes
const requireAuth = (nextState, replace) => {
  if (nextState.location.hash) {
     auth.parseHash(nextState.location.hash);
  }
  if (!auth.loggedIn()) {
      replace({ pathname: '/login' });
      return false;
  }
  return true;
};

const parseAuth = (nextState, replace) => {
    //because the page can't set the id token fast enough, check the nextState to see if the hash exists
    //if it does exist then grab the id token from the hash and then set it to local storage
    if (nextState.location.hash) {
        auth.parseHash(nextState.location.hash);
    }
    if (auth.loggedIn()) {
        replace({ pathname: '/' });
        return true;
    }
}

const ViewerQueries = {
    viewer: () => Relay.QL`query { viewer }`,
};

setupRelayNetworkLayer();
ReactDOM.render(
  <Router history={browserHistory} environment={Relay.Store} render={applyRouterMiddleware(useRelay)}>
    <Route path="/" component={App} auth={auth}>
        <IndexRedirect to="/home" />
        <Route path="home" component={HomeContainer} queries={ViewerQueries} onEnter={requireAuth}>
            <IndexRoute component={TimelineContainer} queries={ViewerQueries} onEnter={requireAuth} />
        </Route>
        <Route path="add" component={AddEntryContainer} queries={ViewerQueries} onEnter={requireAuth}>
            <IndexRedirect to="topic"/>
            <Route path="topic" component={TopicForm} />
            <Route path="sentiment" component={SentimentForm} />
            <Route path="media" component={MediaForm}>
                <Route path="video" component={VideoForm}/>
                <Route path="image" component={ImageForm}/>
                <Route path="text" component={TextForm}/>
            </Route>
        </Route>
        <Route path="login" component={SimpleLogin} onEnter={parseAuth}/>
        <Route path="access_token=:token" component={SimpleLogin} onEnter={parseAuth}/>
    </Route>
  </Router>,
  document.getElementById('root')
);
