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

    handleDone(entry, cb) {
        var viewer = this.props.viewer;
        var onSuccess = () => {
            this.setState({open: false});
            cb();
        }
        this.props.relay.commitUpdate(
            new AddEntryMutation({viewer, entry}),
            {onSuccess}
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
                    <EntryForm topics={this.props.viewer.topics} done={this.handleDone}/>
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
                topics {
                    type,
                    name
                }
                ${AddEntryMutation.getFragment('viewer')}
            }
        `,
    }
});
