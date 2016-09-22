import React, { Component } from 'react';
import { Grid, Row, Col, Glyphicon, FormGroup, ControlLabel, FormControl, Badge } from 'react-bootstrap';
import TopicsOverview from './TopicsOverview';
import Relay from 'react-relay';
import moment from 'moment';
import { Link } from 'react-router';

export class Dashboard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            rangeFrom: '-1,months'
        }
        this.changeRange = this.changeRange.bind(this);
    }

    changeRange(evt) {
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

    render() {
        return (
            <Grid>
                <Row>
                    <Col xs={6}>
                        <h1>Statistics</h1>
                    </Col>
                    <Col xs={4}>
                        <Link className="btn" to={'/requests/add'}>
                            <Glyphicon glyph="plus"/> New Access Request</Link>
                    </Col>
                    <Col xs={2}>
                       <FormGroup controlId="dateRange">
                          <ControlLabel>Scope</ControlLabel>
                          <FormControl componentClass="select" value={this.state.rangeFrom} onChange={this.changeRange}>
                            <option value="0,days">Today</option>
                            <option value="-1,months">30 Days</option>
                            <option value="-3,months">3 Months</option>
                            <option value="-1,years">Year</option>
                          </FormControl>
                        </FormGroup>
                    </Col>

                </Row>
                <Row>
                    <Col xs={12}>
                        <p>Active Creators: <Badge>{this.props.consumer.creatorActivityCount.active}</Badge></p>
                        <p>Stale: <Badge>{this.props.consumer.creatorActivityCount.stale}</Badge></p>
                    </Col>
                </Row>
               <Row>
                   <Col xs={12}>
                       <TopicsOverview topics={this.props.consumer.topicCounts} />
                   </Col>
               </Row>
            </Grid>
        );
    }
};

export const DashboardContainer = Relay.createContainer(Dashboard, {
    initialVariables: {
        range: {
            from: moment().add(-1, 'months').startOf('date').format(),
            to: moment().endOf('date').format()
        }
    },
    fragments: {
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
