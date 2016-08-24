import React, { Component } from 'react';
import { FormGroup, FormControl, ControlLabel, ButtonToolbar, Button, Glyphicon } from 'react-bootstrap';

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
            <FormGroup controlId="media">
                <ControlLabel>I just want to say...</ControlLabel>
                <FormControl
                    componentClass="textarea"
                    placeholder=""
                    value={this.state.value}
                    onChange={this.handleChange} />

                <ButtonToolbar>
                    <Button
                        onClick={this.continue}
                        disabled={!this.state.value}
                    ><Glyphicon glyph="chevron-right" />Next</Button>
                </ButtonToolbar>
            </FormGroup>
        );
    }
}

TextForm.propTypes = {
    initialValue: React.PropTypes.string,
    save: React.PropTypes.func.isRequired
};

TextForm.defaultProps = {
    initialValue: ''
};

export default TextForm;
