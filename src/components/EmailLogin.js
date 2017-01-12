import React, { Component } from 'react';
import _ from 'lodash';
import Button from './Button';

import styles from './css/Login.module.css';

export default class EmailLogin extends Component {
    static propTypes = {
        confirmPassword: React.PropTypes.bool,
        onSubmit: React.PropTypes.func,
        location: React.PropTypes.object
    }

    static defaultProps = {
        email: '',
        password: ''
    }
    constructor (props) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        const changed = false;
        this.state = {
            email: {
                value: '',
                changed
            },
            password: {
                value: '',
                changed
            },
            confirm: {
                value: '',
                changed
            }
        };
        this.handleChanges = {
            email: _.partial(this.handleChange, 'email'),
            password: _.partial(this.handleChange, 'password'),
            confirm: _.partial(this.handleChange, 'confirm')
        };
    }

    handleSubmit(evt) {
        evt.preventDefault();
        const { email, password } = this.state;
        this.props.onSubmit({
            email: email.value,
            password: password.value
        });
    }

    errors () {
        var errors = {};
        const { email, password, confirm } = this.state;
        if (!email.value && email.changed) {
            errors['email'] = 'Your password is required';
        }

        if (this.props.confirmPassword && confirm.changed && (password.value !== confirm.value)) {
            errors['password'] = 'Your password must match';
        }

        if (!password.value && password.changed) {
            errors['password'] = 'Your password is required';
        }

        return Object.keys(errors).length ? errors : false;
    }

    handleChange (key, event) {
        const { value } = event.target;
        this.setState({[key]: { value, changed: true }});
    }

    render() {
        const { email, password } = this.state;
        const { confirmPassword } = this.props;
        const errors = this.errors();
        return (
        <div className={styles.wrapper}>
            <form>
                <label>
                    Email Address
                    <input type='email' onChange={this.handleChanges.email} value={email.value}/>
                    { errors.email && (<p>{errors.email}</p>) }
                </label>
                <label>
                    Password
                    <input type='password' onChange={this.handleChanges.password} value={password.value}/>
                    { errors.password && (<p>{errors.password}</p>) }
                </label>
                { confirmPassword && (<label>
                    Confirm Password
                    <input type='password' onChange={this.handleChanges.confirm} value={confirm.value}/>
                </label>) }
                <Button disabled={!!errors} onClick={this.handleSubmit}>{this.props.submitText}</Button>
            </form>
        </div>
        );
    }
}
