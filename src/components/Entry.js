import React, { Component } from 'react';
import Relay from 'react-relay';
import moment from 'moment';
import _ from 'lodash';

// import EntryViewer from './EntryViewer';

import styles from './css/Entry.module.css';

export class Entry extends Component {
    static colourVariants = [
        styles.entryVariantA,
        styles.entryVariantB,
        styles.entryVariantC,
        styles.entryVariantD,
        styles.entryVariantE,
        styles.entryVariantF,
        styles.entryVariantG,
        styles.entryVariantI,
        styles.entryVariantJ
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
        var created = moment(this.props.entry.created);
        var text = this.props.entry.media.text;

        var styleVariant = (text)
            ? this.constructor.colourVariants[_.random(0, this.constructor.colourVariants.length - 1)]
            : styles.entry;

        return (
            <a href="/entry" className={styleVariant} onClick={this.showViewer}>
                <div>
                    <div>
                        {text && (
                            <blockquote className={styles.text}>
                                {text.substring(0, 30)}
                                {(text.length > 30) && '...'}
                            </blockquote>
                        )}
                    </div>

                    <div className={styles.sentiment}>
                        {(this.props.entry.sentiment.type === 'happy') ? '😄' : '😡'}
                    </div>

                    <div className={styles.date}>
                        {created.format('Do MMMM')}
                    </div>

                    <div className={styles.topics}>
                        {this.props.entry.topics.map((t) => t.name).join(', ')}
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
