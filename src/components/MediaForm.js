import React, { Component } from 'react';
import { Grid, Row, Col, Button } from 'react-bootstrap';

class MediaForm extends Component {
    constructor(props) {
        super(props);

        this.state = this.props.media;
    }

    render() {
        return (
            <Grid>
                <Row>
                    <Col xs={6}>
                        <Button>Video</Button>
                    </Col>
                    <Col xs={6}>
                        <Button>Image</Button>
                    </Col>
                </Row>
                <Row>
                    <Col xs={3}>
                    </Col>
                    <Col xs={6}>
                        <Button>Text</Button>
                    </Col>
                    <Col xs={3}>
                    </Col>
                </Row>
            </Grid>
        );
    }
}

MediaForm.propTypes = {
    media: React.PropTypes.object
};

MediaForm.defaultProps = {
    media: {
        text: null,
        image: null,
        video: null,
        type: null,
        thumbnail: null
    }
}

export default MediaForm;
