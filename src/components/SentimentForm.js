import React, { Component } from 'react';
import { FormGroup, FormControl, ControlLabel, Button } from 'react-bootstrap';

class SentimentForm extends Component {
    constructor(props) {
        super(props);

        this.state = {
            sentiment: props.sentiment
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
            sentiment: event.target.value
        })
    }

    render() {
        return (
            <FormGroup controlId="sentiment">
              <ControlLabel>Sentiment</ControlLabel>
              <FormControl componentClass="select"
                  placeholder="select"
                  value={this.state.sentiment}
                  onChange={this.handleChange}>
                  <option value="happy">happy</option>
                  <option value="sad">sad</option>
              </FormControl>
              <Button bsStyle="primary"
                  onClick={this.continue}>Next</Button>
            </FormGroup>
        );
    }
}

SentimentForm.propTypes = {
    sentiment: React.PropTypes.string,
    save: React.PropTypes.func.isRequired
};

SentimentForm.defaultProps = {
    senitment: ''
};

export default SentimentForm;
