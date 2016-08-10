import React, { Component } from 'react';
import { FormGroup, FormControl, ControlLabel, Button } from 'react-bootstrap';

class MediaForm extends Component {
    constructor(props) {
        super(props);

        this.state = {
            media: props.media
        };

        this.continue = this.continue.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    continue(event) {
        event.preventDefault();
        this.props.save(this.state);
    }

    handleChange(event) {
        this.setState({
            media: event.target.value
        })
    }

    render() {
        return (
            <FormGroup controlId="media">
                <ControlLabel>Entry Text</ControlLabel>
                <FormControl
                    componentClass="textarea"
                    placeholder=""
                    value={this.state.media}
                    onChange={this.handleChange} />
                <Button bsStyle="primary"
                    onClick={this.continue}>Next</Button>
            </FormGroup>
        );
    }
}

MediaForm.propTypes = {
    media: React.PropTypes.string,
    save: React.PropTypes.func.isRequired
};

MediaForm.defaultProps = {
    media: ''
};

export default MediaForm;
