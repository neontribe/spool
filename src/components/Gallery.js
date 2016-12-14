import React, { Component } from 'react';
import Relay from 'react-relay';
import { Link } from 'react-router';

import { EntryContainer, Entry } from './Entry';
import Layout from './Layout';
// import Intro from './Intro';
import Grid from './Grid';
import withRoles from '../auth/withRoles.js';

import styles from './css/Gallery.module.css';
import controls from '../css/Controls.module.css';

const { Content, Header } = Layout;

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

    shuffle (array) {
        var currentIndex = array.length
        var temporaryValue, randomIndex;

        while (0 !== currentIndex) {
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex -= 1;

            temporaryValue = array[currentIndex];
            array[currentIndex] = array[randomIndex];
            array[randomIndex] = temporaryValue;
        }

        return array;
    }

    // Returns the latest entry followed by 4 randomised entries
    renderEntries () {
        var entries = this.props.creator.entries.edges.slice();

        if (entries.length) {
            var latest = entries.shift();
            var EntryComponent = (this.props.relay) ? EntryContainer : Entry;

            var items = [
                <EntryComponent key={latest.node.id} entry={latest.node} />
            ];

            entries = this.shuffle(entries).slice(0, 4);

            entries.forEach((entry) => {
                items.push(
                    <EntryComponent key={entry.node.id} entry={entry.node} />
                );
            });

            return items;
        }
    }

    render () {
        var addEntryControl = (
            <Link to={'/add'} className={styles.addEntryControl}>Add New Entry</Link>
        );

        return (
            <Layout>
                <Header auth={this.props.auth} />
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
