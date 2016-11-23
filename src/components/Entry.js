import React, { Component } from 'react';
import Relay from 'react-relay';
import moment from 'moment';

import EntryViewer from './EntryViewer';

export class Entry extends Component {
    constructor (props) {
        super(props);

        this.state = {};

        this.showViewer = this.showViewer.bind(this);
        this.hideViewer = this.hideViewer.bind(this);
    }

    formatTimestamp () {
        return moment(this.props.entry.created).fromNow();
    }

    showViewer (e) {
        e.preventDefault();

        if (this.props.withViewer) {
            this.setState({
                showEntryViewer: true
            });
        }
    }

    hideViewer () {
        this.setState({
            showEntryViewer: false
        });
    }

    render () {
        // var hasMedia = this.props.entry.media.image || this.props.entry.media.video;
        // var className = 'entry entry--' + this.props.entry.sentiment.type;

        return (
            <a href="/entry" onClick={this.showViewer}>
                <div>
                    <div>
                        {this.props.entry.media.text && (
                            <blockquote>{this.props.entry.media.text}</blockquote>
                        )}
                    </div>

                    <img
                        src={'/static/' + this.props.entry.sentiment.type + '.png'}
                        alt={this.props.entry.sentiment.type}
                    />

                    <div>
                        <div>{this.formatTimestamp()}</div>
                        <div>{this.props.entry.topics.map((t) => t.name).join(', ')}</div>
                    </div>

                    {/*<Modal
                        show={this.state.showEntryViewer}
                        bsSize="large"
                        backdrop={true}
                        onHide={this.hideViewer}
                    >*/}
                    {this.props.withViewer && (
                        <div>
                            <EntryViewer entry={this.props.entry} />
                        </div>
                    )}
                </div>
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
            media {
                text
                video
                videoThumbnail
                image
                imageThumbnail
            }
            topics {
                name
            }
            sentiment {
                type
            },
            created
            updated
        }`,
    }
});
