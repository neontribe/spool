import React, { Component } from 'react';
import Relay from 'react-relay';
import _ from 'lodash';

import Button from './Button';

import styles from './css/SettingsForm.module.css';
import headings from '../css/Headings.module.css';

export class SettingsForm extends Component {
    constructor (props) {
        super(props);

        this.handleChange = this.handleChange.bind(this);
        this.handleArrayChange = this.handleArrayChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);

        const changed = false;
        const user = this.props.user;
        const profile = user.profile || { services: [], residence: {} };

        this.state = {
            region: {
                value: user.region || '',
                changed
            },
            name: {
                value: profile.name || '',
                changed
            },
            nickname: {
                value: profile.nickname || '',
                changed
            },
            age: {
                value: profile.age || '',
                changed
            },
            residence: {
                value: profile.residence.type || '',
                changed
            },
            services: {
                value: profile.services.map((service) => service.type),
                changed
            }
        };

        this.handleChanges = {
            name: _.partial(this.handleChange, 'name'),
            nickname: _.partial(this.handleChange, 'nickname'),
            region: _.partial(this.handleChange, 'region'),
            age: _.partial(this.handleChange, 'age'),
            residence: _.partial(this.handleChange, 'residence'),
            services: _.partial(this.handleArrayChange, 'services')
        }
    }

    handleArrayChange (key, event) {
        const { value } = event.target;

        var newValue = this.state[key].value.slice(0);
        var existing = newValue.indexOf(value);

        if (existing === -1) {
            newValue.push(value);
        } else {
            newValue.splice(existing, 1);
        }

        this.setState({[key]: { value: newValue, changed: true }});
    }

    handleChange (key, event) {
        const { value } = event.target;

        this.setState({[key]: { value, changed: true }});
    }

    handleSubmit (event) {
        event.preventDefault();

        const { name, nickname, region, age, residence, services } = this.state;

        const payload = {
            name: name.value,
            nickname: nickname.value,
            region: region.value,
            age: age.value,
            residence: residence.value,
            services: services.value
        }

        this.props.onSubmit(payload);
    }

    errors () {
        var errors = {};

        const { name, age, region, services, residence } = this.state;

        if (!name.value) {
            errors['name'] = 'Your name is required';
        }

        if (!age.value) {
            errors['age'] = 'Your age is required';
        }

        if (!region.value) {
            errors['region'] = 'Area selection is required';
        }

        if (!services.value.length) {
            errors['services'] = 'Select at least one service';
        }

        if (!residence.value) {
            errors['residence'] = 'Residence selection is required';
        }

        return Object.keys(errors).length ? errors : false;
    }

    renderServices () {
        if (this.state.region.value) {
            const services = _.find(this.props.meta.regions, { type: this.state.region.value }).services;

            return services.map(({ type, name }) => {
                let checked = this.state.services.value.indexOf(type) !== -1;

                return (
                    <label key={type} className={styles.service}>
                        <input
                            type='checkbox'
                            name='services'
                            checked={checked}
                            value={type}
                            onChange={this.handleChanges.services}
                            className={styles.field}
                        />
                        <span className={styles.message}>{name}</span>
                    </label>
                );
            });
        }

        return null;
    }

    renderRegionOptions () {
        return this.props.meta.regions.map(({ type }) => (
            <option key={type} value={type}>{type}</option>
        ));
    }

    renderResidences () {
        return this.props.meta.residences.map(({ type, name }) => {
            let checked = this.state.residence.value === type;

            return (
                <label key={type} className={styles.service}>
                    <input
                        type='radio'
                        name='residence'
                        checked={checked}
                        value={type}
                        onChange={this.handleChanges.residence}
                        className={styles.field}
                    />
                    <span className={styles.message}>{name}</span>
                </label>
            );
        });
    }

    renderError (error) {
        return error ? (<p className={styles.error}><span>{error}</span></p>) : null;
    }

    render () {
        const errors = this.errors();
        return (
            <form
                ref='form'
                className={styles.form}
            >
                <div className={styles.row}>
                    <div className={styles.column}>
                        <h3 className={headings.regular}>Your Details</h3>
                        <label>
                            <span className={styles.label}>Full Name *</span>
                            <input
                                type='text'
                                name='name'
                                value={this.state.name.value}
                                onChange={this.handleChanges.name}
                                className={styles.textField}
                            />
                            {this.state.name.changed && this.renderError(errors.name)}
                        </label>

                        <label>
                            <span className={styles.label}>Nickname</span>
                            <input
                                type='text'
                                name='nickname'
                                value={this.state.nickname.value}
                                onChange={this.handleChanges.nickname}
                                className={styles.textField}
                            />
                            {this.state.nickname.changed && this.renderError(errors.nickname)}
                        </label>

                        <label>
                            <span className={styles.label}>Age *</span>
                            <input
                                type='number'
                                name='age'
                                value={this.state.age.value}
                                onChange={this.handleChanges.age}
                                className={styles.numberField}
                            />
                           {this.state.age.changed && this.renderError(errors.age)}
                        </label>

                        <label>
                            <span className={styles.label}>Area *</span>
                            <div>
                                <select
                                    placeholder='I live in...'
                                    value={this.state.region.value || ''}
                                    onChange={this.handleChanges.region}
                                >
                                    <option value='' disabled={true}>I live in&hellip;</option>
                                    {this.renderRegionOptions()}
                                </select>
                                {this.state.region.changed && this.renderError(errors.region)}
                            </div>
                        </label>
                    </div>

                    <div className={styles.column}>
                        <h3 className={headings.regular}>Residence Type *</h3>
                        {this.renderResidences()}
                        {this.state.residence.changed && this.renderError(errors.residence)}
                    </div>

                    {this.state.region.value && (
                        <div className={styles.column}>
                            <h3 className={headings.regular}>Services Used *</h3>
                            {this.renderServices()}
                            {this.state.services.changed && this.renderError(errors.services)}
                        </div>
                    )}
                </div>

                <div className={styles.controls}>
                    {!errors && (
                        <Button onClick={this.handleSubmit}>OK</Button>
                    )}
                </div>
            </form>
        )
    }
}

export const SettingsFormContainer = Relay.createContainer(SettingsForm, {
    fragments: {
        meta: () => Relay.QL`
            fragment on Meta {
                regions {
                    type
                    services {
                        type
                        name
                    }
                }
                residences {
                    type
                    name
                }
            }
        `,
        user: () => Relay.QL`
            fragment on User {
                id
                region
                profile {
                    id
                    name
                    age
                    nickname
                    services {
                        type
                        name
                    }
                    residence {
                        type
                        name
                    }
                }
            }
        `,
    }
});
