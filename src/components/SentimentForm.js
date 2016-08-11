import React, { Component } from 'react';
import { Grid, Row, Col, Jumbotron, ButtonGroup, Button } from 'react-bootstrap';

class SentimentForm extends Component {
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
            <Grid>
                <Row>
                    <Col>
                        <ButtonGroup bsSize="large">
                              <Button value="happy"
                                  bsStyle="success"
                                  active={this.state.value === 'happy'}
                                  onClick={this.handleChange}>Happy</Button>
                              <Button value="sad"
                                  bsStyle="danger"
                                  active={this.state.value === 'sad'}
                                  onClick={this.handleChange}>Sad</Button>
                        </ButtonGroup>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <Button bsStyle="primary" bsSize="large" block
                            onClick={this.continue}
                            disabled={!this.state.value}>Next</Button>
                    </Col>
                </Row>
            </Grid>

        );
    }
}

SentimentForm.propTypes = {
    initialValue: React.PropTypes.string,
    save: React.PropTypes.func.isRequired
};

SentimentForm.defaultProps = {
    initialValue: ''
};

export default SentimentForm;
