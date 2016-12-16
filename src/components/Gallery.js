import React, { Component } from 'react';
import Relay from 'react-relay';
import { Link } from 'react-router';
import { Carousel } from 'react-bootstrap';

import { EntryContainer, Entry } from './Entry';
import Layout from './Layout';
// import Intro from './Intro';
import Grid from './Grid';
import withRoles from '../auth/withRoles.js';

import styles from './css/Gallery.module.css';

const { Content, Header } = Layout;

class EntryCarousel extends Component {
    constructor (props) {
        super(props);

        this.state = {
            activeIndex: 0,
            intervalId: null
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
        setTimeout(() => {
            var intervalId = setInterval(() => {
                if (Math.random() >= 0.5) {
                    var newIndex = this.state.activeIndex + 1;

                    if (newIndex >= React.Children.count(this.props.children)) {
                        newIndex = 0;
                    }

                    // store intervalId in the state so it can be accessed later:
                    this.setState({
                        intervalId: intervalId,
                        activeIndex: newIndex
                    });
                }
            }, this.props.interval);
        }, this.props.offset);
    }

    componentWillUnmount () {
        clearInterval(this.state.intervalId);
    }

    render () {
        return (
            <Carousel
                activeIndex={this.state.activeIndex}
                controls={false}
                indicators={false}
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
            hasEntries: props.creator.entries.edges.length
        };
    }

    shuffle (array) {
        var currentIndex = array.length
        var temporaryValue, randomIndex;

        while (0 !== currentIndex) {
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex -= 1;

            temporaryValue = array[currentIndex];
            array[currentIndex] = array[randomIndex];
            array[randomIndex] = temporaryValue;
        }

        return array;
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

            entries = this.shuffle(entries);

            var slots = entries.length;

            if (slots > 4) {
                slots = 4;
            }

            var entryIndexCounter = 0;

            for (var i = 1; i <= slots; i++) {
                var slideCount = Math.ceil(entries.length / slots);

                if (slideCount > maxSlideCount) {
                    slideCount = maxSlideCount;
                }

                var _entries = entries.slice(entryIndexCounter, entryIndexCounter + slideCount);

                entryIndexCounter += slideCount;

                items.push(
                    <EntryCarousel key={i} offset={1000 + (i * 500)}>
                        {_entries.map((entry, j) => (
                            <EntryComponent key={j} entry={entry.node} thumbnailMode={true} />
                        ))}
                    </EntryCarousel>
                );
            }

            return items;
        }
    }

    render () {
        var addEntryControl = (
            <Link to={'/add'} className={styles.addEntryControl}>Add New Entry</Link>
        );

        return (
            <Layout>
                <Header auth={this.props.auth} />
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

export const GalleryContainer = Relay.createContainer(withRoles(Gallery, {
    roles: ['creator'],
    fallback: '/settings/configure',
}), {
    initialVariables: {
        first: 100,
    },
    fragments: {
        user: () => Relay.QL`
        fragment on User {
            role
        }`,
        creator: () => Relay.QL`
        fragment on Creator {
            happyCount
            sadCount
            entries(first: $first) {
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
