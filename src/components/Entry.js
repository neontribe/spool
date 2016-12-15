import React, { Component } from 'react';
import Relay from 'react-relay';
import { Link } from 'react-router';
import moment from 'moment';
import _ from 'lodash';
import rand from 'random-seed';

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

        this.state = {
            showOverlay: true
        };

        this.showViewer = this.showViewer.bind(this);
        this.hideViewer = this.hideViewer.bind(this);
        this.toggleVideoPlay = this.toggleVideoPlay.bind(this);
    }

    componentDidMount () {
        if (this.refs && this.refs.video) {
            this.refs.video.onplaying = () => {
                this.setState({
                    showOverlay: false
                });
            };

            // this.refs.video.onpause
            this.refs.video.onended = () => {
                this.setState({
                    showOverlay: true
                });
            };
        }
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

    toggleVideoPlay () {
        var video = this.refs.video;

        if (video.paused) {
            video.play();
        } else {
            video.pause();
        }
    }

    renderEntry (entry, randomisedStyle, isTextEntry, lightIcon) {
        return (
            <div>
                {isTextEntry && (
                    <blockquote className={styles.text}>
                        {entry.media.text.substring(0, 30)}
                        {(entry.media.text.length > 30) && '...'}
                    </blockquote>
                )}

                {entry.media.video && (
                    <div className={styles.videoOverlay}>
                        {this.state.showOverlay && (
                            <div className={styles.videoOverlayPlay}></div>
                        )}

                        {!this.props.thumbnailMode && (
                            <video
                                className={styles.video}
                                ref='video'
                                src={entry.media.video}
                                controls={true}
                                autoPlay={true}
                                onClick={!this.props.thumbnailMode && this.toggleVideoPlay}
                            />
                        )}
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

                {this.props.thumbnailMode && (
                    <div className={styles.date}>
                        Created {moment(entry.created).format('Do MMMM')}
                    </div>
                )}

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
        );
    }

    render () {
        var entry = this.props.entry;
        var isTextEntry = entry.media.text && !entry.media.image && !entry.media.video;
        var styleVariant = styles.entry;
        var randomisedStyle;
        var backgroundImage;
        var lightIcon = true;

        if (isTextEntry) {
            randomisedStyle = this.constructor.colourVariants[(new rand(entry.id)).range(this.constructor.colourVariants.length - 1)];

            styleVariant = randomisedStyle.className;

            if (randomisedStyle.dark) {
                lightIcon = false;
            }
        } else if (entry.media.imageThumbnail) {
            backgroundImage = entry.media.imageThumbnail;
        } else if (entry.media.video && this.props.thumbnailMode) {
            backgroundImage = entry.media.videoThumbnail;
        }

        var props = {
            className: styleVariant
        };

        if (backgroundImage) {
            props.style = {
                backgroundImage: `url(${backgroundImage})`
            }
        }

        if (this.props.thumbnailMode) {
            return (
                <Link
                    {...props}
                    to={`/entry/${entry.id}`}
                >{this.renderEntry(entry, randomisedStyle, isTextEntry, lightIcon)}</Link>
            );            
        }

        return (
            <div {...props}>{this.renderEntry(entry, randomisedStyle, isTextEntry, lightIcon)}</div>
        );
    }
}

Entry.propTypes = {
    thumbnailMode: React.PropTypes.bool,
    entry: React.PropTypes.object.isRequired,
    showSentimentOverlay: React.PropTypes.bool,
    showTopicOverlay: React.PropTypes.bool,
    withViewer: React.PropTypes.bool
}

Entry.defaultProps = {
    thumbnailMode: false,
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
