import React, { Component } from 'react';
import Relay from 'react-relay';
import { Grid, Row, Col, Image } from 'react-bootstrap';
import moment from 'moment';

export class Entry extends Component {
    constructor(props) {
        super(props);

        this.getStyles = this.getStyles.bind(this);
    }

    formatTimestamp() {
        return moment(this.props.entry.timestamp).fromNow();
    }

    getStyles() {
        return this.props.entry.media.thumbnail
            ? { backgroundImage: 'url('+this.props.entry.media.thumbnail+')' }
            : {};
    }

    render() {
        return (
            <Grid>
                <Row>
                    <Col xs={12}>
                        <div className={'entry entry--' + this.props.entry.sentiment.type} style={this.getStyles()}>
                            <div className='entry-overlay'></div>
                            <div className='entry-content'>
                                <Image
                                    src={'/static/' + this.props.entry.sentiment.type + '.png'}
                                    alt={this.props.entry.sentiment.type}
                                    responsive
                                />
                                <div>
                                    <div className="entry--time">{this.formatTimestamp()}</div>
                                    { this.props.entry.media.text &&
                                        <blockquote className={'entry--quote entry--quote-' + this.props.entry.sentiment.type}>{this.props.entry.media.text}</blockquote>
                                    }
                                    <div className="entry--tags">
                                        <span className="entry--tag">{this.props.entry.topic.map((t) => t.name).join(' ')}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Col>
                </Row>
            </Grid>
        );
    }
}

Entry.propTypes = {
    entry: React.PropTypes.object.isRequired
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
                name
            }
            sentiment {
                type
            },
            timestamp
        }`,
    }
});
