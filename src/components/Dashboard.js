import React, { Component } from 'react';
import { Grid, Row, Col } from 'react-bootstrap';
import Relay from 'react-relay';
import moment from 'moment';

export class Dashboard extends Component {
    render() {
        return (
            <Grid>
                <Row>
                    <Col xs={11}>
                        <h1>Dashboard</h1>
                    </Col>
                    <Col xs={1}>
                        <label>Scope
                            <select>
                                <option>Today</option>
                                <option>30 Days</option>
                                <option>3 Months</option>
                                <option>Year</option>
                                <option>Custom</option>
                            </select>
                       </label>
                    </Col>
                </Row>
                <Row>
                    <Col xs={12}>
                        <p>Active: {this.props.viewer.role.creatorActivityCount.active}</p>
                        <p>Stale: {this.props.viewer.role.creatorActivityCount.stale}</p>
                    </Col>
                </Row>
            </Grid>
        );
    }
};
/*
 *
                <Row>
                    <Col xs={12}>
                        <p style={{backgroundColor:'green', color:'white'}}>
                            There are
                            <strong>12</strong>
                            pending requests for data
                        </p>
                        <p style={{backgroundColor:'orange', color:'white'}}>
                            There are
                            <strong>3</strong>
                            responses awaiting clarification
                        </p>
                    </Col>
                </Row>
                <Row>
                    <Col xs={12}>
                        <h2>Most Talked About...</h2>
                    </Col>
                    <Col xs={12}>
                        <IconCard message="Transport" icon="transport" />
                        <span>15</span>
                    </Col>
                    <Col xs={6}>
                        <IconCard message="Health" icon="health" />
                        <span>7</span>
                    </Col>
                    <Col xs={6}>
                        <IconCard message="Work" icon="work" />
                        <span>7</span>
                    </Col>
                    <Col xs={12}>
                        <button>View more Topics...</button>
                    </Col>
                </Row>
                <Row>
                    <Col xs={12}>
                        <h2>User Metrics</h2>
                    </Col>
                    <Col xs={12}>
                        <h3>Usage</h3>
                        <p>19 users with 139 unique entries in the past 30 days.</p>
                        <div>SOME GIANT LINE CHAT STUFF HERE</div>
                    </Col>
                    <Col xs={12}>
                        <h3>Activity</h3>
                        <p>
                            <strong>78%</strong> users are&nbsp;
                            <span style={{backgroundColor:'green', color:'white'}}>fully active</span>
                        </p>
                        <p>
                            <strong>10%</strong> users are&nbsp;
                            <span style={{backgroundColor:'yellow', color:'white'}}>moderately active</span>
                        </p>
                        <p>
                            <strong>12%</strong> of users are&nbsp;
                            <span style={{backgroundColor:'red', color:'white'}}>inactive</span>
                        </p>
                    </Col>
                    <Col xs={12}>
                        <h3>Assistance</h3>
                        <p>
                            <strong>55%</strong> of users require assistance.
                        </p>
                        <p>
                            <strong>44%</strong> of users are operating alone.
                        </p>
                    </Col>
                    <Col xs={12}>
                        <button>View more Metrics...</button>
                    </Col>
                    </Row> */

export const DashboardContainer = Relay.createContainer(Dashboard, {
    initialVariables: {
        range: {
            from: moment().startOf('date').format(),
            to: moment().endOf('date').format()
        }
    },
    fragments: {
        viewer: () => Relay.QL`
            fragment on Viewer {
                role {
                    ... on Consumer {
                        creatorActivityCount(range: $range) {
                            active
                            stale
                        }
                    }
                }
            }
        `,
    }
});
