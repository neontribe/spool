const PubSub =  require('pubsub-js');
const db = require('./database/database');
const models = require('./database/models');

export const ENTRY_ADD = 'ENTRY_ADD';

export class RewardEngine {
    constructor(rewards) {
		this.rewards = rewards;
    }

    change(change, data) {
        PubSub.publishSync(change, data);
    }

    when(change, action) {
        // if change is part of our configured changes
        // subscribe to that change with the action
        PubSub.subscribe(change, action);
    }
}

const rewards = new RewardEngine(rewards);

export const calculate25Entries = function(user) {
	var p = new Promise(function(resolve, reject) {
		models.Reward.findIncompleteByUserIdAndType(user.id, '25_entries').then(function(rewards) {
		});
	});
	return p;

	var p = new Promise(function(resolve, reject) {
		models.Entry.findByOwnerId(user.id).then(function(entries) {
			if(entries.length >= 25) {
				// grant reward
			}
			resolve({
				type: '25_entries',
				name: '25 entries yada yada',
				count: 1,
				goal: 3
			});
		});
	});
	return p;
}

rewards.when(ENTRY_ADD, calculate25Entries);
rewards.change(ENTRY_ADD, {userId: 3});
