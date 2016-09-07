import React, { Component } from 'react';
import Relay from 'react-relay';
import { Grid, Row, Col } from 'react-bootstrap';
import AddEntryMutation from './mutations/AddEntryMutation';
import _ from 'lodash';
import { withRouter } from 'react-router';

class AddEntry extends Component {

    constructor(props) {
        super(props);
        this.state = {
            entry: props.entry
        }

        this.saveEntry = this.saveEntry.bind(this);
        this.setEntryData = this.setEntryData.bind(this);
        this.getPathForNextStage = this.getPathForNextStage.bind(this);
    }

    saveEntry(entry) {
        var viewer = this.props.viewer;
        var onSuccess = () => {
            this.props.router.push('/home');
        }
        this.props.relay.commitUpdate(
            new AddEntryMutation({viewer, entry}),
            {onSuccess}
        );
    }

    getPathForNextStage(){
        // Find our next route and calculate its path in order to navigate to it.
        // This is all a bit of a faff, really.

        // Find the index of this components route in the routes
        var addIndex = _.findIndex(this.props.routes, {path: this.props.route.path});
        // Use it to find the current route under this component (the stage)
        // which will allow us to ignore the other routes nested under any multi option stage.
        var currentStage = this.props.routes[addIndex + 1].path;
        var currentStepIndex = _.indexOf(this.props.stages, currentStage);
        if (this.props.stages[currentStepIndex + 1]) {
            let nextRoute = this.props.stages[currentStepIndex + 1];
            let routes = this.props.routes.slice(0, addIndex + 1).map(route => route.path);
            routes.push(nextRoute);
            return routes.join('/').replace('//', '/');
        } else {
            return null;
        }
    }

    setEntryData(key, value) {
        var entry = _.merge({}, this.state.entry, {[key]: value});
        this.setState({entry});
        var pathForNext = this.getPathForNextStage();
        if (pathForNext) {
            this.props.router.push(pathForNext);
        } else {
            this.saveEntry(entry);
        }
    }

    render() {
        let children = null;
        if (this.props.children) {
            children = React.cloneElement(this.props.children, {
                save: this.setEntryData,
                topics: this.props.viewer.topics
            });
        }
        return (
            <Grid>
                <Row>
                    <Col xsOffset={3} xs={6}>
                        { children }
                    </Col>
                </Row>
            </Grid>
        );
    }
};
AddEntry.propTypes = {
    entry: React.PropTypes.object,
    stages: React.PropTypes.array
}
AddEntry.defaultProps = {
    entry: {},
    stages: ['topic', 'sentiment', 'media']
}

export default withRouter(AddEntry);

export const AddEntryContainer = Relay.createContainer(withRouter(AddEntry), {
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
