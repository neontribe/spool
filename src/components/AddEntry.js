import React, { Component } from 'react';
import Relay from 'react-relay';
import _ from 'lodash';
import { withRouter } from 'react-router';

import AddEntryMutation from './mutations/AddEntryMutation';
import withRoles from '../auth/withRoles.js';

import styles from './css/AddEntry.module.css';

class AddEntry extends Component {
    constructor (props) {
        super(props);

        this.state = {
            entry: props.entry
        }

        this.saveEntry = this.saveEntry.bind(this);
        this.setEntryData = this.setEntryData.bind(this);
        this.getPathForNextStage = this.getPathForNextStage.bind(this);
    }

    saveEntry (entry) {
        var creator = this.props.creator;

        var onSuccess = ({createEntry}) => {
            var entry = createEntry.entryEdge.node;

            if (entry.requests.length > 0) {
                // We have a user request for this new entry
                this.props.router.push('/entry/' + entry.id + '/requests');
            } else {
                this.props.router.push('/home');
            }
        }

        this.props.relay.commitUpdate(
            new AddEntryMutation({
                creator,
                entry
            }),
            {
                onSuccess
            }
        );
    }

    getPathForNextStage () {
        // Find the index of this components route in the routes
        var addIndex = this.props.routes.indexOf(this.props.route);

        // Use it to find the current route under this component (the stage)
        // which will allow us to ignore the other routes nested under any multi option stage.
        var currentStage = this.props.routes[addIndex + 1].path;
        var currentStepIndex = _.findIndex(this.props.route.childRoutes, { path: currentStage });

        if (this.props.route.childRoutes[currentStepIndex + 1]) {
            let nextRoute = this.props.route.childRoutes[currentStepIndex + 1].path;
            let routes = this.props.routes.slice(0, addIndex + 1).map(route => route.path);

            routes.push(nextRoute);

            return routes.join('/').replace('//', '/');
        } else {
            return null;
        }
    }

    setEntryData (key, value) {
        var entry = _.merge({}, this.state.entry, { [key]: value });

        this.setState({
            entry
        });

        var pathForNext = this.getPathForNextStage();

        if (pathForNext) {
            this.props.router.push(pathForNext);
        } else {
            this.saveEntry(entry);
        }
    }

    render () {
        let children = null;

        if (this.props.children) {
            children = React.cloneElement(this.props.children, {
                save: this.setEntryData,
                topics: this.props.creator.topics
            });
        }

        return (
            <div className={styles.wrapper}>{children}</div>
        );
    }
};

AddEntry.propTypes = {
    entry: React.PropTypes.object
}

AddEntry.defaultProps = {
    entry: {}
}

export default withRouter(AddEntry);

export const AddEntryContainer = Relay.createContainer(withRoles(withRouter(AddEntry), {
    roles: ['creator'],
    fallback: '/settings/configure',
}), {
    fragments: {
        user: () => Relay.QL`
        fragment on User {
            role
        }`,
        creator: () => Relay.QL`
            fragment on Creator {
                id
                topics {
                    type,
                    name
                }
                ${AddEntryMutation.getFragment('creator')}
            }
        `,
    }
});
