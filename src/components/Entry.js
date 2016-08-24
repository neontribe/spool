import React, { Component } from 'react';
import Relay from 'react-relay';
import { Image, Modal } from 'react-bootstrap';
import EntryViewer from './EntryViewer';
import moment from 'moment';

export class Entry extends Component {
    constructor(props) {
        super(props);

        this.state = {};

        this.getStyles = this.getStyles.bind(this);
        this.showViewer = this.showViewer.bind(this);
        this.hideViewer = this.hideViewer.bind(this);
    }

    formatTimestamp() {
        return moment(this.props.entry.timestamp).fromNow();
    }

    getStyles() {
        return this.props.entry.media.thumbnail
            ? { backgroundImage: 'url('+this.props.entry.media.videoThumbnail || this.props.entry.media.imageThumbnail+')' }
            : {};
    }

    showViewer() {
        if (this.props.withViewer) {
            this.setState({showEntryViewer: true});
        }
    }

    hideViewer() {
        this.setState({showEntryViewer: false});
    }

    render() {
        return (
            <a href="#" className={'entry entry--' + this.props.entry.sentiment.type}>
                <div onClick={this.showViewer} style={this.getStyles()}>
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
                { this.props.withViewer &&
                    <Modal
                        show={this.state.showEntryViewer}
                        bsSize="large"
                        backdrop={true}
                        onHide={this.hideViewer}
                    >
                        <EntryViewer entry={this.props.entry} />
                    </Modal>
                }
            </a>
        );
    }
}

Entry.propTypes = {
    entry: React.PropTypes.object.isRequired,
    withViewer: React.PropTypes.bool
}

Entry.defaultProps = {
    withViewer: true
}

export const EntryContainer = Relay.createContainer(Entry, {
    fragments: {
        entry: () => Relay.QL`
        fragment on Entry {
            id
            _id
            media {
                text
                video
                videoThumbnail
                image
                imageThumbnail
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
