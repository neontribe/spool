import React, { Component } from 'react';
import Relay from 'react-relay';
import { Link } from 'react-router';
import moment from 'moment';

import TopicsOverview from './TopicsOverview';
import withRoles, { userFragment } from '../auth/withRoles.js';
import Layout from './Layout';
const { Content, Header } = Layout;

export class Dashboard extends Component {
    constructor (props) {
        super(props);

        this.state = {
            rangeFrom: '-1,months'
        }

        this.changeRange = this.changeRange.bind(this);
    }

    changeRange (evt) {
        var [qty, step] = evt.target.value.split(',');

        this.setState({
            rangeFrom: evt.target.value
        });

        this.props.relay.setVariables({
            range: {
                from: moment().add(qty, step).startOf('date').format(),
                to: moment().startOf('date').format()
            }
        });
    }

    render () {
        const { access } = this.props.consumer;
        return (
            <Layout>
                <Header auth={this.props.auth}>
                    <p>test</p>
                </Header>
                <Content>
                    <div>
                        {/*<FormGroup controlId="dateRange">*/}
                        <div>
                            {/*<ControlLabel>Scope</ControlLabel>*/}
                            <h2>Scope</h2>
                            <Link to="/access"><span style={{color: 'red'}}>Access (click me)</span></Link>
                            <select value={this.state.rangeFrom} onChange={this.changeRange}>
                                <option value="0,days">Today</option>
                                <option value="-1,months">30 Days</option>
                                <option value="-3,months">3 Months</option>
                                <option value="-1,years">Year</option>
                            </select>
                        </div>
                        {/*</FormGroup>*/}
                    </div>
                    <div>
                        <p>Active Creators: {access.activity.active}</p>
                        <p>Stale: {access.activity.stale}</p>
                    </div>
                    <div>
                        <p>Happy Entries: {access.sentiment.happy}</p>
                        <p>Sad Entries: {access.sentiment.sad}</p>
                    </div>
                   <div>
                       <TopicsOverview topics={access.topics} />
                   </div>
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
            }`,
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
            }`,
    }
});
