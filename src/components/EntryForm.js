import React, { Component } from 'react';
import _ from 'lodash';
import VideoForm from './VideoForm';
import ImageForm from './ImageForm';
import TextForm from './TextForm';
import SentimentForm from './SentimentForm';
import TopicForm from './TopicForm';
import CaptionForm from './CaptionForm';

class EntryForm extends Component {

  constructor(props) {
      super(props);
      var steps = props.steps;
      // omit caption step for text entries
      if(props.entry.type === 'text') {
          steps = _.without(steps, 'caption');
      }

      this.state = {
        steps: steps,
        step: props.step,
        entry: props.entry
      };

      this.saveEntry = this.saveEntry.bind(this);
      this.back = this.back.bind(this);
      this.next = this.next.bind(this);
      this.isFinished = this.isFinished.bind(this);
  }

  saveEntry(key, value) {
      var entry = _.merge({}, this.state.entry, {[key]: value});
      this.setState({entry});

      if (!this.isFinished()) {
          this.next();
      } else {
          console.log(entry);
          this.props.done(entry, () => this.setState({step: this.state.steps[0]}));
      }
  }

  back() {
      var prev = this.state.steps[this.state.steps.indexOf(this.state.step) - 1];
      if (prev) {
          this.setState({step: prev});
      }
  }

  next() {
      var next = this.state.steps[this.state.steps.indexOf(this.state.step) + 1];
      if (next) {
          this.setState({step: next});
      }
  }

  isFinished() {
     return this.state.step === _.last(this.state.steps);
  }

  render() {

    return (
          <form>
            {{
                media: ({
                    text: (<TextForm save={_.partial(this.saveEntry, 'media')}/>),
                    video: (<VideoForm save={_.partial(this.saveEntry, 'media')} back={this.back}/>),
                    image: (<ImageForm save={_.partial(this.saveEntry, 'media')} back={this.back}/>)
                }[this.state.entry.type]),
                caption: (<CaptionForm save={_.partial(this.saveEntry, 'media')} type={this.state.entry.type}/>),
                sentiment: (<SentimentForm save={_.partial(this.saveEntry, 'sentiment')} />),
                topic: (<TopicForm topics={this.props.topics} save={_.partial(this.saveEntry, 'topic')} />)
            }[this.state.step]}
        </form>
    );
  }
}

EntryForm.propTypes = {
    step: React.PropTypes.string,
    steps: React.PropTypes.array,
    done: React.PropTypes.func,
    entry: React.PropTypes.object,
    topics: React.PropTypes.array
}

EntryForm.defaultProps = {
    step: 'media',
    steps: ['media', 'caption', 'sentiment', 'topic'],
    entry: {}
}

export default EntryForm;
