import React, { Component } from 'react';
import { Grid, Row, Col, Button, ButtonGroup, Glyphicon } from 'react-bootstrap';
import _ from 'lodash';

class MediaTypeChooser extends Component {

    render() {
        return (
            <Grid>
                <Row>
                    <Col xs={12}>
                        <ButtonGroup>
                            <Button bsSize="large"
                                onClick={_.partial(this.props.save, 'text')}>
                                <Glyphicon glyph="pencil"/> Text
                            </Button>
                            <Button bsSize="large"
                                onClick={_.partial(this.props.save, 'video')}>
                                <Glyphicon glyph="film"/> Video
                            </Button>
                        </ButtonGroup>
                    </Col>
                </Row>
            </Grid>
        );
    }
}

MediaTypeChooser.propTypes = {
    save: React.PropTypes.func.isRequired
};

export default MediaTypeChooser;
