import React from 'react';
import Relay from 'react-relay';

class RoleSwitch extends React.Component {
    render() {
        return (
            <div>
                {this.props[this.props.viewer.role.__typename]}
            </div>
        );
    }
}

RoleSwitch.propTypes = {
    viewer: React.PropTypes.object.isRequired
}

const RoleSwitchContainer = Relay.createContainer(RoleSwitch, {
    fragments: {
        viewer: () => Relay.QL`
        fragment on Viewer {
            role {
                __typename
            }
        }`,
    }
});

export default RoleSwitchContainer;
