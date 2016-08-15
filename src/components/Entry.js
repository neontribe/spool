import React, { Component } from 'react';
import { Grid, Row, Col, Image } from 'react-bootstrap';

class Entry extends Component {
    render() {
        return (
            <Grid>
                <Row>
                    <Col xs={6}>
                        <blockquote>{this.props.media.content}</blockquote>
                    </Col>
                    <Col xs={1}>
                        {this.props.topic.map((topic, i) => {
                            return (<span key={i}>{topic}</span>);
                        })}
                    </Col>
                    <Col xs={1}>
                        <Image src={'/static/emoji/' + this.props.sentiment + '.svg'} responsive
                                alt={this.props.sentiment}/>
                    </Col>
                </Row>
            </Grid>
        );
    }
}

Entry.propTypes = {
    media: React.PropTypes.object.isRequired,
    author: React.PropTypes.string,
    owner: React.PropTypes.string,
    sentiment: React.PropTypes.string,
    topic: React.PropTypes.array,
};

export default Entry
