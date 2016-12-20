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
        const { region, name, nickname, age, residence, services } = this.props;
        return {
            user: { region, name, nickname, age, residence, services },
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
