import React, { Component } from 'react';
import { FormGroup, ControlLabel, Grid, Row, Col } from 'react-bootstrap';
import { IconCard } from './IconCard';

class TopicChooser extends Component {
    constructor(props) {
        super(props);

        this.state = {
            value: props.initialValue
        };

        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(event) {
        // TODO implement multi/solo mode
        var valueExists = this.state.value.indexOf(event.target.value);
        var values = this.state.value.slice(0);
        if (valueExists === -1) {
            values.push(event.target.value);
        } else {
            values.splice(valueExists, 1);
        }

        this.setState({
            value: values
        });

        this.props.onChange(values);
    }

    renderCheckboxes() {
        return this.props.topics.map((t, i) => (
            <Col xs={6} sm={3} key={'col_' + i}>
                <IconCard
                    key={i}
                    onChange={this.handleChange}
                    checked={(this.state.value.indexOf(t.type) !== -1)}
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
                        <Row>
                            <ControlLabel>{this.props.label}</ControlLabel>
                        </Row>
                        {this.renderCheckboxes()}
                    </FormGroup>
                </Row>
            </Grid>
        );
    }
}

TopicChooser.propTypes = {
    initialValue: React.PropTypes.array,
    onChange: React.PropTypes.func,
    topics: React.PropTypes.array,
    saveKey: React.PropTypes.string,
    label: React.PropTypes.string,
    multiselect: React.PropTypes.bool
};

TopicChooser.defaultProps = {
    initialValue: [],
    multiselect: true
};

export default TopicChooser;
