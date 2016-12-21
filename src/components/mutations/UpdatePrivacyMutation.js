import Relay from 'react-relay';

export default class UpdatePrivacyMutation extends Relay.Mutation {
    static fragments = {
        user: () => Relay.QL`
        fragment on User {
            id
        }`
    }
    getMutation() {
        return Relay.QL`mutation {updatePrivacy}`
    }

    getVariables() {
        const { sharing } = this.props;
        return {
            privacy: { sharing },
        }
    }

    getFatQuery() {
        return Relay.QL`
        fragment on UpdatePrivacyPayload {
            user {
                profile
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
