import React, { Component } from 'react';
import Relay from 'react-relay';
import moment from 'moment';
import Papa from 'papaparse';
import _ from 'lodash';

import { withRoles, userFragment } from './wrappers.js';
import { AccessFormContainer } from './AccessForm.js';
import { EntryContainer } from './Entry.js';
import Layout from './Layout';
import Button from './Button';

const { Content, Header } = Layout;

const link = document.createElement('a');

import styles from './css/Access.module.css';

export default class Access extends Component {
    constructor (props) {
        super(props);

        this.handleFormSuccess = this.handleFormSuccess.bind(this);

        this.handleCSVClick = _.debounce(this.handleCSVClick.bind(this), 500, {
            leading: true,
            trailing: false
        });

        this.state = {
            form: {}
        };
    }

    handleFormSuccess ({ from, to, topics }) {
        const form = {
            range: {
                from,
                to
            },
            topics: topics,
            ready: true
        };

        // Not much need for this in state, but the contents are helpful
        this.setState({
            form
        });

        this.props.relay.setVariables(form);
    }

    handleCSVClick () {
        const data = this.props.consumer.access.entries.edges.map(({ node }) => {
            const row = {
                text: node.media.text,
                topics: node.topics.map(({ name }) => name).join(', '),
                sentiment: node.sentiment.type,
                creationDate: node.created,
                creatorAge: node.owner.age,
                creatorResidency: node.owner.residency,
                creatorServices: node.owner.services && node.owner.services.map(({ name }) => name).join(', ')
            };

            return row;
        });

        if (data.length) {
            var csv = Papa.unparse(data);

            if (!csv.match(/^data:text\/csv/i)) {
                csv = 'data:text/csv;charset=utf-8,' + csv;
            }
            
            const { from, to } = this.state.form.range;
            const name = 'entries-' + moment(from).format() + '-' + moment(to).format() + '.csv';
            link.setAttribute('download', name);
            link.setAttribute('href', encodeURI(csv));
            link.click();
        }
    }

    renderAccessList () {
        const { access } = this.props.consumer;

        if (access && access.entries.edges.length) {
            return (
                <div>
                    {access.entries.edges.map((entry, i) => (
                        <div key={i} className={((i + 1) % 3 === 0) ? styles.entryLastRowItem : styles.entry}>
                            <EntryContainer entry={entry.node} />
                        </div>
                    ))}
                </div>
            );
        }

        return null;
    }

    renderCSVButton () {
        if (this.state.form.ready) {
            return (
                <div>
                    <Button onClick={this.handleCSVClick}>Download as CSV</Button>
                </div>
            );
        }

        return null;
    }

    render () {
        return (
            <Layout>
                <Header auth={this.props.auth} />
                <Content>
                    <AccessFormContainer
                        onSuccess={this.handleFormSuccess}
                        consumer={this.props.consumer}
                    />
                    {this.renderCSVButton()}
                    {this.renderAccessList()}
                </Content>
            </Layout>
        );
    }
}

export const AccessContainer = Relay.createContainer(withRoles(Access, ['consumer']), {
    initialVariables: {
        first: 100,
        ready: false,
        range: {
            from: moment(),
            to: moment()
        },
        topics: []
    },
    fragments: {
        user: () => Relay.QL`
            fragment on User {
                ${userFragment}
            }
        `,
        consumer: () => Relay.QL`
            fragment on Consumer {
                access(range: $range) @include(if: $ready) {
                    entries(first: $first, topics: $topics){
                        edges {
                            node {
                                id
                                owner {
                                    age
                                    residency
                                    services {
                                        name
                                    }
                                }
                                media {
                                    text
                                }
                                topics {
                                    name
                                }
                                sentiment {
                                    type
                                }
                                created
                                updated

                                ${EntryContainer.getFragment('entry')}
                            }
                        }
                    }
                }
                ${AccessFormContainer.getFragment('consumer')}
            }
        `
    }
});
