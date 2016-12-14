import React, { Component } from 'react';
import Relay from 'react-relay';
import controls from '../css/Controls.module.css';

export class SettingsForm extends Component {
    constructor (props) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);

        this.state = {
            region: props.user.region,
            changed: false
        };
    }
    handleChange (key, event) {
        this.setState({
            [key]: event.target.value,
            changed: true
        });
    }
    handleSubmit (event) {
        event.preventDefault();
        this.onSubmit({...this.state});
    }
    render () {
        const ready = (this.state.region);
        return (
            <form handleSubmit={this.handleSubmit}>
                <div>
                    <label>
                        Full Name
                        <input
                            type="text"
                            name="name" />
                    </label>
                    <label>
                        Nickname
                        <input
                            type="text"
                            name="nickname" />
                    </label>
                    <label>
                        Age
                        <input
                            type="text"
                            name="age" />
                    </label>
                    <label>
                        Area
                        <div>
                            <select
                                placeholder='I live in...'
                                value={this.state.region || ''}
                                handleChange={_.partial(this.handleChange, 'region')}
                            >
                                <option value='' disabled={true}>I live in&hellip;</option>
                                {this.props.meta.regions.map(({type}) => {
                                    return (<option value={type} key={type}>{type}</option>);
                                })}
                            </select>
                        </div>
                    </label>
                    <label>
                        Services Used
                        <input
                            type="checkbox"
                            name="services"
                            value="a" />
                        <input
                            type="checkbox"
                            name="services"
                            value="b" />
                        <input
                            type="checkbox"
                            name="services"
                            value="c" />
                    </label>
                    <label>
                        Residence Type
                        <input
                            type="text"
                            name="residence" />
                    </label>
                </div>
                <div>
                    <button
                        type='submit'
                        disabled={!ready}
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
                }
            }
        `,
        user: () => Relay.QL`
            fragment on User {
                region
            }
        `,
    }
});
