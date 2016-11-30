import React, { Component } from 'react';
import Relay from 'react-relay';
import { Link } from 'react-router';
import _ from 'lodash';

import { EntryContainer, Entry } from './Entry';
import UserRequest, { UserRequestContainer } from './UserRequest';
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
        return this.props.creator.entries.edges.map((entry) => {
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

    renderRequests () {
        if (this.props.creator.requests.edges.length) {
            var request = _.first(this.props.creator.requests.edges).node;

            if (this.props.relay) {
                return (
                    <UserRequestContainer
                        userRequest={request}
                        creator={this.props.creator}
                    />
                );
            }

            return (
                <UserRequest
                    userRequest={request}
                    creator={this.props.creator}
                />
            );
        }
    }

    render () {
        // return (
        //     <div>
        //         <div>
        //             {this.renderRequests()}
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
            <div className={styles.wrapper}>
                {/* Todo: Filter controls */}
                <ul className={styles.filters}>
                    <li className={styles.filter}>
                        <a role='button' className={styles.filterControl}>😄</a>
                    </li>
                    <li className={styles.filter}>
                        <a role='button' className={styles.filterControl}>😡</a>
                    </li>
                    <li className={styles.filter}>
                        <a role='button' className={styles.filterControl}>&times;</a>
                    </li>
                    <li className={styles.filter}>
                        <a role='button' className={styles.filterControl}>&times;</a>
                    </li>
                    <li className={styles.filter}>
                        <a role='button' className={styles.filterControl}>&times;</a>
                    </li>
                    <li className={styles.filter}>
                        <a role='button' className={styles.filterControl}>&times;</a>
                    </li>
                    <li className={styles.filter}>
                        <a role='button' className={styles.filterControl}>&times;</a>
                    </li>
                    <li className={styles.filter}>
                        <a role='button' className={styles.filterControl}>&times;</a>
                    </li>
                    <li className={styles.filter}>
                        <a role='button' className={styles.filterControl}>&times;</a>
                    </li>
                    <li className={styles.filter}>
                        <a role='button' className={styles.filterControl}>&times;</a>
                    </li>
                    <li className={styles.filter}>
                        <a role='button' className={styles.filterControl}>&times;</a>
                    </li>
                    <li className={styles.filter}>
                        <a role='button' className={styles.filterControl}>&times;</a>
                    </li>
                </ul>

                <Grid callToAction={addEntryControl}>
                    {this.renderEntries()}
                </Grid>
            </div>
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
            requests(first: $first) {
                edges {
                    node {
                        id,
                        ${UserRequestContainer.getFragment('userRequest')}
                    }
                }
            }
            ${UserRequestContainer.getFragment('creator')}
        }`,
    }
});
