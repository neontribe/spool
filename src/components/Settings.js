import React from 'react';
import Relay from 'react-relay';
import { withRouter } from 'react-router';

import UpdateUserMutation from './mutations/UpdateUserMutation';
import Layout from './Layout';
import { SettingsFormContainer } from './SettingsForm';

import styles from './css/Settings.module.css';
import headings from '../css/Headings.module.css';

const { Content, Header } = Layout;

export class Settings extends React.Component {
    static propTypes = {
        defaultRole: React.PropTypes.string
    }

    static defaultProps = {
        defaultRole: 'creator'
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
                <Header auth={this.props.auth} user={this.props.user} />
                <Content>
                    <div className={styles.wrapper}>
                        <h2 className={headings.large}>Getting to know you</h2>
                        <SettingsFormContainer
                            user={this.props.user}
                            meta={this.props.meta}
                            showPrivacyForm={this.props.user.profile && this.props.user.profile.isIntroduced}
                            onSubmit={this.handleSubmit}
                        />
                    </div>
                </Content>
            </Layout>
        );
    }
}

// Settings = withRouter(Settings);

export const SettingsContainer = Relay.createContainer(withRouter(Settings), {
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
            profile {
                isIntroduced
            }
            ${Header.getFragment('user')}
            ${SettingsFormContainer.getFragment('user')}
            ${UpdateUserMutation.getFragment('user')}
        }`
    }
});
