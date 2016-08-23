import React, { Component } from 'react';
import Relay from 'react-relay';
import { Grid, Row, Col, Button, ButtonToolbar, Glyphicon, Modal } from 'react-bootstrap';
import _ from 'lodash';
import EntryForm from './EntryForm';
import AddEntryMutation from './mutations/AddEntryMutation';

export class AddEntryForm extends Component {

    constructor(props) {
        super(props);
        this.state = {
            show: props.show,
            entry: props.entry
        }

        this.handleDone = this.handleDone.bind(this);
        this.showForm = this.showForm.bind(this);
    }

    handleDone(entry, cb) {
        var viewer = this.props.viewer;
        var onSuccess = () => {
            this.setState({show: false});
            cb();
        }
        this.props.relay.commitUpdate(
            new AddEntryMutation({viewer, entry}),
            {onSuccess}
        );
    }

    showForm(type) {
        this.setState({
            show: true,
            entry: {
                type
            }
        })
    }

    render() {
        return (
            <Grid>
                <Row>
                    <Col xs={12}>
                        <ButtonToolbar>
                            <Button block onClick={_.partial(this.showForm, 'text')}
                                bsStyle="primary" bsSize="large">
                                <Glyphicon glyph="pencil"/> Text
                            </Button>
                            <Button onClick={_.partial(this.showForm, 'video')}
                                bsStyle="primary" bsSize="large">
                                <Glyphicon glyph="film"/> Video
                            </Button>
                            <Button onClick={_.partial(this.showForm, 'image')}
                                bsStyle="primary" bsSize="large">
                                <Glyphicon glyph="camera"/> Image
                            </Button>
                            <Modal show={this.state.show}
                                onHide={() => this.setState({ show: false })}
                                backdrop={true}
                                bsSize="large">
                                <Modal.Header closeButton>
                                    <Modal.Title>New Entry</Modal.Title>
                                </Modal.Header>
                                <Modal.Body>
                                    <EntryForm topics={this.props.viewer.topics} done={this.handleDone} entry={this.state.entry}/>
                                </Modal.Body>
                                <Modal.Footer></Modal.Footer>
                            </Modal>
                        </ButtonToolbar>
                    </Col>
                </Row>
            </Grid>
        );
    }
};
AddEntryForm.propTypes = {
    show: React.PropTypes.bool,
    entry: React.PropTypes.object
}
AddEntryForm.defaultProps = {
    show: false,
    entry: {}
}

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
