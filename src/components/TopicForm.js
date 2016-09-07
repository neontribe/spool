import React, { Component } from 'react';
import { FormGroup, ControlLabel, Grid, Row, Col } from 'react-bootstrap';
import AddEntryControls from './AddEntryControls';
import { IconCard } from './IconCard';

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

        this.props.save(this.props.saveKey, this.state.value);
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
        return this.props.topics.map((t, i) => (
            <Col xs={6} sm={3}>
                <IconCard
                    key={i}
                    onChange={this.handleChange}
                    icon={t.type}
                    message={t.name}
                    value={t.type} />
            </Col>
        ));
    }

    render() {
        return (


                <Grid>
                    <Row>
                        <FormGroup controlId="topic" className='topics'>
                            <ControlLabel>Add some labels...</ControlLabel>
                            {this.renderCheckboxes()}
                        </FormGroup>
                    </Row>
                    <Row>
                        <Col>
                            <AddEntryControls
                                onNext={this.continue}
                                disableNext={this.state.value.length === 0}
                                />
                        </Col>
                    </Row>
                </Grid>
        );
    }
}

TopicForm.propTypes = {
    initialValue: React.PropTypes.array,
    save: React.PropTypes.func,
    topics: React.PropTypes.array,
    saveKey: React.PropTypes.string
};

TopicForm.defaultProps = {
    initialValue: [],
    saveKey: 'topic'
};

export default TopicForm;
