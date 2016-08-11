import React, { Component } from 'react';
import { FormGroup, FormControl, ControlLabel, Button } from 'react-bootstrap';

class EntryForm extends Component {
  render() {
    return (
      <form>
        <FormGroup controlId="entryText">
            <ControlLabel>Entry Text</ControlLabel>
            <FormControl componentClass="textarea" placeholder=""/>
        </FormGroup>
        <FormGroup controlId="sentiment">
            <ControlLabel>Sentiment</ControlLabel>
            <FormControl componentClass="select" placeholder="select">
                <option value="happy">happy</option>
                <option value="sad">sad</option>
            </FormControl>
        </FormGroup>
        <FormGroup controlId="topic">
          <ControlLabel>Topic</ControlLabel>
          <FormControl componentClass="select" placeholder="select">
            <option value="public_transport">Public Transport</option>
            <option value="sport">Sport</option>
          </FormControl>
        </FormGroup>
        <Button bsStyle="primary">Save</Button>
      </form>
    );
  }
}

export default EntryForm;
