import Relay from 'react-relay';
import moment from 'moment';

export default class AddEntryMutation extends Relay.Mutation {
    static fragments = {
        creator: () => Relay.QL`
        fragment on Creator {
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
                topics: entry.topics
            }
        }
    }

    getFatQuery() {
        return Relay.QL`
        fragment on CreateEntryPayload {
            creator {
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
      parentName: 'creator',
      parentID: this.props.creator.id,
      connectionName: 'entries',
      edgeName: 'entryEdge',
      rangeBehaviors: ({ status }) => (
        status === 'completed' ? 'ignore' : 'prepend'
      ),
    }];
  }
}
