import React, { Component } from 'react';
import { Grid, Row, Col, Image, FormGroup, FormControl, ControlLabel, HelpBlock } from 'react-bootstrap';
import DatePicker from 'react-bootstrap-date-picker';
import _ from 'lodash';
import moment from 'moment';
import AddControls from './AddControls';
import TopicChooser from './TopicChooser';
import Relay from 'react-relay';
import AddRequestMutation from './mutations/AddRequestMutation.js';
import Request from './Request';

export class RequestForm extends Component {

    constructor(props) {
        super(props);

        var {name: issuerName, picture: issuerAvatar} = props.route.auth.getProfile();

        this.state = {
            request: {
                fromDate: moment().toISOString(),
                toDate: moment().add(1, 'months').toISOString(),
                reason: '',
                topics: [],
                issuerName,
                issuerAvatar
            }
        }

        this.save = this.save.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
    }

    save() {
        var onSuccess = () => console.log('onSuccess() RequestForm');
        var viewer = this.props.viewer;
        this.props.relay.commitUpdate(
            new AddRequestMutation({request: this.state.request, viewer}),
            {onSuccess}
        );
    }

    handleChange(key, value) {
        var request = this.state.request;
        request[key] = value;
        this.setState({
            request
        });
    }

    handleInputChange(key, evt) {
        this.handleChange(key, evt.target.value);
    }

    render(){
        var topics = this.props.viewer.topics;
        return (
            <Grid>
                <Row>
                    <Col xsOffset={3} xs={6}>
                        <h2>Request Access to Entries</h2>
                    </Col>
                </Row>
                <Row>
                    <Col xsOffset={3} xs={6}>
                        <h3>Preview:</h3>
                        <Request
                            {...this.state.request}
                             />
                    </Col>
                </Row>
                <Row>
                    <Col xsOffset={3} xs={6}>
                        <TopicChooser
                            label="Would like to see entries about"
                            topics={topics}
                            maxSelections={1}
                            onChange={_.partial(this.handleChange, 'topics')} />
                        <FormGroup>
                            <ControlLabel>From</ControlLabel>
                            <DatePicker value={this.state.request.fromDate}
                              onChange={_.partial(this.handleChange, 'fromDate')} />
                        </FormGroup>

                        <FormGroup>
                            <ControlLabel>To</ControlLabel>
                            <DatePicker value={this.state.request.toDate}
                              onChange={_.partial(this.handleChange, 'toDate')} />
                        </FormGroup>

                        <FormGroup>
                            <ControlLabel>Because</ControlLabel>
                            <FormControl componentClass="textarea"
                              maxLength={this.props.maxLength}
                              onChange={_.partial(this.handleInputChange, 'reason')} />
                            <HelpBlock>{this.state.request.reason.length} of {this.props.maxLength} letters used</HelpBlock>
                        </FormGroup>
                    </Col>
                </Row>
                <Row>
                    <Col xsOffset={3} xs={6}>
                        <AddControls onNext={this.save} />
                    </Col>
                </Row>
            </Grid>
        );
    }
}

RequestForm.propTypes = {
    maxLength: React.PropTypes.number
}

RequestForm.defaultProps = {
    maxLength: 240
}

export const RequestFormContainer = Relay.createContainer(RequestForm, {
    fragments: {
        viewer: () => Relay.QL`
            fragment on Viewer {
                id
                topics {
                    type,
                    name
                }
                ${AddRequestMutation.getFragment('viewer')}
            }
        `,
    }
});
