import React, { Component } from 'react';
import { Grid, Row, Col } from 'react-bootstrap';
import { IconCard } from './IconCard';
import { UsageChart } from './UsageChart';

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
                        <h2>Most Talked About...</h2>
                    </Col>
                    <Col xs={6} xsOffset={3}>
                        <IconCard message="Transport" icon="transport" />
                        <span>15</span>
                    </Col>
                    <Col xs={6}>
                        <IconCard message="Health" icon="health" />
                        <span>7</span>
                    </Col>
                    <Col xs={6}>
                        <IconCard message="Work" icon="work" />
                        <span>3</span>
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
                        <UsageChart />
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
                        <button>View more Metrics...</button>
                    </Col>
                </Row>
            </Grid>
        );
    }
};
