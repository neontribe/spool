import React, { Component } from 'react';
import { FormGroup, ControlLabel, Button, ButtonToolbar, Checkbox, Glyphicon } from 'react-bootstrap';

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
        var valueExists = this.state.value.indexOf(event.target.value);
        var values = this.state.value.slice(0);

        if (valueExists === -1) {
            values.push(event.target.value);
        } else {
            values.splice(valueExists, 1);
        }

        this.setState({
            value: values
        })
    }

    renderCheckboxes() {
        return this.props.topics.map((t, i) => <Checkbox key={i} onChange={this.handleChange} value={t.type}>{t.name}</Checkbox>);
    }

    render() {
        return (
            <FormGroup controlId="topic">
                <ControlLabel>Topic</ControlLabel>

                {this.renderCheckboxes()}

                <ButtonToolbar>
                    <Button
                        onClick={this.continue}
                        disabled={this.state.value.length === 0}
                    ><Glyphicon glyph="chevron-right" /> Next</Button>
                </ButtonToolbar>
            </FormGroup>
        );
    }
}

TopicForm.propTypes = {
    initialValue: React.PropTypes.array,
    save: React.PropTypes.func.isRequired,
    topics: React.PropTypes.array
};

TopicForm.defaultProps = {
    initialValue: [] 
};

export default TopicForm;
