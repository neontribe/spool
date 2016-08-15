import React, { Component } from 'react';
import { Button, Panel } from 'react-bootstrap';
import EntryForm from './EntryForm';


class AddEntryForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            open: props.open
        }
    }

    render() {
        return (
            <div>
                <Button block onClick={() => this.setState({ open: !this.state.open })}
                    bsStyle="primary" bsSize="large">
                    Add an entry
                </Button>
                <Panel collapsible expanded={this.state.open}>
                    <EntryForm />
                </Panel>
            </div>
        );
    }
};

AddEntryForm.propTypes = {
    open: React.PropTypes.bool
};

AddEntryForm.defaultProps = {
    open: false
};

export default AddEntryForm;
