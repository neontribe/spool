import Relay from 'react-relay';

export default class UpdateUserMutation extends Relay.Mutation {
    static fragments = {
        user: () => Relay.QL`
        fragment on User {
            id
        }`
    }
    getMutation() {
        return Relay.QL`mutation {updateUser}`
    }

    getVariables() {
        //this.props.blah
        return {
            user: {
                region: this.props.region,
                roleSecret: this.props.secret,
            }
        }
    }

    getFatQuery() {
        return Relay.QL`
        fragment on UpdateUserPayload {
            user {
                region
                role
            }
        }`
    }

    getConfigs() {
        return [{
            type: 'FIELDS_CHANGE',
            fieldIDs: {user: this.props.user.id}
        }];
    }
}
