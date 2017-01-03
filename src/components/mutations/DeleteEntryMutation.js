import Relay from 'react-relay';

export default class DeleteEntryMutation extends Relay.Mutation {
    static fragments = {
        entry: () => Relay.QL`
        fragment on Entry {
            id
        }`,
        creator: () => Relay.QL`
        fragment on Creator {
            id
        }`,
    }

    getMutation() {
        return Relay.QL`mutation {deleteEntry}`
    }

    getVariables() {
        const { id } = this.props.entry;

        return { entryId: id };
    }

    getFatQuery() {
        return Relay.QL`
        fragment on DeleteEntryPayload {
            deletedEntryId
            creator {
                entries
                happyCount
                sadCount
            }
        }`
    }

    getConfigs() {
        return [{
            type: 'NODE_DELETE',
            parentName: 'creator',
            parentID: this.props.creator.id,
            connectionName: 'entries',
            deletedIDFieldName: 'deletedEntryId',
        }]
    }
}
