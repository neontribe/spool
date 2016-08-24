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
        var thumb = this.props.entry.media.videoThumbnail || this.props.entry.media.imageThumbnail;
        return (thumb)
            ? { backgroundImage: 'url('+ thumb + ')' }
            : {};
    }

    showViewer(e) {
        e.preventDefault();
        if (this.props.withViewer) {
            this.setState({showEntryViewer: true});
        }
    }

    hideViewer() {
        this.setState({showEntryViewer: false});
    }

    render() {
        var hasMedia = this.props.entry.media.image || this.props.entry.media.video;
        var className = 'entry entry--' + this.props.entry.sentiment.type;

        if (hasMedia) {
            className += ' entry--has-media';
        }

        return (
            <div className={className} style={this.getStyles()}>
                <a href="./view-full-entry" onClick={this.showViewer} className='entry-content'>
                    { this.props.entry.media.text &&
                        <blockquote className={'entry--quote entry--quote-' + this.props.entry.sentiment.type}>{this.props.entry.media.text}</blockquote>
                    }

                    <Image
                        src={'/static/' + this.props.entry.sentiment.type + '.png'}
                        alt={this.props.entry.sentiment.type}
                    />

                    <div className='entry--meta'>
                        <div className="entry--time">{this.formatTimestamp()}</div>
                        <div className="entry--tags">
                            <span className="entry--tag">{this.props.entry.topic.map((t) => t.name).join(' ')}</span>
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
            </div>
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
