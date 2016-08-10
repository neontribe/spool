import React, { Component } from 'react';
import { FormGroup, FormControl, ControlLabel, Button } from 'react-bootstrap';

class TopicForm extends Component {
    constructor(props) {
        super(props);

        this.state = {
            topic: props.topic
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
            topic: event.target.value
        })
    }

    render() {
        return (
            <FormGroup controlId="topic">
              <ControlLabel>Topic</ControlLabel>
              <FormControl componentClass="select"
                  placeholder="select"
                  value={this.state.topic}
                  onChange={this.handleChange}>
                  <option value="public_transport">Public Transport</option>
                  <option value="sport">Sport</option>
              </FormControl>
              <Button bsStyle="primary"
                  onClick={this.continue}>Next</Button>
            </FormGroup>
        );
    }
}

TopicForm.propTypes = {
    topic: React.PropTypes.string,
    save: React.PropTypes.func.isRequired
};

TopicForm.defaultProps = {
    topic: ''
};

export default TopicForm;
