import React, { Component } from 'react';
import _ from 'lodash';
import MediaTypeChooser from './MediaTypeChooser';
import VideoForm from './VideoForm';
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
      this.back = this.back.bind(this);
  }

  saveEntry(key, value) {
      var entry = Object.assign({}, this.state.entry);
      entry[key] = value;
      this.setState({entry});
      var next = this.props.steps[this.props.steps.indexOf(this.state.step) + 1];
      if (next) {
          this.setState({step: next});
      } else {
          this.props.done(entry, () => this.setState({step: this.props.steps[0]}));
      }
  }

  back() {
      var prev = this.props.steps[this.props.steps.indexOf(this.state.step) - 1];
      if (prev) {
          this.setState({step: prev});
      }
  }

  render() {

    return (
          <form>
            {{
                mediachoice: (<MediaTypeChooser save={_.partial(this.saveEntry, 'type')} />),
                media: ({
                    text: (<TextForm save={_.partial(this.saveEntry, 'media')}/>),
                    video: (<VideoForm save={_.partial(this.saveEntry, 'media')} back={this.back}/>),
                    image: (<TextForm save={_.partial(this.saveEntry, 'media')}/>)
                }[this.state.entry.type]),
                sentiment: (<SentimentForm save={_.partial(this.saveEntry, 'sentiment')}/>),
                topic: (<TopicForm save={_.partial(this.saveEntry, 'topic')}/>)
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
    step: 'mediachoice',
    steps: ['mediachoice', 'media', 'sentiment', 'topic'],
    entry: {}
}

export default EntryForm;
