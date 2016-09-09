import Relay from 'react-relay';

export default class UpdateUserMutation extends Relay.Mutation {
    static fragments = {
        viewer: () => Relay.QL`
        fragment on Viewer {
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
                //                roleSecret: this.props.roleSecret,
                roleSecret: 'test123',
            }
        }
    }

    getFatQuery() {
        return Relay.QL`
        fragment on UpdateUserPayload {
            viewer {
                role 
            }
        }`
    }

    getConfigs() {
        return [{
            type: 'FIELDS_CHANGE',
            fieldIDs: {viewer: this.props.viewer.id}
        }];
    }
}
