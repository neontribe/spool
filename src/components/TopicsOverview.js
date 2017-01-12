import React, { Component } from 'react';
import styles from './css/TopicsOverview.module.css';
import headings from '../css/Headings.module.css';

class TopicsOverview extends Component {
    static propTypes = {
        topics: React.PropTypes.array
    }

    render () {
        return (
            <div>
                <h2 className={headings.regular}>Entries by topic</h2>

                <table className={styles.table}>
                    <tbody>
                        {this.props.topics.map((item, i) => (
                            <tr key={i}>
                                <th>{item.topic.name}</th>
                                <td>{item.entryCount} entries by {item.creatorCount} creators</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        );
    }
}

export default TopicsOverview;
