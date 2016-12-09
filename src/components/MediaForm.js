import React, { Component } from 'react';
import { withRouter } from 'react-router';
import _ from 'lodash';

import IconChooser from './IconChooser';

import styles from './css/MediaForm.module.css';

const choices = [
  {
    type: 'video',
    name: 'Video'
  },
  {
    type: 'photo',
    name: 'Picture'
  },
  {
    type: 'typing',
    name: 'Write'
  }
];

class MediaForm extends Component {
  constructor (props) {
    super(props);

    this.handleNext = this.handleNext.bind(this);
  }

  handleNext (values) {
    this.props.router.push('/add/message/' + values[0]);
  }

  renderChooser () {
    return (
      <IconChooser
        label='How would you like to create the entry?'
        choices={choices}
        maxSelections={1}
        onChange={this.handleNext}
      />
    );
  }

  render () {
    let children = null;

    if (this.props.children) {
      children = React.cloneElement(this.props.children, {
        save: _.partial(this.props.save, this.props.saveKey)
      });
    }

    return (
      <div className={styles.wrapper}>
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
