import React, { Component } from 'react';
import Icon from './Icon';
import { Link } from 'react-router';

import styles from './css/IconFilter.module.css';

class Filter extends Component {
    static propTypes = {
        count: React.PropTypes.number.isRequired
    }

    constructor (props) {
        super(props);

        this.handleClick = this.handleClick.bind(this);
    }

    handleClick () {
        this.props.onChange(!this.props.active);
    }

    render () {
        return (
            <li className={this.props.className || styles.filter} onClick={this.handleClick}>
                <a role='button' className={this.props.active ? styles.filterControlOn : styles.filterControl}>
                    <Icon icon={this.props.icon} light={true} />
                    <span className={styles.filterText}>{this.props.children}</span>
                </a>

                {!this.props.active && (
                    <span className={(this.props.count > 0) ? styles.count : styles.countZero}>{this.props.count}</span>
                )}
            </li>
        );
    }
}

class LinkFilter extends Component {
    render () {
        var className = (window.location.href.indexOf(this.props.linkTo) !== -1)
            ? styles.filterActive
            : styles.filter;

        return (
          <li className={className}>
              <Link to={this.props.linkTo} className={styles.filterControl}>
                  {this.props.children}
              </Link>
          </li>
        );
    }
}

class FilterList extends Component {
    render () {
        return (
            <ul className={this.props.className || styles.filterList}>
                {this.props.children}
            </ul>
        );
    }
}

export default class IconFilter extends Component {
    constructor (props) {
        super(props);

        this.state = {
            happy: false,
            sad: false,
            work: false,
            learning: false,
            home: false,
            food: false,
            relationships: false,
            activities: false,
            travel: false,
            health: false,
            video: false,
            photo: false,
            typing: false,
        };

        this.handleChange = this.handleChange.bind(this);
        this.handlers = {};

        Object.keys(this.state).forEach((key) => this.handlers[key] = _.partial(this.handleChange, key));
    }

    handleChange (key, value) {
        const state = {
            ...this.state,
            [key]: value
        };

        this.setState(state);
        this.props.onChange(state);
    }

    render() {
        const { happy, sad, work, learning, home, food, relationships, activities, travel, health, video, photo, typing } = this.state;
        const handlers = this.handlers;

        return (<div>
          <div className={styles.filterBlock}>
              <h2 className={styles.filterHeader}>View Mode</h2>

              <FilterList>
                  <LinkFilter linkTo='/app/home'>Gallery</LinkFilter>
                  <LinkFilter linkTo='/app/timeline'>Timeline</LinkFilter>
              </FilterList>
          </div>

          <div className={styles.filterBlock}>
            <h2 className={styles.filterHeader}>Filters</h2>
            <FilterList>
                <Filter
                    icon='happy'
                    onChange={handlers['happy']}
                    active={happy}
                    count={4}
                >Happy</Filter>
                <Filter
                    icon='sad'
                    onChange={handlers['sad']}
                    active={sad}
                    count={1}
                >Sad</Filter>
            </FilterList>
            <FilterList>
                <Filter
                    icon='work'
                    onChange={handlers['work']}
                    active={work}
                    count={1}
                >Work</Filter>
                <Filter
                    icon='learning'
                    onChange={handlers['learning']}
                    active={learning}
                    count={0}
                >Learning</Filter>
                <Filter
                    icon='home'
                    onChange={handlers['home']}
                    active={home}
                    count={0}
                >Home</Filter>
                <Filter
                    icon='food'
                    onChange={handlers['food']}
                    active={food}
                    count={0}
                >Food</Filter>
                <Filter
                    icon='relationships'
                    onChange={handlers['relationships']}
                    active={relationships}
                    count={1}
                >People &amp; Relationships</Filter>
                <Filter
                    icon='activities'
                    onChange={handlers['activities']}
                    active={activities}
                    count={1}
                >Activities</Filter>
                <Filter
                    icon='travel'
                    onChange={handlers['travel']}
                    active={travel}
                    count={0}
                >Travel</Filter>
                <Filter
                    icon='health'
                    onChange={handlers['health']}
                    active={health}
                    count={3}
                >Health</Filter>
            </FilterList>
            <FilterList>
                <Filter
                    icon='video'
                    onChange={handlers['video']}
                    active={video}
                    count={1}
                    className={styles.filterMedia}
                >Videos</Filter>
                <Filter
                    icon='photo'
                    onChange={handlers['photo']}
                    active={photo}
                    count={0}
                    className={styles.filterMedia}
                >Photos</Filter>
                <Filter
                    icon='typing'
                    onChange={handlers['typing']}
                    active={typing}
                    count={2}
                    className={styles.filterMedia}
                >Written</Filter>
            </FilterList>
          </div>
        </div>)
    }
}
