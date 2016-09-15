import React, { Component } from 'react';
import { Grid, Row, Col } from 'react-bootstrap';
import { withRouter } from 'react-router';
import IconChooser from './IconChooser';
import AddControls from './AddControls';
import _ from 'lodash';

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

  constructor(props) {
    super(props);

    this.state = {
        types: []
    };

    this.handleNext = this.handleNext.bind(this);
    this.handleChoice = this.handleChoice.bind(this);
  }

  handleNext() {
      this.props.router.push('/add/message/' + this.state.types[0]);
  }

  handleChoice(values) {
      this.setState({types: values});
  }

  renderChooser() {
      return (
          <Grid>
              <Row>
                  <Col xs={12} xsOffset={1}>
                      <IconChooser
                          label="How would you like to make your message?"
                          choices={choices}
                          maxSelections={1}
                          onChange={this.handleChoice} />
                  </Col>
              </Row>
              <Row>
                  <AddControls onNext={this.handleNext} disableNext={!this.state.types.length} />
              </Row>
          </Grid>
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
