import React, { Component } from 'react';

import _ from 'lodash';
import TextForm from './TextForm';
import SentimentForm from './SentimentForm';
import TopicForm from './TopicForm';

class EntryForm extends Component {

  constructor(props) {
      super(props);

      this.state = {
        step: props.step,
        entry: props.entry
      };

      this.saveEntry = this.saveEntry.bind(this);
  }

  saveEntry(key, value) {
      var entry = Object.assign({}, this.state.entry);
      entry[key] = value;
      this.setState({entry});
      var next = this.props.steps[this.props.steps.indexOf(this.state.step) + 1];
      if (next) {
          this.setState({step: next});
      } else {
          this.props.done(entry);
      }
  }

  render() {
    return (
          <form>
            {{
                media: (<TextForm initialValue={this.state.entry.media}
                                save={_.partial(this.saveEntry, 'media')}/>),
                sentiment: (<SentimentForm initialValue={this.state.entry.sentiment}
                                    save={_.partial(this.saveEntry, 'sentiment')}/>),
                topic: (<TopicForm initialValue={this.state.entry.topic}
                                    save={_.partial(this.saveEntry, 'topic')}/>)
            }[this.state.step]}
          </form>
    );
  }
}

EntryForm.propTypes = {
    step: React.PropTypes.string,
    steps: React.PropTypes.array,
    done: React.PropTypes.func,
    entry: React.PropTypes.object
}

EntryForm.defaultProps = {
    step: 'media',
    steps: ['media', 'sentiment', 'topic'],
    entry: {}
}

export default EntryForm;
