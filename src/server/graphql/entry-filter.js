module.exports = class EntryFilter {
    constructor(args) {
        this.filters = args;
    }

    sentiment(entry) {
        const sentiments = this.filters.sentiment;
        if (!sentiments || !sentiments.length) {
            return true;
        }
        const sentiment = entry.Sentiment.type;
        return !!(sentiments.indexOf(sentiment) + 1);
    }

    topic(entry) {
        const topics = this.filters.topics;
        if (!topics || !topics.length) {
            return true;
        }
        var valid = -1;
        // @todo _ first or something
        for (var i=0; i<entry.EntryTopicTopics.length && valid === -1; i++) {
            let topic = entry.EntryTopicTopics[i];
            valid = topics.indexOf(topic.type);
        }
        return !!(valid + 1);
    }

    media(entry) {
        if(!this.filters.media) {
            return true;
        }
        const { image, video, text } = this.filters.media;
        if(text && entry.Medium.text) {
            return true;
        }
        if(video && entry.Medium.video) {
            return true;
        }
        if(image && entry.Medium.image) {
            return true;
        }
        return false;
    }

    filter(entries) {
        return entries.filter((entry) => {
            return this.sentiment(entry) && this.media(entry) && this.topic(entry);
        });
    }
}
