import React from 'react';
import Relay from 'react-relay';
import _ from 'lodash';
import keydown from 'react-keydown';
import { withRouter } from 'react-router';

import UpdateUserMutation from './mutations/UpdateUserMutation';

import headings from '../css/Headings.module.css';
import controls from '../css/Controls.module.css';

export class Signup extends React.Component {
    static propTypes = {
        defaultRole: React.PropTypes.string,
        // custom prop, this should be bool but router might chuck us a string
        mode: React.PropTypes.string
    }

    static defaultProps = {
        defaultRole: 'creator',
        mode: 'change'
    }

    constructor (props) {
        super(props);

        let role = this.getRole();
        let currentRole = _.find(props.meta.roles, { type: role });

        this.state = {
            role,
            secret: currentRole && currentRole.secret,
            region: props.user.region,
            requireSecret: false,
            changed: false,
        };

        this.onChange = this.onChange.bind(this);
        this.onChangeRole = this.onChangeRole.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
        this.showRoleChooser = this.showRoleChooser.bind(this);
    }

    componentWillMount () {
        // if we're using this component as a role consolidator
        // then mode will be true and we should just send the user in the right direction
        if (this.shouldSkipConfiguration()) {
            this.handleRedirect(this.props.user.role);
        }
    }

    componentWillReceiveProps({ keydown }) {
        if (keydown.event) {
            if (keydown.event.key === 'r') {
                this.showRoleChooser();
            }
        }
    }

    shouldSkipConfiguration () {
        return this.props.user.role && this.props.mode === "configure";
    }

    onChange (key, event) {
        this.setState({
            [key]: event.target.value,
            changed: true
        });
    }

    onChangeRole (event) {
        let role = event.target.value;

        this.setState({
            role: role,
            secret: _.find(this.props.meta.roles, { type: role }).secret,
            requireSecret: !!role,
            changed: true,
        });
    }

    handleRedirect (role) {
        role = role || this.getRole();

        var redirectTo = this.props.route.roleMap[role];

        if(redirectTo) {
            return this.props.router.push(redirectTo);
        }
    }

    getRole () {
        return (this.state && this.state.role) || this.props.user.role || this.props.defaultRole;
    }

    onSubmit (event) {
        event.preventDefault();

        var success = () => this.handleRedirect();

        if (this.state.changed) {
            var user = this.props.user;

            // Perform Mutation
            this.props.relay.commitUpdate(
                new UpdateUserMutation({
                    user,
                    ...this.state
                }),
                {
                    onSuccess: success
                },
            );
        } else {
            success();
        }
    }

    showRoleChooser () {
        this.setState({
            showRoleChooser: true,
            changed: true,
        });
    }

    render () {
        var currentRole = this.getRole();

        if (this.shouldSkipConfiguration()) {
            // Todo: Huh?
            return (<div></div>);
        }

        return (
            <div>
                <h2 className={headings.large}>Getting to know you</h2>

                <div>
                    <form onSubmit={this.onSubmit}>
                        <form>
                            <label>
                                Where do you live?
                                <div>
                                    <select
                                        placeholder='I live in...'
                                        value={this.state.region || ''}
                                        onChange={_.partial(this.onChange, 'region')}
                                    >
                                        <option value='' disabled={true}>I live in&hellip;</option>

                                        {this.props.meta.regions.map(({type}) => {
                                            return (
                                                <option value={type}>{type}</option>
                                            );
                                        })}
                                    </select>
                                </div>
                            </label>
                        </form>

                        {this.state.showRoleChooser && (
                            <form>
                                <label>
                                    What kind of access do you need?
                                    <div>
                                        {this.props.meta.roles.map(({ type, name }) => {
                                            return (
                                                <input
                                                    type='radio'
                                                    value={type}
                                                    checked={currentRole === type}
                                                    onChange={this.onChangeRole}
                                                />
                                            );
                                        })}
                                    </div>
                                </label>
                            </form>
                        )}

                        {(this.state.requireSecret && this.state.showRoleChooser) &&
                            <form>
                                <label>
                                    Unlock Code
                                    <div>
                                        <input
                                            type='text'
                                            placeholder="We'll ask for an unlock code here in the future"
                                            onChange={_.partial(this.onChange, 'secret')}
                                            value={this.state.secret || ''}
                                        />
                                    </div>
                                </label>

                                {/*<HelpBlock>An unlock code is required to enable access to the dashboard</HelpBlock>*/}
                                <p>An unlock code is required to enable access to the dashboard</p>
                            </form>
                        }

                        <form>
                            <button
                                type='submit'
                                disabled={!(this.state.region && this.state.role)}
                                className={controls.btn}
                            >OK</button>
                        </form>
                    </form>
                </div>
            </div>
        );
    }
}

Signup = keydown(Signup);
Signup = withRouter(Signup);

export const SignupContainer = Relay.createContainer(Signup, {
    fragments: {
        meta: () => Relay.QL`
        fragment on Meta {
            regions {
                type
            }
            roles {
                type
                name
                secret
            }
        }`,
        user: () => Relay.QL`
        fragment on User {
            role
            region
            ${UpdateUserMutation.getFragment('user')}
        }`,
    }
});
