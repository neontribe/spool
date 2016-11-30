import React, { Component } from 'react';
import Relay from 'react-relay';
import moment from 'moment';
import { Link } from 'react-router';

import TopicsOverview from './TopicsOverview';
import withRoles from '../auth/withRoles.js';

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
        return (
            <div>
                <div>

                    {/*<FormGroup controlId="dateRange">*/}
                    <div>
                        {/*<ControlLabel>Scope</ControlLabel>*/}
                        <h2>Scope</h2>

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
                    <p>Active Creators: {this.props.consumer.creatorActivityCount.active}</p>
                    <p>Stale: {this.props.consumer.creatorActivityCount.stale}</p>
                </div>
               <div>
                   <TopicsOverview topics={this.props.consumer.topicCounts} />
               </div>
            </div>
        );
    }
};

export const DashboardContainer = Relay.createContainer(withRoles(Dashboard, {
    roles: ['consumer'],
    fallback: '/settings/configure',
}), {
    initialVariables: {
        range: {
            from: moment().add(-1, 'months').startOf('date').format(),
            to: moment().endOf('date').format()
        }
    },
    fragments: {
        user: () => Relay.QL`
            fragment on User {
                role
            }`,
        consumer: () => Relay.QL`
            fragment on Consumer {
                creatorActivityCount(range: $range) {
                    active
                    stale
                }
                topicCounts(range: $range) {
                    topic {
                        type
                        name
                    }
                    entryCount
                    creatorCount
                }
            }
        `,
    }
});
