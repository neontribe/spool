import React, { Component } from 'react';
import Relay from 'react-relay';
import { Link } from 'react-router';

import { EntryContainer, Entry } from './Entry';
import Layout from './Layout';
const { Content, Header } = Layout;
// import Intro from './Intro';
import Grid from './Grid';
import withRoles from '../auth/withRoles.js';

import styles from './css/Gallery.module.css';
import controls from '../css/Controls.module.css';

export class Gallery extends Component {
    static propTypes = {
        creator: React.PropTypes.object.isRequired,
    }

    constructor (props) {
        super(props);

        this.state = {
            hasEntries: props.creator.entries.edges.length
        };
    }

    renderEntries () {
        return this.props.creator.entries.edges.slice(0, 5).map((entry) => {
            if (this.props.relay) {
                return (
                    <EntryContainer
                        key={entry.node.id}
                        entry={entry.node} 
                    />
                );
            }

            return (
                <Entry
                    key={entry.node.id}
                    entry={entry.node}
                />
            );
        });
    }

    render () {
        var addEntryControl = (
            <Link to={'/add'} className={styles.addEntryControl}>Add New Entry</Link>
        );
        return (
            <Layout>
                <Header auth={this.props.auth}>
                    <p>This is a progess bar</p>
                </Header> 
                <Content>
                    <div className={styles.wrapper}>
                        <Grid callToAction={addEntryControl}>
                            {this.renderEntries()}
                        </Grid>
                    </div>
                </Content>
            </Layout>
        );
    }
}

export const GalleryContainer = Relay.createContainer(withRoles(Gallery, {
    roles: ['creator'],
    fallback: '/settings/configure',
}), {
    initialVariables: {
        first: 100,
    },
    fragments: {
        user: () => Relay.QL`
        fragment on User {
            role
        }`,
        creator: () => Relay.QL`
        fragment on Creator {
            happyCount
            sadCount
            entries(first: $first) {
                edges {
                    node {
                        id,
                        ${EntryContainer.getFragment('entry')}
                    }
                }
            }
        }`,
    }
});
