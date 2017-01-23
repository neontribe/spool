import React, { Component } from 'react';
import Relay from 'react-relay';
import moment from 'moment';
import _ from 'lodash';

import { EntryContainer, Entry } from './Entry';
import Layout from './Layout';
import ButtonLink from './ButtonLink';
import { withRoles } from './wrappers.js';
import IconFilter from './IconFilter.js';
import TouchIcon from './TouchIcon.js';

import styles from './css/Timeline.module.css';

const { Content, Header } = Layout;

export class Timeline extends Component {
    constructor (props) {
        super(props);

        this.state = {
            showScrollMore: false,
            filters: {},
            panel: [],
        };
        this.handleFilterChange = this.handleFilterChange.bind(this);

        this.onScroll = _.debounce(this.onScroll.bind(this), 100, {
            leading: false,
            trailing: true
        });

        this.togglePanel = this.togglePanel.bind(this);

        window.addEventListener('scroll', this.onScroll, true);
    }

    componentDidMount () {
        this.onScroll();
    }

    componentWillUnmount () {
        window.removeEventListener('scroll', this.onScroll, true);
    }

    onScroll () {
        var showScrollMore = false;
        var scrollTop = Math.abs(Math.ceil(this.refs.wrapper.getBoundingClientRect().top) - this.refs.wrapper.offsetTop);
        var entries = this.props.creator.entries.edges.slice();

        if (scrollTop < 25 && Object.keys(entries).length > 3) {
            showScrollMore = true;
        }

        this.setState({
            showScrollMore
        });
    }

    togglePanel (index) {
        var state = Object.assign({}, this.state);

        if (!state.panel[index]) {
            state.panel[index] = {
                expanded: true
            };
        } else {
            state.panel[index].expanded = !state.panel[index].expanded;
        }

        this.setState(state);
    }

    handleFilterChange (filters) {
        var active = _.reduce(filters, (reduction, value, key) => {
            if (value) {
                reduction.push(key);
            }

            return reduction;
        }, []);

        var mediaArguments;

        const { text, video, image } = filters;

        if (text || video || image) {
            mediaArguments = {
                text,
                video,
                image
            };
        }

        const filterArguments = {
            topics: _.intersection(active, ['work', 'learning', 'home', 'food', 'relationships', 'activities', 'travel', 'health']),
            sentiment: _.intersection(active, ['happy', 'sad']),
            media: mediaArguments
        };

        this.setState({
            filters
        });

        this.props.relay.setVariables({
            filter: filterArguments
        });
    }

    renderMenuContent () {
        return (
            <IconFilter onChange={this.handleFilterChange} filters={this.state.filters} />
        );
    }

    render () {
        var EntryComponent = (this.props.relay) ? EntryContainer : Entry;
        var entries = this.props.creator.entries.edges.slice();

        // Chronologically sort entries
        entries = entries.sort((a, b) => {
            return moment(b.node.created) - moment(a.node.created);
        });

        // Group by month
        entries = _.groupBy(entries, (entry) => {
            return moment(entry.node.created).startOf('week').format('YYYY-MM-DD');
        });

        return (
            <Layout>
                <Header
                    auth={this.props.auth}
                    menuContent={this.renderMenuContent()}
                />
                <Content>
                    {!Object.keys(entries).length && (
                        <div className={styles.noResults}>
                            <ButtonLink to='/app/add'><TouchIcon />Add New Entry</ButtonLink>
                        </div>
                    )}

                    <div ref='wrapper'>
                        {Object.keys(entries).map((date, i) => {
                            var _entries = entries[date];
                            var dateRange = `${moment(date).startOf('week').format('YYYY, MMMM Do')} — ${moment(date).endOf('week').format('MMMM Do')}`;
                            var showEntries = this.state.panel[i] && this.state.panel[i].expanded;

                            return (
                                <div key={i} className={styles.section}>
                                    <h2>
                                        <button
                                            className={styles.header}
                                            onClick={_.partial(this.togglePanel, i)}
                                        >{dateRange} <span className={styles.toggle}>{(showEntries) ? '▼' : '▲'}</span></button>
                                    </h2>

                                    <div style={{ display: (showEntries) ? 'none' : 'block' }}>
                                        {_entries.map((entry, j) => (
                                            <div key={j} className={((j + 1) % 3 === 0) ? styles.entryLastRowItem : styles.entry}>
                                                <EntryComponent entry={entry.node} thumbnailMode={true} />
                                            </div>
                                        ))}
                                    </div>

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

export const TimelineContainer = Relay.createContainer(withRoles(Timeline, ['creator']), {
    initialVariables: {
        first: 100,
        filter: {
            sentiment: ['happy', 'sad'],
            topics: ['work', 'learning', 'home', 'food', 'relationships', 'activities', 'travel', 'health'],
            media: {
                text: true,
                video: true,
                image: true
            }
        }
    },
    fragments: {
        user: () => Relay.QL`
            fragment on User {
                role
            }
        `,
        creator: () => Relay.QL`
            fragment on Creator {
                happyCount
                sadCount
                entries(first: $first, filter: $filter) {
                    edges {
                        node {
                            id,
                            created,
                            ${EntryContainer.getFragment('entry')}
                        }
                    }
                }
            }
        `
    }
});
