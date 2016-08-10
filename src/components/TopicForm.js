import React, { Component } from 'react';
import { FormGroup, FormControl, ControlLabel, Button } from 'react-bootstrap';

class TopicForm extends Component {
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
        this.props.save(this.state.value);
    }

    handleChange(event) {
        this.setState({
            value: event.target.value
        })
    }

    render() {
        return (
            <FormGroup controlId="topic">
              <ControlLabel>Topic</ControlLabel>
              <FormControl componentClass="select"
                  placeholder="select"
                  value={this.state.value}
                  onChange={this.handleChange}>
                  <option value="public_transport">Public Transport</option>
                  <option value="sport">Sport</option>
              </FormControl>
              <Button bsStyle="primary" bsSize="large"
                  onClick={this.continue}
                  disabled={!this.state.value}>Next</Button>
            </FormGroup>
        );
    }
}

TopicForm.propTypes = {
    initialValue: React.PropTypes.string,
    save: React.PropTypes.func.isRequired
};

TopicForm.defaultProps = {
    initialValue: ''
};

export default TopicForm;