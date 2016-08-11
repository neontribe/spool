import React, { Component } from 'react';
import { Grid, Row, Col, ButtonGroup, Button, Image } from 'react-bootstrap';
import happy from './assets/emoji/happy.svg';
import sad from './assets/emoji/sad.svg';
import './SentimentForm.css';
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
                        <Image src={happy} responsive className={this.state.value === 'happy' ? 'selected' : ''}
                            alt="Happy"
                            onClick={_.partial(this.handleChange, 'happy')}/>
                    </Col>
                    <Col xs={6}>
                        <Image src={sad} responsive className={this.state.value === 'sad' ? 'selected' : ''}
                            alt="Sad"
                            onClick={_.partial(this.handleChange, 'sad')}/>
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
