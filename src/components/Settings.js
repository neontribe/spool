import React from 'react';
import Relay from 'react-relay';
import { withRouter } from 'react-router';

import UpdateUserMutation from './mutations/UpdateUserMutation';
import Layout from './Layout';
import { SettingsFormContainer } from './SettingsForm';

import headings from '../css/Headings.module.css';

const { Content, Header } = Layout;

export class Settings extends React.Component {
    static propTypes = {
        defaultRole: React.PropTypes.string,
    }

    static defaultProps = {
        defaultRole: 'creator',
    }

    constructor (props) {
        super(props);

        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleRedirect () {
        return this.props.router.push('/app');
    }

    handleSubmit (form) {
        var success = () => this.handleRedirect();
        var user = this.props.user;

        // Perform Mutation
        this.props.relay.commitUpdate(
            new UpdateUserMutation({
                user,
                ...form
            }),
            {
                onSuccess: success
            },
        );
    }

    render () {
        return (
            <Layout>
                <Header auth={this.props.auth} />
                <Content>
                    <h2 className={headings.large}>Getting to know you</h2>
                    <SettingsFormContainer
                        user={this.props.user}
                        meta={this.props.meta}
                        onSubmit={this.handleSubmit}
                    />
                </Content>
            </Layout>
        );
    }
}

Settings = withRouter(Settings);

export const SettingsContainer = Relay.createContainer(Settings, {
    fragments: {
        meta: () => Relay.QL`
        fragment on Meta {
            roles {
                type
                name
                secret
            }
            ${SettingsFormContainer.getFragment('meta')}
        }`,
        user: () => Relay.QL`
        fragment on User {
            ${SettingsFormContainer.getFragment('user')}
            ${UpdateUserMutation.getFragment('user')}
        }`,
    }
});