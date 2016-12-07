import React, { Component } from 'react';
import Relay from 'react-relay';
import { Link } from 'react-router';

import { EntryContainer, Entry } from './Entry';
import Layout, { Container, Header } from './Layout';
// import Intro from './Intro';
import Grid from './Grid';
import withRoles from '../auth/withRoles.js';

import styles from './css/Timeline.module.css';
import controls from '../css/Controls.module.css';

export class Timeline extends Component {
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
        // return (
        //     <div>
        //         <div>
        //         </div>

        //         <Link to={'/add'} className='btn'>{(this.state.hasEntries) ? 'Add New Entry' : 'Get Started'}</Link>

        //         <div>
        //             {this.renderEntries()}
        //             {!this.state.hasEntries && <Intro />}
        //         </div>
        //     </div>
        // );

        var addEntryControl = (
            <Link to={'/add'} className={styles.addEntryControl}>Add New Entry</Link>
        );

        return (
            <Layout>
                <Header>
                    <p>I am a progress bar controlled by the Timeline component</p>
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

export const TimelineContainer = Relay.createContainer(withRoles(Timeline, {
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
