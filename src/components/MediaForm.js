import React, { Component } from 'react';
import { Grid, Row, Col, Button, Glyphicon } from 'react-bootstrap';
import { withRouter } from 'react-router';
import _ from 'lodash';

class MediaForm extends Component {

  constructor(props) {
    super(props);

    this.state = {};

    this.setMediaType = _.debounce(this.setMediaType.bind(this), 500, {leading: true, trailing: false});
    this.renderChooser = this.renderChooser.bind(this);
  }

  setMediaType(type) {
      this.props.router.push('/add/message/' + type);
  }

  renderChooser() {
      return (
          <div className='media-form'>
              <Grid>
                  <Row>
                      <Col xsOffset={3} xs={6}>
                          <Button onClick={_.partial(this.setMediaType, 'video')}><Glyphicon glyph="film" /> Video</Button>
                      </Col>
                      <Col xsOffset={3} xs={6}>
                          <Button onClick={_.partial(this.setMediaType, 'photo')}><Glyphicon glyph="picture" /> Photo</Button>
                          <Button onClick={_.partial(this.setMediaType, 'typing')}><Glyphicon glyph="pencil" /> Words</Button>
                      </Col>
                  </Row>
              </Grid>
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
