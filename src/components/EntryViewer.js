import React, { Component } from 'react';
import Relay from 'react-relay';
import moment from 'moment';

import { EntryContainer } from './Entry';
import Layout from './Layout';
import Grid from './Grid';
import Icon from './Icon';

import styles from './css/EntryViewer.module.css';
import controls from '../css/Controls.module.css';

const { Content, Header } = Layout;


class Paragraph extends Component {
    render() {
        const text = this.props.children;
        const paragraphs = text.split(/\n/).map((text, i) => <p key={i}>{text}</p>)
        return (<div className={styles.text}>{paragraphs}</div>);
    }
}

export default class EntryViewer extends Component {
    render () {
        var entry = this.props.node;

        return (
            <Layout>
                <Header auth={this.props.auth}>
                    <div className={styles.header}>
                        <Icon
                            icon={entry.sentiment.type}
                            light={true}
                        />

                        <ul className={styles.topics}>
                            {entry.topics.map((topic, i) => (
                                <li key={i}>
                                    <Icon
                                        icon={topic.type}
                                        light={true}
                                    />
                                </li>
                            ))}
                        </ul>

                        {/* Todo: Add view counter */}
                        <span>8 views</span>
                    </div>
                </Header>
                <Content>
                    <div className={styles.wrapper}>
                        <Grid enforceConsistentSize={true}>
                            <EntryContainer
                                entry={entry}
                                showSentimentOverlay={false}
                                showTopicOverlay={false}
                            />

                            <div className={styles.contentWrapper}>
                                {entry.media.text && (
                                    <div className={styles.content}>
                                        <Paragraph>{entry.media.text}</Paragraph>
                                    </div>
                                )}

                                {/* Todo: Add router back functionality */}
                                <button className={controls.btnRaised}>Back</button>
                            </div>
                        </Grid>
                    </div>
                </Content>
            </Layout>
        );
    }
}

export const EntryViewerContainer = Relay.createContainer(EntryViewer, {
    fragments: {
        node: () => Relay.QL`
        fragment on Entry {
            id
            media {
                text
            }
            topics {
                type
            }
            sentiment {
                type
            }
            ${EntryContainer.getFragment('entry')}
        }
        `,
    }
});
