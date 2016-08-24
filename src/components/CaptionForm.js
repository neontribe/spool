import React, { Component } from 'react';
import { FormGroup, FormControl, ControlLabel, Button, Glyphicon } from 'react-bootstrap';

class CaptionForm extends Component {
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
            <FormGroup controlId="caption">
                <ControlLabel>I&apos;m posting this {this.props.type} because...</ControlLabel>
                <FormControl
                    componentClass="textarea"
                    placeholder=""
                    value={this.state.value}
                    onChange={this.handleChange} />
                <Button onClick={this.continue}><Glyphicon glyph="chevron-right" />Next</Button>
            </FormGroup>
        );
    }
}

CaptionForm.propTypes = {
    initialValue: React.PropTypes.string,
    save: React.PropTypes.func.isRequired,
    type: React.PropTypes.string.isRequired
};

CaptionForm.defaultProps = {
    initialValue: ''
};

export default CaptionForm;
