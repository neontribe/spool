import React from 'react';
import Relay from 'react-relay';
import { Grid, Row, Col, Form, FormGroup, FormControl, ControlLabel, Radio, Button, Glyphicon, HelpBlock } from 'react-bootstrap';
import _ from 'lodash';
import { withRouter } from 'react-router';

export class Signup extends React.Component {
    constructor(props) {
        super(props);

        let role = props.viewer.role.__typename;
        this.state = {
            role: (role === this.props.missingRole) ? this.props.defaultRole : role,
            region: props.viewer.region || ""
        };

        this.onChange = this.onChange.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
    }

    onChange(key, event) {
        this.setState({[key]: event.target.value});
    }

    onSubmit(event) {
        event.preventDefault();
        // Perform Mutation
        // var onSuccess = () => {
        //     this.props.router.push('/home');
        // }
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
                            <FormGroup controlId="role">
                                <Col componentClass={ControlLabel}>
                                    What kind of access do you need?
                                </Col>
                                <Col>
                                    {this.props.availableRoles.map((role) => {
                                        return <Radio key={'role_' + role}
                                                    value={role}
                                                    checked={this.state.role === role}
                                                    onChange={_.partial(this.onChange, 'role')}>{role}</Radio>;
                                    })}
                                </Col>
                            </FormGroup>
                            { this.state.role !== 'Creator' &&
                                <FormGroup controlId="unlockCode">
                                    <Col componentClass={ControlLabel}>
                                        Unlock Code
                                    </Col>
                                    <Col>
                                        <FormControl type="text"
                                        placeholder="We'll ask for an unlock code here in the future"
                                        value={this.state.unlockCode} />
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
        }
        `
    }
});
