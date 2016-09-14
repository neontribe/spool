import React, { Component } from 'react';
import { Grid, Row, Col, Badge } from 'react-bootstrap';
import { IconCard } from './IconCard';

class TopicsOverview extends Component {
    render() {
        return (
            <Grid>
                <Row>
                    <Col xs={12}>
                        <h2>Entries by topic</h2>
                    </Col>
                </Row>
                <Row>
                    { this.props.topics.map((item, i) => {
                        return (
                            <Col xs={3} key={item.topic.type + '_' + i}>
                                <IconCard message={item.topic.name} icon={item.topic.type} />
                                <div className="topicCount"><Badge>{item.entryCount}</Badge> entries by <Badge>{item.creatorCount}</Badge> creators</div>
                            </Col>
                        );
                    })}
                </Row>
            </Grid>
        );
    }
}

TopicsOverview.propTypes = {
    topics: React.PropTypes.array
}

export default TopicsOverview;
