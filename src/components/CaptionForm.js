import React, { Component } from 'react';
import { FormGroup, FormControl, ControlLabel, Button } from 'react-bootstrap';

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
                <ControlLabel>Caption (optional)</ControlLabel>
                <FormControl
                    componentClass="textarea"
                    placeholder=""
                    value={this.state.value}
                    onChange={this.handleChange} />
                <Button bsStyle="primary" bsSize="large" block
                    onClick={this.continue}>Next</Button>
            </FormGroup>
        );
    }
}

CaptionForm.propTypes = {
    initialValue: React.PropTypes.string,
    save: React.PropTypes.func.isRequired
};

CaptionForm.defaultProps = {
    initialValue: ''
};

export default CaptionForm;
