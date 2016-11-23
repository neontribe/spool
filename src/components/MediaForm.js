import React, { Component } from 'react';
import { withRouter } from 'react-router';
import _ from 'lodash';

import IconChooser from './IconChooser';
import AddControls from './AddControls';

const choices = [
  {
      type: 'video',
      name: 'Video'
  },
  {
      type: 'photo',
      name: 'Photo'
  },
  {
      type: 'typing',
      name: 'Typing'
  }
];

class MediaForm extends Component {
  constructor (props) {
    super(props);

    this.state = {
      types: []
    };

    this.handleNext = this.handleNext.bind(this);
    this.handleChoice = this.handleChoice.bind(this);
  }

  handleNext () {
    this.props.router.push('/add/message/' + this.state.types[0]);
  }

  handleChoice (values) {
    this.setState({
      types: values
    });
  }

  renderChooser () {
    return (
      <div>
        <div>
          <IconChooser
            label='How would you like to make your message?'
            choices={choices}
            maxSelections={1}
            onChange={this.handleChoice}
          />
        </div>
        <div>
          <AddControls
            onNext={this.handleNext}
            disableNext={!this.state.types.length}
          />
        </div>
      </div>
    );
  }

  render() {
    let children = null;

    if (this.props.children) {
      children = React.cloneElement(this.props.children, {
        save: _.partial(this.props.save, this.props.saveKey)
      });
    }

    return (
      <div>
        {children && children}
        {!children && this.renderChooser()}
      </div>
    );
  }
}

MediaForm.propTypes = {
  save: React.PropTypes.func,
  saveKey: React.PropTypes.string
}

MediaForm.defaultProps = {
  saveKey: 'media'
}

export default withRouter(MediaForm);
