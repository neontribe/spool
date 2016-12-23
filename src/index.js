import React from 'react';
import ReactDOM from 'react-dom';
import Relay from 'react-relay';
import { RelayNetworkLayer, urlMiddleware, authMiddleware } from 'react-relay-network-layer';
import { Router, Route, IndexRedirect, browserHistory, applyRouterMiddleware } from 'react-router';
import useRelay from 'react-router-relay';

import AuthService from './auth/AuthService';
import App, { RoleWrapperContainer } from './App';
import { GalleryContainer } from './components/Gallery';
import { TimelineContainer } from './components/Timeline';
import { DashboardContainer } from './components/Dashboard';
import SimpleLogin from './components/SimpleLogin';
import { SettingsContainer } from './components/Settings';
import { AddEntryContainer } from './components/AddEntry';
import { AccessContainer } from './components/Access';
import { EntryViewerContainer } from './components/EntryViewer';
import { IntroductionContainer } from './components/Introduction';

import './css/global.css';
import './css/bootstrap.css';

const auth = new AuthService(
    process.env.AUTH0_CLIENT_ID,
    process.env.AUTH0_DOMAIN,
    {
        callbackURL: window.location.origin + '/callback',
        login: '/login',
        loggedIn: '/app'
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
    ], { disableBatchQuery: true }));
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

const SettingsQueries = {
    ...UserQueries,
    ...MetaQueries,
};

const EntryViewerQueries = {
    node: () => Relay.QL`query { node(id: $id) }`,
    creator: () => Relay.QL`query { creator }`,
}

setupRelayNetworkLayer();

ReactDOM.render(
    <Router history={browserHistory} environment={Relay.Store} render={applyRouterMiddleware(useRelay)}>
        <Route path="/" component={App} auth={auth}>
            <IndexRedirect to="/app" />
            <Route path="login" component={SimpleLogin} />
            <Route path="callback" component={SimpleLogin} onEnter={auth.parseAuthOnEnter} />

            <Route path="app" component={RoleWrapperContainer} queries={UserQueries} onEnter={auth.requireAuthOnEnter}  auth={auth}>
                <Route path="settings" component={SettingsContainer} queries={SettingsQueries} onEnter={auth.requireAuthOnEnter} />
                <Route path="introduction" component={IntroductionContainer} queries={UserQueries} onEnter={auth.requireAuthOnEnter} />
                <Route path="home" component={GalleryContainer} queries={CreatorQueries} onEnter={auth.requireAuthOnEnter} />
                <Route path="add" component={AddEntryContainer} queries={CreatorQueries} />
                <Route path="timeline" component={TimelineContainer} queries={CreatorQueries} onEnter={auth.requireAuthOnEnter} />
                <Route path="entry/:id" component={EntryViewerContainer} queries={EntryViewerQueries} onEnter={auth.requireAuthOnEnter} />
                <Route path="dashboard" component={DashboardContainer} queries={ConsumerQueries} onEnter={auth.requireAuthOnEnter} />
                <Route path="access" component={AccessContainer} queries={ConsumerQueries} onEnter={auth.requireAuthOnEnter} />
            </Route>
        </Route>
    </Router>,
    document.getElementById('root')
);
