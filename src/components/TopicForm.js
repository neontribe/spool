import React, { Component } from 'react';
import { Grid, Row, Col } from 'react-bootstrap';
import AddControls from './AddControls';
import IconChooser from './IconChooser';

class TopicForm extends Component {
    constructor(props) {
        super(props);

        this.state = {
            value: props.initialValue
        };

        this.continue = this.continue.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    continue() {
        this.props.save(this.props.saveKey, this.state.value);
    }

    handleChange(value) {
        this.setState({ value })
    }

    render() {
        return (


                <Grid>
                    <Row>
                        <IconChooser
                            label="Add some labels..."
                            choices={this.props.topics}
                            onChange={this.handleChange}
                            initialValue={this.props.initialValue} />
                    </Row>
                    <Row>
                        <Col>
                            <AddControls
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
    saveKey: 'topics'
};

export default TopicForm;
