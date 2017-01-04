import React, { Component } from 'react';
import Relay from 'react-relay';
import moment from 'moment';
import _ from 'lodash';

import { EntryContainer, Entry } from './Entry';
import Layout from './Layout';
import ButtonLink from './ButtonLink';
import { withRoles } from './wrappers.js';
import IconFilter from './IconFilter.js';

import styles from './css/Timeline.module.css';

const { Content, Header } = Layout;

export class Timeline extends Component {
    constructor (props) {
        super(props);

        this.state = {
            showScrollMore: false,
            panel: []
        };

        this.onScroll = _.debounce(this.onScroll.bind(this), 100, {
            leading: false,
            trailing: true
        });

        this.togglePanel = this.togglePanel.bind(this);

        window.addEventListener('scroll', this.onScroll, false);
    }

    componentDidMount () {
        this.onScroll();
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

    handleFilterChange () {
        // Todo: handleFilterChange
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
                            <ButtonLink to='/app/add'>Add New Entry</ButtonLink>
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
