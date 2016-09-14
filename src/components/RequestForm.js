import React, { Component } from 'react';
import { Grid, Row, Col, Image, FormGroup, FormControl, ControlLabel, HelpBlock } from 'react-bootstrap';
import DatePicker from 'react-bootstrap-date-picker';
import _ from 'lodash';
import moment from 'moment';
import AddControls from './AddControls';
import TopicChooser from './TopicChooser';

import { topics } from './stories/fixtures';

class RequestForm extends Component {

    constructor(props) {
        super(props);

        this.state = {
            request: {
                fromDate: moment().toISOString(),
                toDate: moment().add(1, 'months').toISOString(),
                reason: '',
                issuerProfile: props.route.auth.getProfile(),
                topic: null
            }
        }

        this.save = this.save.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
    }

    save() {
        console.log('save', this.state.request);
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
        return (
            <Grid>
                <Row>
                    <Col xsOffset={3} xs={6}>
                        <h2>Request Access to Entries</h2>
                    </Col>
                </Row>
                <Row>
                    <Col xsOffset={3} xs={6}>
                        <Image
                            src={this.state.request.issuerProfile.picture}
                            className='profile-img'
                            circle
                        />
                        <span>{this.state.request.issuerProfile.nickname}</span>
                    </Col>
                </Row>
                <Row>
                    <Col xsOffset={3} xs={6}>
                        <TopicChooser
                            label="Would like to see entries about"
                            topics={this.props.topics}
                            maxSelections={1}
                            onChange={_.partial(this.handleChange, 'topic')} />
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
    maxLength: React.PropTypes.number,
    topics: React.PropTypes.array
}

RequestForm.defaultProps = {
    maxLength: 240,
    topics: topics
}

export default RequestForm;
