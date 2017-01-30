import React, { Component } from 'react';
import styles from './css/TopicsOverview.module.css';
import headings from '../css/Headings.module.css';
import Papa from 'papaparse';
import Button from './Button';
import moment from 'moment';

const link = document.createElement('a');

class TopicsOverview extends Component {

    constructor (props) {
        super(props);
        this.handleCSVClick = this.handleCSVClick.bind(this);
    }

    static propTypes = {
        topics: React.PropTypes.array
    }

    handleCSVClick () {
        const data = this.props.topics.map((item) => {
            const row = {
                topic: item.topic.name,
                entries: item.entryCount,
                creators: item.creatorCount,
            };
            return row;
        });

        if (data.length) {
            var csv = Papa.unparse(data);
            if (!csv.match(/^data:text\/csv/i)) {
                csv = 'data:text/csv;charset=utf-8,' + csv;
            }
            const { from, to } = this.props.dataRange;
            const name = 'spool-' + moment(from).format() + '-' + moment(to).format() + '.csv';
            link.setAttribute('download', name);
            link.setAttribute('href', encodeURI(csv));
            link.click();
        }
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
                <Button onClick={this.handleCSVClick}>Download as CSV</Button>
            </div>
        );
    }
}

export default TopicsOverview;
