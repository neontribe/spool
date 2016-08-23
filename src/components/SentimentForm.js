import React, { Component } from 'react';
import { Grid, Row, Col, Button, ButtonToolbar, Image } from 'react-bootstrap';
import _ from 'lodash';

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

    handleChange(value) {
        this.setState({
            value: value
        })
    }

    render() {
        return (
            <Grid>
                <Row>
                    <Col xs={6}>
                        <div
                            className="happy-container"
                            onClick={_.partial(this.handleChange, 'happy')}
                        >
                            <div className={this.state.value === 'happy' ? 'selected-emoji' : ''}>
                                <Image
                                    src="/static/happy.png"
                                    alt="Happy"
                                />
                            </div>
                        </div>
                    </Col>
                    <Col xs={6}>
                        <div
                            className="sad-container"
                            onClick={_.partial(this.handleChange, 'sad')}
                        >
                            <div className={this.state.value === 'sad' ? 'selected-emoji' : ''}>
                                <Image
                                    src="/static/sad.png"
                                    alt="Sad"
                                />
                            </div>
                        </div>
                    </Col>
                </Row>
                <Row>
                    <Col xs={12}>
                        <ButtonToolbar>
                            <Button
                                bsStyle="primary"
                                bsSize="large"
                                onClick={this.continue}
                                disabled={!this.state.value}>Next</Button>
                        </ButtonToolbar>
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
