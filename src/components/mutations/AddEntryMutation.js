import Relay from 'react-relay';
import moment from 'moment';

export default class AddEntryMutation extends Relay.Mutation {
    static fragments = {
        viewer: () => Relay.QL`
        fragment on Viewer {
            id
            happyCount
            sadCount
        }`
    }
    getMutation() {
        return Relay.QL`mutation {createEntry}`
    }

    getVariables() {
        var entry = this.props.entry;
        var media = this.props.entry.media;
        var mediaInput = {};
        if(media.video) {
            mediaInput.video = media.video.key;
            mediaInput.thumbnail = media.thumbnail.key;
        }
        mediaInput.text = media.text;
        return {
            entry: {
                media: mediaInput,
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
                happyCount
                sadCount
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
        status === 'completed' ? 'ignore' : 'prepend'
      ),
    }];
  }

  getOptimisticResponse() {
      var viewer = this.props.viewer;
      var entry = this.props.entry;
      var happyCount = this.props.viewer.happyCount;
      var sadCount = this.props.viewer.sadCount;
      switch (entry.sentiment) {
          case 'happy':
              happyCount++;
              break;
          case 'sad':
              sadCount++;
              break;
          default:
              break;
      }
      return {
          viewer: {
              id: viewer.id,
              happyCount,
              sadCount
          },
          entryEdge: {
              node: {
                media: entry.media,
                topic: entry.topic.map((t) => {return { name: t }}),
                sentiment: {
                    type: entry.sentiment
                },
                timestamp: moment().format()
              }
          }
      }
  }
}
