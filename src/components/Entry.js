import React, { Component } from 'react';
import Relay from 'react-relay';
import { Grid, Row, Col, Image } from 'react-bootstrap';
import moment from 'moment';

export class Entry extends Component {
    static propTypes = {
        entry: React.PropTypes.object.isRequired
    }
    formatTimestamp() {
        return moment(this.props.entry.timestamp).format('dddd, MMMM Do YYYY, h:mm:ss a');
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
                    <Col xs={4}>
                        <span>{this.formatTimestamp()}</span>
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
                __typename
                ... on TextMedia {
                    text
                }
                ... on VideoMedia {
                    video
                    thumbnail
                }
            }
            topic {
                type
            }
            sentiment {
                type
            },
            timestamp
        }`,
    }
});
