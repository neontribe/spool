import React, { Component } from 'react';

import { IconCard } from './IconCard';

class TopicsOverview extends Component {
    render () {
        return (
            <div>
                <h2>Entries by topic</h2>

                <div>
                    {this.props.topics.map((item, i) => (
                        <div key={i}>
                            <IconCard
                                message={item.topic.name}
                                icon={item.topic.type}
                            />

                            <p>{item.entryCount} entries by {item.creatorCount} creators</p>
                        </div>
                    ))}
                </div>
            </div>
        );
    }
}

TopicsOverview.propTypes = {
    topics: React.PropTypes.array
}

export default TopicsOverview;
