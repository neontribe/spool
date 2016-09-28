import React, { Component } from 'react';
import { Grid, Row, Col, FormGroup, FormControl, ControlLabel, HelpBlock } from 'react-bootstrap';
import DatePicker from 'react-bootstrap-date-picker';
import _ from 'lodash';
import moment from 'moment';
import AddControls from './AddControls';
import IconChooser from './IconChooser';
import Relay from 'react-relay';
import AddRequestMutation from './mutations/AddRequestMutation.js';
import Request from './Request';
import { withRouter } from 'react-router';

export class RequestForm extends Component {

    constructor(props) {
        super(props);

        var {name, picture: avatar} = props.route.auth.getProfile();

        this.state = {
            request: {
                fromDate: moment().add(-1, 'months').toISOString(),
                toDate: moment().add(1, 'months').toISOString(),
                reason: '',
                topics: [],
                name,
                avatar,
                org: ''
            }
        }

        this.save = this.save.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
        this.validateRequest = this.validateRequest.bind(this);
    }

    save() {
        var onSuccess = () => this.props.router.push('/dashboard');
        var consumer = this.props.consumer;
        this.props.relay.commitUpdate(
            new AddRequestMutation({request: this.state.request, consumer}),
            {onSuccess}
        );
    }

    handleChange(key, value) {
        var request = this.state.request;
        request[key] = value;
        var requestIsComplete = this.validateRequest(request);
        this.setState({
            request,
            requestIsComplete
        });
    }

    handleInputChange(key, evt) {
        this.handleChange(key, evt.target.value);
    }

    validateRequest(request) {
        var valid = true;
        _.forOwn(request, (value) => {
            if (_.isEmpty(value)) {
                valid = false;
            }
        });
        return valid;
    }

    render(){
        return (
            <Grid>
                <Row>
                    <Col xsOffset={3} xs={6}>
                        <h2>Request Access to Entries</h2>
                    </Col>
                </Row>
                <Row>
                    <Col xsOffset={3} xs={6}>
                        <IconChooser
                            label="Entries tagged with topic"
                            choices={this.props.consumer.topics}
                            maxSelections={1}
                            onChange={_.partial(this.handleChange, 'topics')} />
                        <FormGroup>
                            <ControlLabel>Organization</ControlLabel>
                            <FormControl type="text"
                              onChange={_.partial(this.handleInputChange, 'org')} />
                          <HelpBlock>Let recipents of this request know which body the request originates from</HelpBlock>
                        </FormGroup>
                        <FormGroup>
                            <ControlLabel>Because they are...</ControlLabel>
                            <FormControl componentClass="textarea"
                              maxLength={this.props.maxLength}
                              onChange={_.partial(this.handleInputChange, 'reason')} />
                          <HelpBlock>
                              <p>{this.state.request.reason.length} of {this.props.maxLength} letters used</p>
                              <p>Let people know, clearly and simply, why you'd like access to their data.</p>
                          </HelpBlock>
                        </FormGroup>
                        <FormGroup>
                            <ControlLabel>From</ControlLabel>
                            <DatePicker value={this.state.request.fromDate}
                              onChange={_.partial(this.handleChange, 'fromDate')} />
                          <HelpBlock>The request will be sent to people who made entries with the {this.state.request.topics.join(' and ')} topic after this date.</HelpBlock>
                        </FormGroup>

                        <FormGroup>
                            <ControlLabel>To</ControlLabel>
                            <DatePicker value={this.state.request.toDate}
                              onChange={_.partial(this.handleChange, 'toDate')} />
                          <HelpBlock>People who make entries in the {this.state.request.topics.join(' and ')} topic will be shown this request until this  date.</HelpBlock>
                        </FormGroup>
                    </Col>
                </Row>
                <Row>
                    <Col xsOffset={3} xs={6}>
                        <h3>Preview:</h3>
                        <Request
                            userRequest={this.state.request}
                            inert={true}
                             />
                    </Col>
                </Row>
                <Row>
                    <Col xsOffset={3} xs={6}>
                        <AddControls
                            disableNext={!this.state.requestIsComplete}
                            onNext={this.save}
                            onQuit={this.props.router.goBack}/>
                    </Col>
                </Row>
            </Grid>
        );
    }
}

RequestForm.propTypes = {
    maxLength: React.PropTypes.number
};

RequestForm.defaultProps = {
    maxLength: 240
};

RequestForm = withRouter(RequestForm);

export default RequestForm;

export const RequestFormContainer = Relay.createContainer(RequestForm, {
    fragments: {
        consumer: () => Relay.QL`
            fragment on Consumer {
                id
                topics {
                    type,
                    name
                }
                ${AddRequestMutation.getFragment('consumer')}
            }
        `,
    }
});
