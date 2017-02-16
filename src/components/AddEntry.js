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
import PageOverlay from './PageOverlay';

import styles from './css/AddEntry.module.css';

const { Content, Header } = Layout;

class AddEntry extends Component {
    static ABOUT = 'ENTRY/ABOUT';
    static SENTIMENT = 'ENTRY/SENTIMENT';
    static MEDIA = 'ENTRY/MEDIA';

    static propTypes = {
        entry: React.PropTypes.object
    }

    static defaultProps = {
        entry: {}
    }

    constructor (props) {
        super(props);

        this.state = {
            entry: props.entry,
            form: AddEntry.ABOUT,
            saving: false
        };

        const { ABOUT, SENTIMENT, MEDIA } = AddEntry;

        this.transitions = {
            [ABOUT]: (key, value) => {
                this.setEntryData(key, value);
                this.setState({
                    form: SENTIMENT
                });
            },
            [SENTIMENT]: (key, value) => {
                this.setEntryData(key, value);
                this.setState({
                    form: MEDIA
                });
            },
            [MEDIA]: (key, value) => {
                this.setEntryData(key, value, true);
            }
        };

        this.handleMediaTypeChange = this.handleMediaTypeChange.bind(this);
        this.onSaveStart = this.onSaveStart.bind(this);
    }

    onSaveStart () {
        this.setState({
            saving: true
        });
    }

    saveEntry (entry) {
        var creator = this.props.creator;

        var onSuccess = () => {
            this.setState({
                saving: false
            });

            this.props.router.push('/app/home');
        };

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
                    return <MediaForm onSaveStart={this.onSaveStart} onSaveEnd={this.transitions[MEDIA]} onMediaTypeChange={this.handleMediaTypeChange} />;
        }
    }

    render () {
        return (
            <Layout className={styles.wrapper}>
                <Header auth={this.props.auth} user={this.props.user}>
                    {this.state.entry && (
                        <div className={styles.header}>
                            <div className={styles.stepComplete}>
                                {(this.state.entry.topics) ? (
                                    <ul className={styles.topics}>
                                        {this.state.entry.topics.map((topic, i) => (
                                            <li key={i}>
                                                <Icon
                                                    icon={topic}
                                                    small={true}
                                                />
                                            </li>
                                        ))}
                                    </ul>
                                ) : '1. Topic'}
                            </div>

                            <div className={(this.state.entry.sentiment && styles.stepComplete) || undefined}>
                                {(this.state.entry.sentiment) ? (
                                    <Icon
                                        icon={this.state.entry.sentiment}
                                        small={true}
                                    />
                                ) : '2. Feeling'}
                            </div>

                            <div className={(this.state.mediaType && styles.stepComplete) || undefined}>
                                {(this.state.mediaType) ? (
                                    <Icon
                                        icon={this.state.mediaType}
                                        small={true}
                                    />
                                ) : '3. Explain'}
                            </div>
                        </div>
                    )}
                </Header>
                <Content>
                    {this.state.saving && <PageOverlay title='Saving.' />}
                    {this.renderForm()}
                </Content>
            </Layout>
        );
    }
};

// AddEntry = withRouter(AddEntry);

export default withRouter(AddEntry);

export const AddEntryContainer = Relay.createContainer(withRoles(withRouter(AddEntry), ['creator']), {
    fragments: {
        user: () => Relay.QL`
        fragment on User {
                ${userFragment}
                ${Header.getFragment('user')}
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
        `
    }
});
