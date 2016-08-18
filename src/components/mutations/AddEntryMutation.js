import Relay from 'react-relay';

export default class AddEntryMutation extends Relay.Mutation {
    static fragments = {
        viewer: () => Relay.QL`
        fragment on Viewer {
            id
        }`
    }
    getMutation() {
        return Relay.QL`mutation {createEntry}`
    }

    getVariables() {
        var entry = this.props.entry;
        return {
            entry: {
                media: {
                    text: entry.text,
                },
                author: 2,
                owner: 2,
                sentiment: entry.sentiment,
                topic: entry.topic
            }
        }
    }

    getFatQuery() {
        return Relay.QL`
        fragment on CreateEntryPayload {
            viewer {
                entries
            }
            entryEdge
        }`
    }


  getConfigs() {
    return [{
      type: 'RANGE_ADD',
      parentName: 'viewer',
      parentID: this.props.viewer.id,
      connectionName: 'entries',
      edgeName: 'entryEdge',
      rangeBehaviors: ({ status }) => (
        status === 'completed' ? 'ignore' : 'append'
      ),
    }];
  }

  getOptimisticResponse() {
      var viewer = this.props.viewer;
      var entry = this.props.entry;
      return {
          viewer: {
              id: viewer.id
          },
          entryEdge: {
              node: {
                media: {
                    text: entry.text
                },
                topic: {
                    type: entry.topic
                },
                sentiment: {
                    type: entry.sentiment
                }
              }
          }
      }
  }
}