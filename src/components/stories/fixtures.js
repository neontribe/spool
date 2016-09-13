import moment from 'moment';

export const textEntry = {
    media: {
        text: "Riding on the front seat at the top!"
    },
    sentiment: {
        type: "happy",
    },
    topic: [{
        name: 'Transport',
    }],
    timestamp: moment().format()
};

export const videoEntry = {
    media: {
        video: "/static/example.webm",
        videoThumbnail: "/static/queue.jpg",
    },
    sentiment: {
        type: "sad",
    },
    topic: [{
        name: 'Public Transport',
    }],
    timestamp: moment().format()
};

export const videoEntryWithText = {
    media: {
        video: "/static/example.webm",
        videoThumbnail: "/static/queue.jpg",
        text: "Queuing for the bus sucks"
    },
    sentiment: {
        type: "sad",
    },
    topic: [{
        name: 'Public Transport',
    }],
    timestamp: moment().format()
};

export const imageEntry = {
    media: {
        image: "/static/queue.jpg",
        imageThumbnail: "/static/queue.jpg",
    },
    sentiment: {
        type: "sad",
    },
    topic: [{
        name: 'Public Transport',
    }],
    timestamp: moment().format()
};

export const imageEntryWithText = {
    media: {
        image: "/static/queue.jpg",
        imageThumbnail: "/static/queue.jpg",
        text: "Queuing for the bus sucks"
    },
    sentiment: {
        type: "sad",
    },
    topic: [{
        name: 'Public Transport',
    }],
    timestamp: moment().format()
};

export const entries =  [
    {
        id: '1',
        media: {
            text: "Riding on the front seat at the top!"
        },
        sentiment: {
            type: "happy",
        },
        topic: [{
            name: 'Transport',
        }],
        timestamp: moment().subtract(1, 'days').format()
    },
    {
        id: '2',
        media: {
            text: "Queuing for a bus in the rain."
        },
        sentiment: {
            type: "sad"
        },
        topic: [{
            name: 'Transport',
        }],
        timestamp: moment().subtract(2, 'days').format()
    },
    {
        id: '3',
        media: {
            text: "Football training with friends"
        },
        sentiment: {
            type: "happy",
        },
        topic: [{
            name: 'Transport',
        }],
        timestamp: moment().subtract(3, 'days').format()
    },
];

export const topics = [
    { name: 'Transport', type: 'transport' },
    { name: 'Health', type: 'health' },
    { name: 'Leisure', type: 'leisure' },
    { name: 'Work', type: 'work' },
    { name: 'Food', type: 'food' },
];

export const googleProfile = {
    "email": "fernando@example.com",
    "email_verified": true,
    "name": "Fernando Hoss",
    "given_name": "Fernando",
    "family_name": "Hoss",
    "picture": "https://lh3.googleusercontent.com/-HG2Xt5yec7U/AAAAAAAAAAI/AAAAAAAAAmc/PUccB8Tp_4k/photo.jpg",
    "gender": "male",
    "locale": "en-GB",
    "clientID": "seekrit",
    "updated_at": "2016-08-16T12:41:43.462Z",
    "user_id": "google-oauth2|xxxx",
    "nickname": "fernando.hoss",
    "identities": [
        {
            "provider": "google-oauth2",
            "user_id": "xxxx",
            "connection": "google-oauth2",
            "isSocial": true
        }
    ],
    "created_at": "2016-08-15T23:01:02.918Z",
    "global_client_id": "xxxx"
};

export const auth = {
    getProfile: function() { return googleProfile; }
};
