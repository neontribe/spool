import React from 'react';
import Relay from 'react-relay';
import { Grid, Row, Col, Form, FormGroup, FormControl, ControlLabel, Radio, Button, Glyphicon, HelpBlock } from 'react-bootstrap';
import _ from 'lodash';
import keydown from 'react-keydown';
import { withRouter } from 'react-router';
import UpdateUserMutation from './mutations/UpdateUserMutation';

export class Signup extends React.Component {
    constructor(props) {
        super(props);

        let role = props.viewer.role.__typename;
        role = (role === this.props.missingRole) ? this.props.defaultRole : role
        this.state = {
            role,
            secret: _.find(this.props.meta.roles, {name: role}).secret,
            region: props.viewer.region || "",
            requireSecret: false
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
        this.setState({[key]: event.target.value});
    }

    onChangeRole(event) {
        let role = event.target.value;
        this.setState({
            role: role,
            secret: _.find(this.props.meta.roles, {name: role}).secret,
            requireSecret: role !== this.props.defaultRole
        });
    }

    onSubmit(event) {
        event.preventDefault();
        var viewer = this.props.viewer;
        // Perform Mutation
        var onSuccess = () => {
            this.props.router.push('/home');
        };
        this.props.relay.commitUpdate(
            new UpdateUserMutation({viewer, ...this.state}),
            {onSuccess}
        );
    }

    showRoleChooser() {
        this.setState({
            showRoleChooser: true
        });
    }

    render() {
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
                                        value={this.state.region}
                                        onChange={_.partial(this.onChange, 'region')}
                                        >
                                        <option value="" disabled={true}>I live in&hellip;</option>
                                        {this.props.meta.regions.map((region) => {
                                            return <option key={'region_' + region}
                                                        value={region}
                                                        >{region}</option>;
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
                                        {this.props.availableRoles.map((role) => {
                                            return <Radio key={'role_' + role}
                                                        value={role}
                                                        checked={this.state.role === role}
                                                        onChange={this.onChangeRole}>{role}</Radio>;
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
                                        <HelpBlock>An unlock code is need to enable access to the dashboard</HelpBlock>
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

Signup.defaultProps = {
    availableRoles: ['Creator', 'Consumer'],
    defaultRole: 'Creator',
    missingRole: 'Missing'
}

Signup = keydown(Signup);
Signup = withRouter(Signup);

export const SignupContainer = Relay.createContainer(Signup, {
    fragments: {
        meta: () => Relay.QL`
        fragment on Meta {
            regions
            roles {
                type
                name
                secret
            }
        }
        `,
        viewer: () => Relay.QL`
        fragment on Viewer {
            region
            role {
                __typename
            }
            ${UpdateUserMutation.getFragment('viewer')}
        }
        `
    }
});
