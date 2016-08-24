import Relay from 'react-relay';
import moment from 'moment';

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
        var media = this.props.entry.media;
        var mediaInput = {};
        if(media.video) {
            mediaInput.video = media.video.key;
            mediaInput.videoThumbnail = media.videoThumbnail.key;
        }
        if(media.image) {
            mediaInput.image = media.image.key;
            mediaInput.imageThumbnail = media.imageThumbnail.key;
        }

        mediaInput.text = media.text;
        return {
            entry: {
                media: mediaInput,
                sentiment: entry.sentiment,
                topic: [entry.topic]
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
        status === 'completed' ? 'ignore' : 'prepend'
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
                media: entry.media,
                topic: [{
                    type: entry.topic
                }],
                sentiment: {
                    type: entry.sentiment
                },
                timestamp: moment().format()
              }
          }
      }
  }
}
