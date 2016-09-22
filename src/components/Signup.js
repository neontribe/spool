import React from 'react';
import Relay from 'react-relay';
import { Grid, Row, Col, Form, FormGroup, FormControl, ControlLabel, Radio, Button, Glyphicon, HelpBlock } from 'react-bootstrap';
import _ from 'lodash';
import keydown from 'react-keydown';
import { withRouter } from 'react-router';
import UpdateUserMutation from './mutations/UpdateUserMutation';

export class Signup extends React.Component {
    static propTypes = {
        defaultRole: React.PropTypes.string
    }
    static defaultProps = {
        defaultRole: 'creator'
    }
    constructor(props) {
        super(props);
        let role = this.getRole();
        let currentRole = _.find(props.meta.roles, {type: role});
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

    componentWillReceiveProps({ keydown }) {
        if (keydown.event) {
            if (keydown.event.key === 'r') {
                this.showRoleChooser();
            }
        }
    }

    onChange(key, event) {
        this.setState({[key]: event.target.value, changed: true});
    }

    onChangeRole(event) {
        let role = event.target.value;
        this.setState({
            role: role,
            secret: _.find(this.props.meta.roles, {type: role}).secret,
            requireSecret: !!role,
            changed: true,
        });
    }

    handleRedirect(role) {
        role = role || this.getRole();
        var redirectTo = this.props.route.roleMap[role];
        if(redirectTo) {
            return this.props.router.push(redirectTo);
        }
    }

    getRole() {
        return (this.state && this.state.role) || this.props.user.role || this.props.defaultRole;
    }

    onSubmit(event) {
        event.preventDefault();
        var success = () => this.handleRedirect();
        if (this.state.changed) {
            var user = this.props.user;
            // Perform Mutation
            this.props.relay.commitUpdate(
                new UpdateUserMutation({user, ...this.state}),
                {onSuccess: success},
            );
        } else {
            success();
        }
    }

    showRoleChooser() {
        this.setState({
            showRoleChooser: true,
            changed: true,
        });
    }

    render() {
        var currentRole = this.getRole();
        return (
            <Grid>
                <Row>
                    <Col xs={6} xsOffset={3}>
                        <h2>Getting to know you</h2>
                    </Col>
                </Row>
                <Row>
                    <Col xs={6} xsOffset={3}>
                        <Form horizontal onSubmit={this.onSubmit}>
                            <FormGroup controlId="region">
                                <Col componentClass={ControlLabel}>
                                    Where do you live?
                                </Col>
                                <Col>
                                    <FormControl componentClass="select"
                                        placeholder="I live in..."
                                        value={this.state.region || ""}
                                        onChange={_.partial(this.onChange, 'region')}
                                        >
                                        <option value="" disabled={true}>I live in&hellip;</option>
                                        {this.props.meta.regions.map(({type}) => {
                                            return <option key={'region_' + type}
                                                        value={type}
                                                        >{type}</option>;
                                        })}
                                    </FormControl>
                                </Col>
                            </FormGroup>
                            {this.state.showRoleChooser &&
                                <FormGroup controlId="role">
                                    <Col componentClass={ControlLabel}>
                                        What kind of access do you need?
                                    </Col>
                                    <Col>
                                        {this.props.meta.roles.map(({type, name}) => {
                                            return <Radio key={'role_' + type}
                                                        value={type}
                                                        checked={currentRole === type}
                                                        onChange={this.onChangeRole}>{name}</Radio>;
                                        })}
                                    </Col>
                                </FormGroup>
                            }
                            { (this.state.requireSecret && this.state.showRoleChooser) &&
                                <FormGroup controlId="unlockCode">
                                    <Col componentClass={ControlLabel}>
                                        Unlock Code
                                    </Col>
                                    <Col>
                                        <FormControl type="text"
                                            placeholder="We'll ask for an unlock code here in the future"
                                            onChange={_.partial(this.onChange, 'secret')}
                                            value={this.state.secret || ''} />
                                    </Col>
                                    <Col>
                                        <HelpBlock>An unlock code is required to enable access to the dashboard</HelpBlock>
                                    </Col>
                                </FormGroup>
                            }
                            <FormGroup>
                                <Col>
                                    <div className="full-width">
                                        <div className="group-right">
                                            <Button
                                                type="submit"
                                                disabled={!(this.state.region && this.state.role)}>
                                                <Glyphicon glyph="ok" /> OK
                                             </Button>
                                        </div>
                                    </div>
                                </Col>
                            </FormGroup>
                        </Form>
                    </Col>
                </Row>
            </Grid>
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
