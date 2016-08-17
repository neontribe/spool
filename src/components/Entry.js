import React, { Component } from 'react';
import Relay from 'react-relay';
import { Grid, Row, Col, Image } from 'react-bootstrap';

export class Entry extends Component {
    static propTypes = {
        entry: React.PropTypes.object.isRequired
    }
    render() {
        return (
            <Grid>
                <Row>
                    <Col xs={6}>
                        <blockquote>{this.props.entry.media.text}</blockquote>
                    </Col>
                    <Col xs={1}>
                        <span>{this.props.entry.topic.type}</span>
                    </Col>
                    <Col xs={1}>
                        <Image src={'/static/emoji/' + this.props.entry.sentiment.type + '.svg'} responsive
                                alt={this.props.entry.sentiment.type}/>
                    </Col>
                </Row>
            </Grid>
        );
    }
}

export const EntryContainer = Relay.createContainer(Entry, {
    fragments: {
        entry: () => Relay.QL`
        fragment on Entry {
            id
            _id
            media {
                ... on TextMedia {
                    text
                }
            }
            topic {
                type
            }
            sentiment {
                type
            }
        }`,
    }
});
