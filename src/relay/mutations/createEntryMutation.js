import Relay from 'react-relay';

export default class CreateEntryMutation extends Relay.Mutation {
  static fragments = {};
  getMutation() {
    return Relay.QL`mutation{createEntry}`;
  }
  getFatQuery() {
    return Relay.QL`
      fragment on CreateEntryPayload {
          id
          _id
      }
    `;
  }
 /*
  getConfigs() {
    return [{
      type: 'FIELDS_CHANGE',
      fieldIDs: {
        hidingSpot: this.props.hidingSpot.id,
        game: this.props.game.id,
      },
    }];
  } */
  getVariables() {
    return this.props.entry;
  }
  getOptimisticResponse() {
    return this.props.entry;
  }
}
