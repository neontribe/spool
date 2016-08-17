import Relay from 'react-relay';

export default class AddEntryMutation extends Relay.Mutation {
    getMutation() {
        return Relay.QL`mutation {createEntry}`
    }

    getVariables() {
        // this.props use to create mutation layout
    }

    getFatQuery() {
        return Relay.QL`
        fragment on CreateEntryPayload {
            viewer {
                entries
                numEntries
            }
            entryEdge
        }`
    }
}
