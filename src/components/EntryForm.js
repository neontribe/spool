import React, { Component } from 'react';
import Relay from 'react-relay';
import { Jumbotron } from 'react-bootstrap';
import _ from 'lodash';
import MediaForm from './MediaForm';
import SentimentForm from './SentimentForm';
import TopicForm from './TopicForm';
import CreateEntryMutation from '../relay/mutations/createEntryMutation.js';

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
          this.props.relay.commitUpdate(
              new CreateEntryMutation(entry)
          );
          this.props.done();
      }
  }

  render() {
    return (
        <Jumbotron>
          <form>
            {{
                media: (<MediaForm initialValue={this.state.entry.media}
                                save={_.partial(this.saveEntry, 'media')}/>),
                sentiment: (<SentimentForm initialValue={this.state.entry.sentiment}
                                    save={_.partial(this.saveEntry, 'sentiment')}/>),
                topic: (<TopicForm initialValue={this.state.entry.topic}
                                    save={_.partial(this.saveEntry, 'topic')}/>)
            }[this.state.step]}
          </form>
         </Jumbotron>
    );
  }
}

EntryForm.propTypes = {
    step: React.PropTypes.string,
    steps: React.PropTypes.array,
    done: React.PropTypes.func,
    entry: React.PropTypes.object,
    savedEntry: React.PropTypes.object
}

EntryForm.defaultProps = {
    step: 'media',
    steps: ['media', 'sentiment', 'topic'],
    entry: {}
}


export default Relay.createContainer(EntryForm, {
    fragments: {
        savedEntry: Relay.QL`
            fragment on Entry {
                id
                _id
            }`
    }
});
