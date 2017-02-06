import React, { Component } from 'react';
import Relay from 'react-relay';
import { Link } from 'react-router';
import moment from 'moment';
import rand from 'random-seed';

import Icon from './Icon';

import styles from './css/Entry.module.css';

export class Entry extends Component {
    static ColourVariants = [
        { className: styles.entryVariantA, dark: false },
        { className: styles.entryVariantB, dark: true },
        { className: styles.entryVariantC, dark: false },
        { className: styles.entryVariantD, dark: true }
    ];

    static propTypes = {
        thumbnailMode: React.PropTypes.bool,
        entry: React.PropTypes.object.isRequired,
        showSentimentOverlay: React.PropTypes.bool,
        showTopicOverlay: React.PropTypes.bool,
        withViewer: React.PropTypes.bool
    }

    static defaultProps = {
        thumbnailMode: false,
        showSentimentOverlay: true,
        showTopicOverlay: true,
        withViewer: true
    }

    constructor (props) {
        super(props);

        this.state = {
            showThumbnail: true
        };

        this.showViewer = this.showViewer.bind(this);
        this.hideViewer = this.hideViewer.bind(this);
        this.toggleVideoPlay = this.toggleVideoPlay.bind(this);
        this.hideThumbnail = this.hideThumbnail.bind(this);
    }

    // componentDidMount () {
    //     if (this.refs && this.refs.video) {
    //         this.refs.video.onplaying = () => {
    //             this.setState({
    //                 showOverlay: false
    //             });
    //         };

    //         // this.refs.video.onpause
    //         this.refs.video.onended = () => {
    //             this.setState({
    //                 showOverlay: true
    //             });
    //         };
    //     }
    // }

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

    hideThumbnail () {
        this.setState({
            showThumbnail: false
        });

        this.toggleVideoPlay();
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
                        {(this.props.thumbnailMode || this.state.showThumbnail) && (
                            <div
                                className={styles.videoOverlayPlayWrapper}
                                onClick={(!this.props.thumbnailMode) ? this.hideThumbnail : Function.prototype}
                            >
                                <div className={styles.videoOverlayPlay}></div>
                            </div>
                        )}

                        {!this.props.thumbnailMode && (
                            <video
                                className={(this.state.showThumbnail) ? styles.videoHidden : styles.video}
                                ref='video'
                                src={entry.media.video}
                                controls={true}
                                autoPlay={false}
                                onClick={!this.props.thumbnailMode && this.toggleVideoPlay}
                            />
                        )}
                    </div>
                )}

                {this.props.showSentimentOverlay && (
                    <Icon
                        icon={entry.sentiment.type}
                        small={true}
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
                            <li key={i} className={styles.topic}>
                                <Icon
                                    icon={topic.type}
                                    small={true}
                                />
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        );
    }

    getBackgroundImage (entry) {
        var isTextEntry = entry.media.text && !entry.media.image && !entry.media.video;

        if (isTextEntry) {
            return;
        }

        if (entry.media.imageThumbnail) {
            return entry.media.imageThumbnail;
        } else if (entry.media.video) {
            return entry.media.videoThumbnail;
        }
    }

    render () {
        var entry = this.props.entry;
        var isTextEntry = entry.media.text && !entry.media.image && !entry.media.video;
        var styleVariant = styles.entry;
        var randomisedStyle;
        var backgroundImage = this.getBackgroundImage(entry);
        var lightIcon = true;

        if (isTextEntry) {
            // eslint-disable-next-line new-cap
            randomisedStyle = this.constructor.ColourVariants[(new rand(entry.id)).range(this.constructor.ColourVariants.length - 1)];

            styleVariant = randomisedStyle.className;

            if (randomisedStyle.dark) {
                lightIcon = false;
            }
        }

        var props = {
            className: styleVariant
        };

        if (this.state.showThumbnail && backgroundImage) {
            props.style = {
                backgroundImage: `url(${backgroundImage})`
            };
        }

        if (this.props.thumbnailMode) {
            return (
                <Link
                    {...props}
                    to={`/app/entry/${entry.id}`}
                >{this.renderEntry(entry, randomisedStyle, isTextEntry, lightIcon)}</Link>
            );
        }

        return (
            <div {...props}>{this.renderEntry(entry, randomisedStyle, isTextEntry, lightIcon)}</div>
        );
    }
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
            }
            created
            updated
        }`
    }
});
