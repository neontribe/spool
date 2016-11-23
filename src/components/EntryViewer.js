import React, { Component } from 'react';
import moment from 'moment';

class EntryViewer extends Component {
    formatTimestamp () {
        return moment(this.props.entry.timestamp).fromNow();
    }

    render () {
        return (
            <div>
                {this.props.entry.media.video && (
                    <video
                        src={this.props.entry.media.video}
                        controls={true}
                        autoPlay={true}
                    />
                )}

                {this.props.entry.media.image && (
                    <img
                        src={this.props.entry.media.image}
                        alt={this.props.entry.media.text || this.props.entry.topics.type}
                    />
                )}

                <div>
                    {this.props.entry.media.text && (
                        <blockquote>{this.props.entry.media.text}</blockquote>
                    )}

                    <img
                        src={'/static/' + this.props.entry.sentiment.type + '.png'}
                        alt={this.props.entry.sentiment.type}
                    />

                    <div>{this.formatTimestamp()}</div>
                    <div>{this.props.entry.topics.map((t) => t.name).join(' ')}</div>
                </div>
            </div>
        );
    }
}

EntryViewer.propTypes = {
    entry: React.PropTypes.object.isRequired
}

export default EntryViewer;
