import React, { Component } from 'react';
import Relay from 'react-relay';
import { Link } from 'react-router';
import moment from 'moment';
import _ from 'lodash';

import { EntryContainer, Entry } from './Entry';
import Layout from './Layout';
// import Grid from './Grid';
import withRoles from '../auth/withRoles.js';

import styles from './css/Timeline.module.css';
import headings from '../css/Headings.module.css';

const { Content, Header } = Layout;

export class Timeline extends Component {
    static propTypes = {
        // creator: React.PropTypes.object.isRequired,
    }

    constructor (props) {
        super(props);

        this.state = {
            showScrollMore: true
        };

        this.onScroll = _.debounce(this.onScroll.bind(this), 100, {
            leading: false,
            trailing: true
        });

        window.addEventListener('scroll', this.onScroll, false);
    }

    componentWillUnmount () {
        window.removeEventListener('scroll', this.onScroll, false);
    }

    onScroll () {
        var scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        var viewportHeight = document.documentElement.clientHeight;
        var showScrollMore = false;

        if ((scrollTop < 25) && (this.refs.wrapper.offsetHeight > viewportHeight)) {
            showScrollMore = true;
        }

        this.setState({
            showScrollMore
        });
    }

    render () {
        var EntryComponent = (this.props.relay) ? EntryContainer : Entry;
        var entries = this.props.creator.entries.edges.slice();

        // Chronologically sort entries
        entries = entries.sort((a, b) => {
            return moment(a.node.created) - moment(b.node.created);
        });

        // Group by month
        var entries = _.groupBy(entries, (entry) => {
            return moment(entry.node.created).startOf('week').format('YYYY-MM-DD');
        });

        return (
            <Layout>
                <Header auth={this.props.auth} />
                <Content>
                    <div ref='wrapper'>
                        {Object.keys(entries).map((date, i) => {
                            var _entries = entries[date];

                            return (
                                <div key={i}>
                                    <h2 className={styles.header}>
                                        {moment(date).startOf('week').format('YYYY, MMMM Do')} &mdash; {moment(date).endOf('week').format('MMMM Do')}
                                    </h2>

                                    {_entries.map((entry, j) => (
                                        <div key={j} className={((j + 1) % 3 === 0) ? styles.entryLastRowItem : styles.entry}>
                                            <EntryComponent entry={entry.node} thumbnailMode={true} />
                                        </div>
                                    ))}

                                    {this.state.showScrollMore && (
                                        <div className={styles.moreWrapper}>
                                            <div className={styles.more}>
                                                Scroll for more&hellip;
                                            </div>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
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
                        created,
                        ${EntryContainer.getFragment('entry')}
                    }
                }
            }
        }`,
    }
});
