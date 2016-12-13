import React, { Component } from 'react';
import Relay from 'react-relay';
import { Link } from 'react-router';

import { EntryContainer, Entry } from './Entry';
import Layout from './Layout';
// import Intro from './Intro';
import Grid from './Grid';
import withRoles from '../auth/withRoles.js';

import styles from './css/Gallery.module.css';
import controls from '../css/Controls.module.css';

import Hamburger from './Hamburger';
const { Content, Header } = Layout;

class Filter extends Component {

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

    renderEntries () {
        return this.props.creator.entries.edges.slice(0, 5).map((entry) => {
            if (this.props.relay) {
                return (
                    <EntryContainer
                        key={entry.node.id}
                        entry={entry.node} 
                    />
                );
            }

            return (
                <Entry
                    key={entry.node.id}
                    entry={entry.node}
                />
            );
        });
    }

    renderFilters () {
        return (
            <ul>
        <li className={styles.filter}>
          <a role='button' className={styles.filterHappyOn}>Hide happy</a>
        </li>
        <li className={styles.filter}>
          <a role='button' className={styles.filterSadOn}>Hide sad</a>
        </li>
        <li className={styles.filter}>
          <a role='button' className={styles.filterOn}>&times; <span>Hide filter</span></a>
        </li>
        <li className={styles.filter}>
          <a role='button' className={styles.filterOn}>&times; <span>Hide filter</span></a>
        </li>
        <li className={styles.filter}>
          <a role='button' className={styles.filterOn}>&times; <span>Hide filter</span></a>
        </li>
        <li className={styles.filter}>
          <a role='button' className={styles.filterControl}>&times; <span>Show filter</span></a>
        </li>
        <li className={styles.filter}>
          <a role='button' className={styles.filterControl}>&times; <span>Show filter</span></a>
        </li>
        <li className={styles.filter}>
          <a role='button' className={styles.filterOn}>&times; <span>Hide filter</span></a>
        </li>
        <li className={styles.filter}>
          <a role='button' className={styles.filterOn}>&times; <span>Hide filter</span></a>
        </li>
        <li className={styles.filter}>
          <a role='button' className={styles.filterControl}>&times; <span>Hide filter</span></a>
        </li>
        <li className={styles.filter}>
          <a role='button' className={styles.filterOn}>&times; <span>Hide filter</span></a>
        </li>
        <li className={styles.filter}>
          <a role='button' className={styles.filterOn}>&times; <span>Hide filter</span></a>
          </li></ul>);
    }

    render () {
        var addEntryControl = (
            <Link to={'/add'} className={styles.addEntryControl}>Add New Entry</Link>
        );
        const profile = this.props.auth.getProfile();
        return (
            <Layout>
                <Header auth={this.props.auth}>
                  {profile && (
                      <Hamburger
                      auth={this.props.auth}
                      text={profile.name}
                      toggleClassName={styles.contextMenuToggle}
                      contentClassName={styles.contextMenuContent}
                    >{this.renderFilters()}</Hamburger>
                  )}
                </Header>
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
