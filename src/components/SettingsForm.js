import React, { Component } from 'react';
import Relay from 'react-relay';
import controls from '../css/Controls.module.css';
import _ from 'lodash';

const noop = () => {};
export class SettingsForm extends Component {
    constructor (props) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
        this.handleArrayChange = this.handleArrayChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        const changed = false;
        const user = this.props.user;
        const profile = user.profile;
        this.state = {
            region: {
                value: user.region,
                changed
            },
            name: {
                value: profile.name,
                changed
            },
            nickname: {
                value: profile.nickname,
                changed
            },
            age: {
                value: profile.age,
                changed
            },
            residence: {
                value: profile.residence.type,
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
        const {value} = event.target;
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
        const {value} = event.target;
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
        const {name, age, region, services, residence} = this.state;
        if(!name.value && name.changed) {
            errors['name'] = 'Name is required';
        }
        if(!age.value && age.changed) {
            errors['age'] = 'Age is required';
        }
        if(!region.value && region.changed) {
            errors['region'] = 'Area is required';
        }
        if(!services.value.length && services.changed) {
            errors['services'] = 'At least once service';
        }
        if(!residence.value && residence.changed) {
            errors['residence'] = 'Residence is required';
        }
        return Object.keys(errors).length ? errors : false;
    }
    renderServices() {
        if(this.state.region.value) {
            const services = _.find(this.props.meta.regions, { type: this.state.region.value }).services;

            return services.map(({type, name}) => {
                let checked = this.state.services.value.indexOf(type) !== -1;
                return (<label key={type}>{name}
                    <input
                        type="checkbox"
                        name="services"
                        checked={checked}
                        value={type}
                        onChange={this.handleChanges.services}/>
                </label>)
            });
        }
        return null;
    }
    renderRegionOptions() {
        return this.props.meta.regions.map(({type}) => {
            return (<option key={type} value={type} key={type}>{type}</option>);
        })
    }
    renderResidences() {
        return this.props.meta.residences.map(({type, name}) => {
            let checked = this.state.residence.value === type;
            return (<label key={type}>{name}
                <input
                    type="radio"
                    name="residence"
                    checked={checked}
                    value={type}
                    onChange={this.handleChanges.residence}/>
            </label>)
        });
    }
    renderError(error) {
        return error ? <p>{error}</p> : null;
    }
    render () {
        const errors = this.errors();
        const ready = !errors;
        return (
            <form onSubmit={!errors ? this.handleSubmit : noop}>
                <div>
                    <label>
                        Full Name
                        <input
                            type="text"
                            name="name"
                            value={this.state.name.value}
                            onChange={this.handleChanges.name}/>
                        {this.renderError(errors.name)}
                    </label>
                    <label>
                        Nickname
                        <input
                            type="text"
                            name="nickname"
                            value={this.state.nickname.value}
                            onChange={this.handleChanges.nickname}/>
                        {this.renderError(errors.nickname)}
                    </label>
                    <label>
                        Age
                        <input
                            type="text"
                            name="age"
                            value={this.state.age.value}
                            onChange={this.handleChanges.age}/>
                       {this.renderError(errors.age)}
                    </label>
                    <label>
                        Area
                        <div>
                            <select
                                placeholder='I live in...'
                                value={this.state.region.value || ''}
                                onChange={this.handleChanges.region}
                            >
                                <option value='' disabled={true}>I live in&hellip;</option>
                                { this.renderRegionOptions() }
                            </select>
                            {this.renderError(errors.region)}
                        </div>
                    </label>
                    <div>
                        Services Used
                        { this.renderServices() }
                        {this.renderError(errors.services)}
                    </div>
                    <div>
                        Residence Type
                        { this.renderResidences() }
                        {this.renderError(errors.residence)}
                    </div>
                </div>
                <div>
                    <button
                        type='submit'
                        disabled={!errors ? '' : 'disabled'}
                        className={controls.btn}>OK</button>
                </div>
            </form>)
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
