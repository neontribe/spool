import React, { Component } from 'react';
import { ButtonToolbar, Button, Glyphicon } from 'react-bootstrap';
import { withRouter } from 'react-router';
import _ from 'lodash';

class MediaForm extends Component {

  constructor(props) {
    super(props);

    this.state = {};

    this.setMediaType = this.setMediaType.bind(this);
    this.renderChooser = this.renderChooser.bind(this);
  }

  setMediaType(type) {
      this.props.router.push('/add/media/' + type);
  }

  renderChooser() {
      return (
          <ButtonToolbar className='add-entry-form'>
            <Button onClick={_.partial(this.setMediaType, 'text')}><Glyphicon glyph="pencil" /> Words</Button>
            <Button onClick={_.partial(this.setMediaType, 'video')}><Glyphicon glyph="film" /> Video</Button>
            <Button onClick={_.partial(this.setMediaType, 'image')}><Glyphicon glyph="picture" /> Photo</Button>
          </ButtonToolbar>
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
              { children && children }
              { !children && this.renderChooser() }
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
