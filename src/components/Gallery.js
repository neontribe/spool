import React, { Component } from 'react';
import Relay from 'react-relay';
import { Link } from 'react-router';
import { Carousel } from 'react-bootstrap';
import _ from 'lodash';

import { EntryContainer, Entry } from './Entry';
import Layout from './Layout';
import Grid from './Grid';
import { withRoles, withRequiredIntroduction, withRequiredSetup, userFragment } from './wrappers.js';

import styles from './css/Gallery.module.css';

import IconFilter from './IconFilter.js';

const { Content, Header } = Layout;

class EntryCarousel extends Component {
    constructor (props) {
        super(props);

        this.state = {
            activeIndex: 0
        };
    }

    static propTypes = {
        interval: React.PropTypes.number,
        offset: React.PropTypes.number
    }

    static defaultProps = {
        interval: 6000,
        offset: 0
    }

    componentDidMount () {
        this.timeout = setTimeout(() => {
            this.intervalId = setInterval(() => {
                if (Math.random() >= 0.5) {
                    var newIndex = this.state.activeIndex + 1;

                    if (newIndex >= React.Children.count(this.props.children)) {
                        newIndex = 0;
                    }

                    this.setState({
                        activeIndex: newIndex
                    });
                }
            }, this.props.interval);
        }, this.props.offset);
    }

    componentWillUnmount () {
        clearTimeout(this.timeout);
        clearInterval(this.intervalId);
    }

    render () {
        return (
            <Carousel
                activeIndex={this.state.activeIndex}
                controls={false}
                indicators={React.Children.count(this.props.children) > 1}
            >
                {React.Children.map(this.props.children, (content) => (
                    <Carousel.Item>
                        {content}
                    </Carousel.Item>
                ))}
            </Carousel>
        );
    }
}

export class Gallery extends Component {
    static propTypes = {
        creator: React.PropTypes.object.isRequired,
    }

    constructor (props) {
        super(props);
        this.state = {
            filters: {}
        }
        this.handleFilterChange = this.handleFilterChange.bind(this);
    }

    // Returns the latest entry followed by up to 4 randomised entry carousels
    renderEntries () {
        const MAX_CAROUSEL_ITEMS = 3; // per EntryCarousel

        var EntryComponent = (this.props.relay) ? EntryContainer : Entry;
        var entries = this.props.creator.entries.edges.slice();

        if (entries.length) {
            var latest = entries.shift();
            var items = [
                <EntryComponent key={0} entry={latest.node} thumbnailMode={true} />
            ];

            var slots = entries.length;

            if (slots > 4) {
                slots = 4;
            }

            var slides = [];

            while (entries.length) {
                for (let i = 0; i < slots; i++) {
                    if (entries.length) {
                        if (!slides[i]) {
                            slides[i] = [];
                        }

                        slides[i].push(entries.shift());
                    }
                }
            }

            for (let i = 0; i < slides.length; i++) {
                var _slides = [];
                var maxSlides = slides[i].length;

                if (maxSlides > MAX_CAROUSEL_ITEMS) {
                    maxSlides = MAX_CAROUSEL_ITEMS;
                }

                for (let j = 0; j < maxSlides; j++) {
                    _slides.push(
                        <EntryComponent key={j} entry={slides[i][j].node} thumbnailMode={true} />
                    );
                }

                items.push(
                    <EntryCarousel key={i + 1} offset={1000 + (i * 500)}>
                        {_slides}
                    </EntryCarousel>
                );
            }

            return items;
        }
    }

    /* Todo: handleFilterChange */
    handleFilterChange (filters) {
        var active = _.reduce(filters, (reduction, value, key) => {
            if(value) {
                reduction.push(key);
            }
            return reduction;
        }, []);

        var mediaArguments;
        const { text, video, image } = filters;
        if(text || video || image) {
            mediaArguments = {
                text, video, image
            };
        }
        const filterArguments = {
            topics: _.intersection(active, ['work', 'learning', 'home', 'food', 'relationships', 'activities', 'travel', 'health']),
            sentiment: _.intersection(active, ['happy', 'sad']),
            media: mediaArguments
        };
        this.setState({filters});
        this.props.relay.setVariables({
            filter: filterArguments
        }); 
    }

    renderMenuContent () {
        return (
            <IconFilter onChange={this.handleFilterChange} filters={this.state.filters}/>
        );
    }

    render () {
        var addEntryControl = (
            <Link to='/app/add' className={styles.addEntryControl}>
                <span className={styles.button}>
                    <span className={styles.handIcon}></span> Add New Entry
                </span>
            </Link>
        );

        return (
            <Layout>
                <Header
                    auth={this.props.auth}
                    menuContent={this.renderMenuContent()}/>
                <Content>
                    <div className={styles.wrapper}>
                        <Grid callToAction={addEntryControl}>
                            {this.renderEntries()}
                        </Grid>
                    </div>
                </Content>
            </Layout>
        );
    }
}

const WrappedGallery = withRoles(withRequiredSetup(withRequiredIntroduction(Gallery)), ['creator']);

export const GalleryContainer = Relay.createContainer(WrappedGallery, {
    initialVariables: {
        first: 15,
        random: true,
        filter: {
            sentiment: ['happy', 'sad'],
            topics: ['work', 'learning', 'home', 'food', 'relationships', 'activities', 'travel', 'health'],
            media: {
                text: true,
                video: true,
                image: true,
            }
        }
    },
    fragments: {
        user: () => Relay.QL`
        fragment on User {
                ${userFragment}
        }`,
        creator: () => Relay.QL`
        fragment on Creator {
            happyCount
            sadCount
            entries(first: $first, random: $random, filter: $filter) {
                edges {
                    node {
                        id,
                        ${EntryContainer.getFragment('entry')}
                    }
                }
            }
        }`,
    }
});
