import React, { Component } from 'react';
import Icon from './Icon';
import { Link } from 'react-router';

import styles from './css/IconFilter.module.css';

class Filter extends Component {
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
            </li>
        );
    }
}

class LinkFilter extends Component {
    render () {
        return (
          <li className={this.props.className || styles.filter}>
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
                >Happy</Filter>
                <Filter
                    icon='sad'
                    onChange={handlers['sad']}
                    active={sad}
                >Sad</Filter>
            </FilterList>
            <FilterList>
                <Filter
                    icon='work'
                    onChange={handlers['work']}
                    active={work}
                >Work</Filter>
                <Filter
                    icon='learning'
                    onChange={handlers['learning']}
                    active={learning}
                >Learning</Filter>
                <Filter
                    icon='home'
                    onChange={handlers['home']}
                    active={home}
                >Home</Filter>
                <Filter
                    icon='food'
                    onChange={handlers['food']}
                    active={food}
                >Food</Filter>
                <Filter
                    icon='relationships'
                    onChange={handlers['relationships']}
                    active={relationships}
                >People &amp; Relationships</Filter>
                <Filter
                    icon='activities'
                    onChange={handlers['activities']}
                    active={activities}
                >Activities</Filter>
                <Filter
                    icon='travel'
                    onChange={handlers['travel']}
                    active={travel}
                >Travel</Filter>
                <Filter
                    icon='health'
                    onChange={handlers['health']}
                    active={health}
                >Health</Filter>
            </FilterList>
            <FilterList>
                <Filter
                    icon='video'
                    onChange={handlers['video']}
                    active={video}
                    className={styles.filterMedia}
                >Videos</Filter>
                <Filter
                    icon='photo'
                    onChange={handlers['photo']}
                    active={photo}
                    className={styles.filterMedia}
                >Photos</Filter>
                <Filter
                    icon='typing'
                    onChange={handlers['typing']}
                    active={typing}
                    className={styles.filterMedia}
                >Written</Filter>
            </FilterList>
          </div>
        </div>)
    }
}
