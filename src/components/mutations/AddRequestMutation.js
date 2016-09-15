import Relay from 'react-relay';
import moment from 'moment';

export default class AddRequestMutation extends Relay.Mutation {
    static fragments = {
        viewer: () => Relay.QL`
        fragment on Viewer {
            id
        }`
    }
    getMutation() {
        return Relay.QL`mutation {createRequest}`
    }

    getVariables() {
        return {
            request: {
                range: {
                    from: moment(this.props.request.fromDate).startOf('date').format(),
                    to: moment(this.props.request.toDate).endOf('date').format(),
                },
                name: this.props.request.issuerName,
                reason: this.props.request.reason,
                org: this.props.request.organization,
                avatar: this.props.request.issuerAvatar,
                topic: this.props.request.topics
            }
        }
    }

    getFatQuery() {
        return Relay.QL`
        fragment on CreateRequestPayload {
            viewer {
                id
            }
        }`
    }

    getConfigs() {
        return [];
    }
}
