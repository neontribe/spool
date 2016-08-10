import React, { Component } from 'react';
import { Jumbotron } from 'react-bootstrap';
import MediaForm from './MediaForm';
import SentimentForm from './SentimentForm';
import TopicForm from './TopicForm';

class EntryForm extends Component {

  constructor(props) {
      super(props);

      this.state = {
        step: props.step
      };

      this.save = this.save.bind(this);
  }

  save(fields) {
      this.setState(fields);
      debugger;
      var next = this.props.steps[this.props.steps.indexOf(this.state.step) + 1];
      if (next) {
          this.setState({step: next});
      } else {
          this.props.done(this.state);
      }

  }

  render() {
      var fields;
      switch (this.state.step) {
          case 'media':
              fields = <MediaForm media={this.state.media}
                                    save={this.save}/>
              break;
          case 'sentiment':
              fields = <SentimentForm sentiment={this.state.sentiment}
                                        save={this.save}/>
              break;
          case 'topic':
              fields = <TopicForm topic={this.state.topic}
                                        save={this.save}/>
              break;
          default:
            fields = <h2>Missing Case</h2>
    }
    return (
        <Jumbotron>
          <form>
            {fields}
          </form>
         </Jumbotron>
    );
  }
}

EntryForm.propTypes = {
    step: React.PropTypes.string,
    steps: React.PropTypes.array,
    done: React.PropTypes.func.isRequired
}
EntryForm.defaultProps = {
    step: 'media',
    steps: ['media', 'sentiment', 'topic']
}

export default EntryForm;
