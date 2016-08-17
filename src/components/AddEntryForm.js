import React, { Component } from 'react';
import Relay from 'react-relay';
import { Button, Panel } from 'react-bootstrap';
import EntryForm from './EntryForm';
import AddEntryMutation from './mutations/AddEntryMutation';

export class AddEntryForm extends Component {
    static propTypes = {
        open: React.PropTypes.bool
    }
    static defaultProps = {
        open: false
    }
    constructor(props) {
        super(props);
        this.state = {
            open: props.open
        }

        this.handleDone = this.handleDone.bind(this);
    }

    handleDone(entry) {
        var viewer = this.props.viewer;
        this.props.relay.commitUpdate(
            new AddEntryMutation({viewer, entry})
        );
    }

    render() {
        return (
            <div>
                <Button block onClick={() => this.setState({ open: !this.state.open })}
                    bsStyle="primary" bsSize="large">
                    Add an entry
                </Button>
                <Panel collapsible expanded={this.state.open}>
                    <EntryForm done={this.handleDone}/>
                </Panel>
            </div>
        );
    }
};

export const AddEntryFormContainer = Relay.createContainer(AddEntryForm, {
    fragments: {
        viewer: () => Relay.QL`
            fragment on Viewer {
                id
                ${AddEntryMutation.getFragment('viewer')}
            }
        `,
    }
});
