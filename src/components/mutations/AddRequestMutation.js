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
                    from: moment(this.props.request.fromDate).format(),
                    to: moment(this.props.request.toDate).format()
                }
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