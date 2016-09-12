import React, { Component } from 'react';
import { Grid, Row, Col, FormGroup, FormControl, ControlLabel, HelpBlock } from 'react-bootstrap';
import AddEntryControls from './AddEntryControls';

class TextForm extends Component {
    constructor(props) {
        super(props);

        this.state = {
            value: props.initialValue
        };

        this.continue = this.continue.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    continue(event) {
        event.preventDefault();
        this.props.save({text: this.state.value});
    }

    handleChange(event) {
        this.setState({
            value: event.target.value
        });
    }

    render() {
        return (
            <Grid>
                <Row>
                    <Col>
                        <FormGroup controlId="media">
                            <ControlLabel>I just want to say...</ControlLabel>
                            <FormControl
                                componentClass="textarea"
                                maxLength={this.props.maxLength}
                                placeholder=""
                                value={this.state.value}
                                onChange={this.handleChange} />
                            <HelpBlock>{this.state.value.length} of {this.props.maxLength} letters used</HelpBlock>
                        </FormGroup>
                    </Col>
                    <Col>
                        <AddEntryControls
                            onNext={this.continue}
                            disableNext={!this.state.value}
                            />
                    </Col>
                </Row>
            </Grid>

        );
    }
}

TextForm.propTypes = {
    initialValue: React.PropTypes.string,
    save: React.PropTypes.func
};

TextForm.defaultProps = {
    initialValue: '',
    maxLength: 250
};

export default TextForm;
