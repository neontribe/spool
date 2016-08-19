import React, { Component } from 'react';
import { Grid, Row, Col, Button, Glyphicon } from 'react-bootstrap';
import _ from 'lodash';

class MediaTypeChooser extends Component {

    render() {
        return (
            <Grid>
                /*<Row>
                    <Col xs={3}></Col>
                    <Col xs={6}>
                        <Button bsSize="large" block
                            onClick={_.partial(this.props.save, 'video')}>
                            <Glyphicon glyph="film"/> Video
                        </Button>
                    </Col>
                    <Col xs={3}></Col>
                </Row>
                <Row>
                    <Col xs={3}></Col>
                    <Col xs={6}>
                        <Button bsSize="large" block
                            onClick={_.partial(this.props.save, 'image')}>
                            <Glyphicon glyph="camera"/> Image
                        </Button>
                    </Col>
                    <Col xs={3}></Col>
                </Row>*/
                <Row>
                    <Col xs={3}></Col>
                    <Col xs={6}>
                        <Button bsSize="large" block
                            onClick={_.partial(this.props.save, 'text')}>
                            <Glyphicon glyph="pencil"/> Text
                        </Button>
                    </Col>
                    <Col xs={3}></Col>
                </Row>
            </Grid>
        );
    }
}

MediaTypeChooser.propTypes = {
    save: React.PropTypes.func.isRequired
};

export default MediaTypeChooser;
