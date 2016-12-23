import React, { Component } from 'react';
import Relay from 'react-relay';
import { Link } from 'react-router';
import { Carousel } from 'react-bootstrap';

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

    constructor(props) {
        super(props);
        this.handleFilterChange = this.handleFilterChange.bind(this);
    }

    // Returns the latest entry followed by up to 4 randomised entry carousels
    renderEntries () {
        var EntryComponent = (this.props.relay) ? EntryContainer : Entry;
        var entries = this.props.creator.entries.edges.slice();
        var maxSlideCount = 3; // per EntryCarousel

        if (entries.length) {
            var latest = entries.shift();
            var items = [
                <EntryComponent key={0} entry={latest.node} thumbnailMode={true} />
            ];

            var slots = entries.length;

            if (slots > 4) {
                slots = 4;
            }

            var entryIndexCounter = 0;
            var slides = [];

            while (entries.length) {
                for (var i = 0; i < slots; i++) {
                    if (entries.length) {
                        if (!slides[i]) {
                            slides[i] = [];
                        }

                        var entry = entries.shift();

                        slides[i].push(entry);
                    }
                }
            }

            for (var i = 0; i < slides.length; i++) {
                var _slides = [];

                for (var j = 0; j < slides[i].length; j++) {
                    var entry = slides[i][j];

                    _slides.push(
                        <EntryComponent key={j} entry={entry.node} thumbnailMode={true} />
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

    handleFilterChange (filters) {
        console.log(filters);
    }

    renderMenuContent() {
        return (<IconFilter onChange={this.handleFilterChange} />);
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
            entries(first: $first, random: $random) {
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
