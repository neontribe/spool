import React from 'react';
import Relay from 'react-relay';
import { Grid, Row, Col, Form, FormGroup, FormControl, ControlLabel, Radio, Button, Glyphicon, HelpBlock } from 'react-bootstrap';
import _ from 'lodash';

export class Signup extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            role: props.role,
            region: props.region
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
                                        {this.props.availableRegions.map((region) => {
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
                            { this.state.role !== this.props.availableRoles[0] &&
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
    role: 'Creator',
    region: "",
    availableRoles: ['Creator', 'Consumer'],
    availableRegions: ['South Shields', 'Liverpool', 'Gloucestershire']
}

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
        `
    }
});
