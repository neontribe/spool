import Relay from 'react-relay';

export default class UpdateUserRequestMutation extends Relay.Mutation {
    static fragments = {
        creator: () => Relay.QL`
        fragment on Creator {
            id
        }`,
        userRequest: () => Relay.QL`
        fragment on UserRequest {
            id
        }`,
    }
    getMutation() {
        return Relay.QL`mutation {updateUserRequest}`
    }

    getVariables() {
        return {
            userRequest: {
                id: this.props.userRequest.id,
                hide: true,
                // retrospectively allow access to entries within range
                access: this.props.access,
            }
        }
    }

    getFatQuery() {
        return Relay.QL`
        fragment on UpdateUserRequestPayload {
            userRequestId
            creator {
                requests
            }
        }`
    }

    getConfigs() {
        // Delete the user request (since it will be seen)
        // Request a whole new copy of creator data (this sucks, but it could be worse)
        return [{
            type: 'NODE_DELETE',
            parentName: 'creator',
            parentID: this.props.creator.id,
            connectionName: 'requests',
            deletedIDFieldName: 'userRequestId',
        }];
    }
}
