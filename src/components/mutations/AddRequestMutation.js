import Relay from 'react-relay';
import moment from 'moment';

export default class AddRequestMutation extends Relay.Mutation {
    static fragments = {
        consumer: () => Relay.QL`
        fragment on Consumer {
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
                name: this.props.request.name,
                reason: this.props.request.reason,
                org: this.props.request.org,
                avatar: this.props.request.avatar,
                topics: this.props.request.topics
            }
        }
    }

    getFatQuery() {
        return Relay.QL`
        fragment on CreateRequestPayload {
            consumer {
                id
            }
        }`
    }

    getConfigs() {
        return [];
    }
}
