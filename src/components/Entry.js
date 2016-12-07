import React, { Component } from 'react';
import Relay from 'react-relay';
import moment from 'moment';
import _ from 'lodash';

// import EntryViewer from './EntryViewer';

import styles from './css/Entry.module.css';

export class Entry extends Component {
    static colourVariants = [
        { className: styles.entryVariantA, dark: false },
        { className: styles.entryVariantB, dark: false },
        { className: styles.entryVariantC, dark: false },
        { className: styles.entryVariantD, dark: true },
        { className: styles.entryVariantE, dark: false },
        { className: styles.entryVariantF, dark: false },
        { className: styles.entryVariantG, dark: true },
        { className: styles.entryVariantI, dark: false },
        { className: styles.entryVariantJ, dark: true }
    ];

    constructor (props) {
        super(props);

        this.state = {};

        this.showViewer = this.showViewer.bind(this);
        this.hideViewer = this.hideViewer.bind(this);
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
        var entry = this.props.entry;
        var sentiment = entry.sentiment.type;
        var text = entry.media.text;
        var image = entry.media.imageThumbnail;
        var video = entry.media.videoThumbnail;
        var backgroundImage = image || video;
        var styleVariant = styles.entry;
        var randomisedStyle;

        var styleSentiment = (entry.sentiment.type === 'happy')
            ? styles.sentimentHappyLight
            : styles.sentimentSadLight;

        if (text) {
            randomisedStyle = this.constructor.colourVariants[_.random(0, this.constructor.colourVariants.length - 1)];
            styleVariant = randomisedStyle.className;

            if (entry.sentiment.type === 'happy' && randomisedStyle.dark) {
                styleSentiment = styles.sentimentHappy;
            } else if (entry.sentiment.type === 'sad' && randomisedStyle.dark) {
                styleSentiment = styles.sentimentSad;
            }
        }

        return (
            <a
                href='/entry'
                className={styleVariant}
                onClick={this.showViewer}
                style={backgroundImage && { backgroundImage: `url(${backgroundImage})` }}
            >
                <div>
                    {text && (
                        <blockquote className={styles.text}>
                            {text.substring(0, 30)}
                            {(text.length > 30) && '...'}
                        </blockquote>
                    )}

                    {video && (
                        <div className={styles.videoOverlay}>
                            <div className={styles.videoOverlayPlay}></div>
                        </div>
                    )}

                    <div className={styleSentiment}></div>

                    <div className={styles.date}>
                        {moment(entry.created).format('Do MMMM')}
                    </div>

                    <div className={styles.topics}>
                        {this.props.entry.topics.map((t) => t.name).join(' • ')}
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
