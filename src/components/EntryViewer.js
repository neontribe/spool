import React, { Component } from 'react';
import moment from 'moment';

class EntryViewer extends Component {
    constructor (props) {
        super(props);

        this.getStyles = this.getStyles.bind(this);
    }

    formatTimestamp () {
        return moment(this.props.entry.timestamp).fromNow();
    }

    render () {
        return (
            <div>
                {/*<ResponsiveEmbed a4by3>*/}
                {this.props.entry.media.video && (
                    <div>
                        <video
                            src={this.props.entry.media.video}
                            controls={true}
                            autoPlay={true}
                        />
                    </div>
                )}

                {/*<ResponsiveEmbed a4by3>*/}
                {this.props.entry.media.image && (
                    <div>
                        <img
                            src={this.props.entry.media.image}
                            alt={this.props.entry.media.text || this.props.entry.topics.type}
                        />
                    </div>
                )}

                <div>
                    <div>
                        {this.props.entry.media.text && (
                            <blockquote>{this.props.entry.media.text}</blockquote>
                        )}
                    </div>

                    <img
                        src={'/static/' + this.props.entry.sentiment.type + '.png'}
                        alt={this.props.entry.sentiment.type}
                    />

                    <div>
                        <div>{this.formatTimestamp()}</div>
                        <div>{this.props.entry.topics.map((t) => t.name).join(' ')}</div>
                    </div>
                </div>
            </div>
        );
    }
}

EntryViewer.propTypes = {
    entry: React.PropTypes.object.isRequired
}

export default EntryViewer;
