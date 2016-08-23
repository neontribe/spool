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

    renderOptions() {
        return this.props.topics.map((t, i) => <option key={i} value={t.type}>{t.name}</option>);
    }

    render() {
        return (
            <FormGroup controlId="topic">
              <ControlLabel>Topic</ControlLabel>
              <FormControl componentClass="select"
                  placeholder="select"
                  value={this.state.value}
                  onChange={this.handleChange}>
                  {this.renderOptions()};
              </FormControl>
              <Button bsStyle="primary" bsSize="large" block
                  onClick={this.continue}
                  disabled={!this.state.value}>Next</Button>
            </FormGroup>
        );
    }
}

TopicForm.propTypes = {
    initialValue: React.PropTypes.string,
    save: React.PropTypes.func.isRequired,
    topics: React.PropTypes.array
};

TopicForm.defaultProps = {
    initialValue: ''
};

export default TopicForm;
