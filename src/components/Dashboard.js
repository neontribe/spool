import React, { Component } from 'react';
import Relay from 'react-relay';
import moment from 'moment';

import TopicsOverview from './TopicsOverview';
import { withRoles, userFragment } from './wrappers.js';
import Layout from './Layout';
import ButtonLink from './ButtonLink';

import styles from './css/Dashboard.module.css';
import headings from '../css/Headings.module.css';

const { Content, Header } = Layout;

export class Dashboard extends Component {
    constructor (props) {
        super(props);

        this.state = {
            rangeFrom: '-1,months',
            range: {
                from: moment().add(-1, 'months').startOf('date').format(),
                to: moment().endOf('date').format()
            }
        };

        this.changeRange = this.changeRange.bind(this);
    }

    changeRange (evt) {
        var [qty, step] = evt.target.value.split(',');
        const range = {
            from: moment().add(qty, step).startOf('date').format(),
            to: moment().endOf('date').format()
        };
        this.setState({
            rangeFrom: evt.target.value,
            range
        });
        this.props.relay.setVariables({
            range
        });
    }

    render () {
        const { access } = this.props.consumer;

        return (
            <Layout>
                <Header auth={this.props.auth} user={this.props.user}/>
                <Content>
                    <div>
                        <div className={styles.controls}>
                            <ButtonLink to='/app/access'>Access Form</ButtonLink>
                        </div>

                        <div>
                            <h2 className={headings.regular}>Scope</h2>
                            <div>
                                <select value={this.state.rangeFrom} onChange={this.changeRange}>
                                    <option value='0,days'>Today</option>
                                    <option value='-1,months'>30 Days</option>
                                    <option value='-3,months'>3 Months</option>
                                    <option value='-1,years'>Year</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <table className={styles.table}>
                        <tbody>
                            <tr>
                                <th>Active Creators:</th>
                                <td>{access.activity.active}</td>
                            </tr>
                            <tr>
                                <th>Stale:</th>
                                <td>{access.activity.stale}</td>
                            </tr>
                            <tr>
                                <th>Happy Entries:</th>
                                <td>{access.sentiment.happy}</td>
                            </tr>
                            <tr>
                                <th>Sad Entries:</th>
                                <td>{access.sentiment.sad}</td>
                            </tr>
                        </tbody>
                    </table>

                    <TopicsOverview topics={access.topics} dataRange={this.state.range}/>
               </Content>
            </Layout>
        );
    }
};

export const DashboardContainer = Relay.createContainer(withRoles(Dashboard, ['consumer']), {
    initialVariables: {
        range: {
            from: moment().add(-1, 'months').startOf('date').format(),
            to: moment().endOf('date').format()
        }
    },
    fragments: {
        user: () => Relay.QL`
            fragment on User {
                ${userFragment}
                ${Header.getFragment('user')}
            }
        `,
        consumer: () => Relay.QL`
            fragment on Consumer {
                access(range: $range) {
                    activity {
                        active
                        stale
                    }
                    topics {
                        topic {
                            type
                            name
                        }
                        entryCount
                        creatorCount
                    }
                    sentiment {
                        happy
                        sad
                    }
                }
            }
        `
    }
});
