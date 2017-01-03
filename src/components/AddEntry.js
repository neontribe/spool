import React, { Component } from 'react';
import Relay from 'react-relay';
import _ from 'lodash';
import { withRouter } from 'react-router';

import Layout from './Layout';
import Icon from './Icon';
import AddEntryMutation from './mutations/AddEntryMutation';
import { withRoles, userFragment } from './wrappers.js';

import TopicForm from './TopicForm';
import SentimentForm from './SentimentForm';
import MediaForm from './MediaForm';

import styles from './css/AddEntry.module.css';
const { Content, Header } = Layout;

class AddEntry extends Component {
    static ABOUT = 'ENTRY/ABOUT';
    static SENTIMENT = 'ENTRY/SENTIMENT';
    static MEDIA = 'ENTRY/MEDIA';

    constructor (props) {
        super(props);

        this.state = {
            entry: props.entry,
            form: AddEntry.ABOUT
        }

        const { ABOUT, SENTIMENT, MEDIA } = AddEntry;

        this.transitions = {
            [ABOUT]: (key, value) => {
                this.setEntryData(key, value);
                this.setState({
                    form: SENTIMENT
                })
            },
            [SENTIMENT]: (key, value) => {
                this.setEntryData(key, value);
                this.setState({
                    form: MEDIA
                })
            },
            [MEDIA]: (key, value) => {
                this.setEntryData(key, value, true);
            }
        };

        this.handleMediaTypeChange = this.handleMediaTypeChange.bind(this);
    }

    saveEntry (entry) {
        var creator = this.props.creator;

        var onSuccess = () => {
            this.props.router.push('/app/home');
        }

        this.props.relay.commitUpdate(
            new AddEntryMutation({
                creator,
                entry
            }),
            {
                onSuccess
            }
        );
    }

    setEntryData (key, value, save) {
        var entry = _.merge({}, this.state.entry, { [key]: value });

        this.setState({
            entry
        });

        if (save) {
            this.saveEntry(entry);
        }
    }

    handleMediaTypeChange (type) {
        this.setState({
            mediaType: type
        });
    }

    renderForm () {
        const { ABOUT, SENTIMENT, MEDIA } = AddEntry;

        switch (this.state.form) {
            default:
            case ABOUT:
                return <TopicForm save={this.transitions[ABOUT]} topics={this.props.creator.topics} />;

            case SENTIMENT:
                return <SentimentForm save={this.transitions[SENTIMENT]} />;

            case MEDIA:
                return <MediaForm save={this.transitions[MEDIA]} onMediaTypeChange={this.handleMediaTypeChange} />;
        }
    }

    render () {
        return (
            <Layout className={styles.wrapper}>
                <Header auth={this.props.auth}>
                    {this.state.entry && (
                        <div className={styles.header}>
                            <div className={styles.stepComplete}>
                                {(this.state.entry.topics) ? (
                                    <ol className={styles.topics}>
                                        {this.state.entry.topics.map((topic, i) => (
                                            <li key={i}>
                                                <Icon
                                                    icon={topic}
                                                    light={true}
                                                />
                                            </li>
                                        ))}
                                    </ol>
                                ) : '1. Topic'}
                            </div>

                            <div className={(this.state.entry.sentiment && styles.stepComplete) || undefined}>
                                {(this.state.entry.sentiment) ? (
                                    <Icon
                                        icon={this.state.entry.sentiment}
                                        light={true}
                                    />
                                ) : '2. Sentiment'}
                            </div>

                            <div className={(this.state.mediaType && styles.stepComplete) || undefined}>
                                {(this.state.mediaType) ? (
                                    <Icon
                                        icon={this.state.mediaType}
                                        light={true}
                                    />
                                ) : '3. Media type'}
                            </div>
                        </div>
                    )}
                </Header>
                <Content>{this.renderForm()}</Content>
            </Layout>
        );
    }
};

AddEntry.propTypes = {
    entry: React.PropTypes.object
}

AddEntry.defaultProps = {
    entry: {}
}

AddEntry = withRouter(AddEntry);

export default AddEntry;

export const AddEntryContainer = Relay.createContainer(withRoles(AddEntry, ['creator']), {
    fragments: {
        user: () => Relay.QL`
        fragment on User {
                ${userFragment}
        }`,
        creator: () => Relay.QL`
            fragment on Creator {
                id
                topics {
                    type,
                    name
                }
                ${AddEntryMutation.getFragment('creator')}
            }
        `,
    }
});
