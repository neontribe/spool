import React from 'react';
import ReactDOM from 'react-dom';
import Relay from 'react-relay';
import { RelayNetworkLayer, urlMiddleware, authMiddleware } from 'react-relay-network-layer';
import { Router, Route, IndexRedirect, browserHistory, applyRouterMiddleware } from 'react-router';
import useRelay from 'react-router-relay';

import AuthService from './auth/AuthService';
import App from './App';
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

import './css/global.css';

const auth = new AuthService(
    process.env.AUTH0_CLIENT_ID,
    process.env.AUTH0_DOMAIN,
    {
        callbackURL: window.location.origin + '/callback',
        login: '/login',
        loggedIn: '/settings/configure'
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

const MetaQueries = {
    meta: () => Relay.QL`query { meta }`,
};

const UserQueries = {
    user: () => Relay.QL`query { user }`,
};

const ConsumerQueries = {
    consumer: () => Relay.QL`query { consumer }`,
    ...UserQueries,
};

const CreatorQueries = {
    creator: () => Relay.QL`query { creator }`,
    ...UserQueries,
};

const SignupQueries = {
    ...UserQueries,
    ...MetaQueries,
};

const EntryQueries = {
    entry: () => Relay.QL`query { node(id: $entryId) }`,
    ...CreatorQueries,
    ...UserQueries,
};

setupRelayNetworkLayer();

ReactDOM.render(
    <Router history={browserHistory} environment={Relay.Store} render={applyRouterMiddleware(useRelay)}>
        <Route path="/" component={App} auth={auth}>
            <IndexRedirect to="settings/configure" />
            <Route path="settings/:mode" component={SignupContainer} roleMap={{
                "consumer": "/dashboard",
                "creator": "/home",
            }} queries={SignupQueries} onEnter={auth.requireAuthOnEnter}/>

            <Route path="dashboard" component={DashboardContainer} queries={ConsumerQueries} onEnter={auth.requireAuthOnEnter}/>
            <Route path="home" component={TimelineContainer} queries={CreatorQueries} onEnter={auth.requireAuthOnEnter}/>
            <Route path="add" component={AddEntryContainer} queries={CreatorQueries}>
                <IndexRedirect to="about"/>
                <Route path="about" component={TopicForm} />
                <Route path="feeling" component={SentimentForm} />
                <Route path="message" component={MediaForm}>
                    <Route path="video" component={VideoForm}/>
                    <Route path="photo" component={ImageForm}/>
                    <Route path="typing" component={TextForm}/>
                </Route>
            </Route>
            <Route path="login" component={SimpleLogin}/>
            <Route path="callback" component={SimpleLogin} onEnter={auth.parseAuthOnEnter}/>
        </Route>
    </Router>,
    document.getElementById('root')
);
