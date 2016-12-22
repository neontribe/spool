import React, { Component } from 'react';
import Relay from 'react-relay';
import { withRoles, userFragment } from './wrappers.js';
import { AccessFormContainer } from './AccessForm.js';
import { EntryContainer } from './Entry.js';
import moment from 'moment';
import Papa from 'papaparse';
import Layout from './Layout';
import Button from './Button';

const { Content, Header } = Layout;

const link = document.createElement('a');

export default class Access extends Component {
    constructor (props) {
        super(props);

        this.handleFormSuccess = this.handleFormSuccess.bind(this);
        // todo debounce this
        this.handleCSVClick = this.handleCSVClick.bind(this);

        this.state = {
            form: {},
        };
    }

    handleFormSuccess ({ from, to, topics }) {
        const form = {
            range: {
                from,
                to,
            },
            topics: topics,
            ready: true,
        };

        // not much need for this in state, but the contents are helpful
        this.setState({
            form
        });

        this.props.relay.setVariables(form);
    }

    handleCSVClick () {
        const data = this.props.consumer.access.entries.edges.map(({node}) => {
            const row = {
                text: node.media.text,
                topics: node.topics.map(({name}) => name).join(', '),
                sentiment: node.sentiment.type,
                creationDate: node.created,
                creatorAge: node.owner.age,
                creatorResidency: node.owner.residency,
                creatorServices: node.owner.services && node.owner.services.map(({name}) => name).join(', '),
            };
            return row;
        });

        if (data.length) {
            var csv = Papa.unparse(data);

            if (!csv.match(/^data:text\/csv/i)) {
                csv = 'data:text/csv;charset=utf-8,' + csv;
            }

            link.setAttribute('download', 'spool-entry-access.csv');
            link.setAttribute('href', encodeURI(csv));
            link.click();
        }
    }

    renderAccessList() {
        const { access } = this.props.consumer;

        if (access && access.entries.edges.length) {
            return access.entries.edges.map(({ node }) => (
                <EntryContainer key={node.id} entry={node} />
            ));
        }

        return null;
    }

    renderCSVButton () {
        if (this.state.form.ready) {
            return (
                <Button onClick={this.handleCSVClick}>Download as CSV</Button>
            );
        }

        return null;
    }

    render () {
        return (
            <Layout>
                <Header auth={this.props.auth} />
                <Content>
                    <AccessFormContainer onSuccess={this.handleFormSuccess} consumer={this.props.consumer}/>
                    {this.renderCSVButton()}
                    {this.renderAccessList()}
                    {this.renderCSVButton()}
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
            to: moment(),
        },
        topics: [],
    },
    fragments: {
        user: () => Relay.QL`
            fragment on User {
                ${userFragment}
            }`,
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
            }`,
    }
});
