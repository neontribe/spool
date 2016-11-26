import React, { Component } from 'react';
import Relay from 'react-relay';
import moment from 'moment';

// import EntryViewer from './EntryViewer';

import styles from './css/Entry.module.css';

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
        return (
            <a href="/entry" className={styles.entry} onClick={this.showViewer}>
                <div>
                    <div>
                        {this.props.entry.media.text && (
                            <blockquote>{this.props.entry.media.text}</blockquote>
                        )}
                    </div>

                    <div className={styles.sentiment}>
                        {(this.props.entry.sentiment.type === 'happy') ? '😄' : '😡'}
                    </div>

                    <div>
                        <div>{this.formatTimestamp()}</div>
                        <div>{this.props.entry.topics.map((t) => t.name).join(', ')}</div>
                    </div>

                    {/*this.props.withViewer && (
                        <Modal
                            show={this.state.showEntryViewer}
                            bsSize="large"
                            backdrop={true}
                            onHide={this.hideViewer}
                        >
                            <EntryViewer entry={this.props.entry} />
                        </Modal>
                    )*/}
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
