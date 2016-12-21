import Relay from 'react-relay';

export default class HideIntroductionMutation extends Relay.Mutation {
    static fragments = {
        user: () => Relay.QL`
        fragment on User {
            id
        }`
    }
    getMutation() {
        return Relay.QL`mutation {hideIntroduction}`
    }

    getVariables() {
        return {};
    }

    getFatQuery() {
        return Relay.QL`
        fragment on HideIntroductionPayload {
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
