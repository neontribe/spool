import React, { Component } from 'react';
import { Grid, Row, Col, Image, ResponsiveEmbed } from 'react-bootstrap';
import moment from 'moment';

class EntryViewer extends Component {
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
            <div className='entry-viewer'>
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
                    <Row>
                        <Col xs={12}>
                            { this.props.entry.media.video &&
                                <ResponsiveEmbed a4by3>
                                    <video
                                        src={this.props.entry.media.video}
                                        controls
                                        autoPlay
                                    />
                                </ResponsiveEmbed>
                            }
                            { this.props.entry.media.image &&
                                <ResponsiveEmbed a4by3>
                                    <Image
                                        src={this.props.entry.media.image}
                                        alt={this.props.entry.media.text || this.props.entry.topic.type}
                                    />
                                </ResponsiveEmbed>
                            }
                        </Col>
                    </Row>
                </Grid>
            </div>
        );
    }
}

EntryViewer.propTypes = {
    entry: React.PropTypes.object.isRequired
}

export default EntryViewer;
