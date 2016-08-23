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
                    <Col xs={12}>
                        <div className={'entry entry--' + this.props.entry.sentiment.type}>
                            <div className='entry-overlay'></div>
                            <div className='entry-content'>
                                <Image
                                    src={'/static/' + this.props.entry.sentiment.type + '.png'}
                                    alt={this.props.entry.sentiment.type}
                                    responsive
                                />
                                <div>
                                    <div className="entry--time">0 minutes ago</div>
                                    <blockquote className={'entry--quote entry--quote-' + this.props.entry.sentiment.type}>{this.props.entry.media.text}</blockquote>
                                    <div className="entry--tags">
                                        <span className="entry--tag">{this.props.entry.topic.type}</span>
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
