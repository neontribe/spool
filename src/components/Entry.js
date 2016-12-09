import React, { Component } from 'react';
import Relay from 'react-relay';
import { Link } from 'react-router';
import moment from 'moment';
import _ from 'lodash';

// import EntryViewer from './EntryViewer';
import Icon from './Icon';

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

        var lightIcon = true;

        if (text) {
            randomisedStyle = this.constructor.colourVariants[_.random(0, this.constructor.colourVariants.length - 1)];
            styleVariant = randomisedStyle.className;

            if (randomisedStyle.dark) {
                lightIcon = false;
            }
        }

        return (
            <Link
                to={`/entry/${entry.id}`}
                className={styleVariant}
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

                    {this.props.showSentimentOverlay && (
                        <Icon
                            icon={entry.sentiment.type}
                            light={lightIcon}
                            size={4}
                            className={styles.sentiment}
                        />
                    )}

                    <div className={styles.date}>
                        Created {moment(entry.created).format('Do MMMM')}
                    </div>

                    {this.props.showTopicOverlay && (
                        <ul className={styles.topics}>
                            {entry.topics.map((topic, i) => (
                                <li key={i}>
                                    <Icon
                                        icon={topic.type}
                                        light={lightIcon}
                                    />
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </Link>
        );
    }
}

Entry.propTypes = {
    entry: React.PropTypes.object.isRequired,
    showSentimentOverlay: React.PropTypes.bool,
    showTopicOverlay: React.PropTypes.bool,
    withViewer: React.PropTypes.bool
}

Entry.defaultProps = {
    showSentimentOverlay: true,
    showTopicOverlay: true,
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
                type
            }
            sentiment {
                type
            },
            created
            updated
        }`,
    }
});
