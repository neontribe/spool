import React from 'react';
import ReactDOM from 'react-dom';
import Relay from 'react-relay';
import { RelayNetworkLayer, urlMiddleware, authMiddleware } from 'react-relay-network-layer';
import { Router, Route, IndexRoute, IndexRedirect, browserHistory, applyRouterMiddleware } from 'react-router';
import useRelay from 'react-router-relay';
import AuthService from './auth/AuthService';
import App from './App';
import RoleSwitchContainer from './components/RoleSwitch';
import { TimelineContainer } from './components/Timeline';
import { DashboardContainer } from './components/Dashboard';
import SimpleLogin from './components/SimpleLogin';
import { SignupContainer } from './components/Signup';
import { AddEntryContainer } from './components/AddEntry';
import TopicForm from './components/TopicForm';
import SentimentForm from './components/SentimentForm';
import MediaForm from './components/MediaForm';
import VideoForm from './components/VideoForm';
import ImageForm from './components/ImageForm';
import TextForm from './components/TextForm';

import 'bootstrap/dist/css/bootstrap.css';
import './override-bootstrap.css';
import './index.css';

const auth = new AuthService(
    process.env.AUTH0_CLIENT_ID,
    process.env.AUTH0_DOMAIN,
    {
        callbackURL: window.location.origin + '/callback',
        login: '/login',
        loggedIn: '/home'
    }
);

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

const ViewerQueries = {
    viewer: () => Relay.QL`query { viewer }`,
};
const SignupQueries = {
    meta: () => Relay.QL`query { meta }`,
    ...ViewerQueries
}

setupRelayNetworkLayer();

ReactDOM.render(
  <Router history={browserHistory} environment={Relay.Store} render={applyRouterMiddleware(useRelay)}>
    <Route path="/" component={App} auth={auth}>
        <IndexRedirect to="home" />
        <Route path="home" component={RoleSwitchContainer} queries={ViewerQueries} onEnter={auth.requireAuthOnEnter}>
            <IndexRoute auth={auth}
                components={{
                    Creator: TimelineContainer,
                    Consumer: DashboardContainer,
                    Missing: SignupContainer,
                }}
                queries={{
                    Creator: ViewerQueries,
                    Consumer: ViewerQueries,
                    Missing: SignupQueries,
                }}
            />
        </Route>
        <Route path="add" component={AddEntryContainer} queries={ViewerQueries} onEnter={auth.requireAuthOnEnter}>
            <IndexRedirect to="topic"/>
            <Route path="topic" component={TopicForm} />
            <Route path="sentiment" component={SentimentForm} />
            <Route path="media" component={MediaForm}>
                <Route path="video" component={VideoForm}/>
                <Route path="image" component={ImageForm}/>
                <Route path="text" component={TextForm}/>
            </Route>
        </Route>
        <Route path="settings" component={SignupContainer} queries={SignupQueries} onEnter={auth.requireAuthOnEnter}/>
        <Route path="login" component={SimpleLogin}/>
        <Route path="callback" component={SimpleLogin} onEnter={auth.parseAuthOnEnter}/>
    </Route>
  </Router>,
  document.getElementById('root')
);
