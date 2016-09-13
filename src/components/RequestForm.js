import React, { Component } from 'react';
import { Modal, Button, Glyphicon, Image, FormGroup, ControlLabel } from 'react-bootstrap';
import DatePicker from 'react-bootstrap-date-picker';
import _ from 'lodash';
import moment from 'moment';

class RequestForm extends Component {

    constructor(props) {
        super(props);

        this.state = {
            request: {
                fromDate: moment().toISOString(),
                toDate: moment().add(1, 'months').toISOString()
            }
        }

        this.save = this.save.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    save() {
        console.log('save');
    }

    handleChange(key, value) {
        var request = this.state.request;
        request[key] = value;
        this.setState({
            request
        });
    }

    render(){
        return (
            <Modal show={this.props.show} onHide={this.props.cancel}>
                <Modal.Header closeButton>
                    <Modal.Title>Request Access for "{this.props.topic}" Entries</Modal.Title>
                </Modal.Header>
                <Modal.Body>

                    <Image
                        src={this.props.issuerProfile.picture}
                        className='profile-img'
                        circle
                    />
                    <span>{this.props.issuerProfile.nickname}</span>

                    <div className="clear">Would like to see entries about {this.props.topic}</div>

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

                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={this.props.cancel}><Glyphicon glyph="remove"/> Cancel</Button>
                    <Button onClick={this.save}><Glyphicon glyph="ok"/> Send Request</Button>
                </Modal.Footer>
            </Modal>
        );
    }
}

RequestForm.propTypes = {
    cancel: React.PropTypes.func,
    show: React.PropTypes.bool,
    topic: React.PropTypes.string,
    issuerProfile: React.PropTypes.object
}

export default RequestForm;
