import Relay from 'react-relay';

export default class UpdateEntryRequestMutation extends Relay.Mutation {
    static fragments = {
        entry: () => Relay.QL`
        fragment on Entry {
            id
        }`,
        userRequest: () => Relay.QL`
        fragment on UserRequest {
            id
        }`,
    }
    getMutation() {
        return Relay.QL`mutation {updateEntryRequest}`
    }

    getVariables() {
        return {
            entryId: this.props.entry.id,
            userRequestId: this.props.userRequest.id,
            access: this.props.access,
        }
    }

    getFatQuery() {
        return Relay.QL`
        fragment on UpdateEntryRequestPayload {
            creator {
                id
            }
        }`
    }

    getConfigs() {
        return [];
    }
}
