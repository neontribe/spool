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

    handleSubmit (evt) {
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
            errors['email'] = 'Your email is required';
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

        this.setState({
            [key]: {
                value,
                changed: true
            }
        });
    }

    render () {
        const { email, password, confirm } = this.state;
        const { confirmPassword } = this.props;
        const errors = this.errors();

        return (
            <div className={styles.wrapper}>
                <form>
                    <label>
                        <input
                            type='email'
                            onChange={this.handleChanges.email}
                            value={email.value}
                            placeholder='Email Address'
                        />
                        {errors.email && (
                            <p className={styles.error}><span>{errors.email}</span></p>
                        )}
                    </label>

                    <label>
                        <input
                            type='password'
                            onChange={this.handleChanges.password}
                            value={password.value}
                            placeholder='Password'
                        />
                        {errors.password && (
                            <p className={styles.error}><span>{errors.password}</span></p>
                        )}
                    </label>

                    {confirmPassword && (
                        <label>
                            <input
                                type='password'
                                onChange={this.handleChanges.confirm}
                                value={confirm.value}
                                placeholder='Confirm Password'
                            />
                        </label>
                    )}

                    {(email.value &&
                        password.value &&
                        ((confirmPassword && confirm.value) || !confirmPassword) &&
                        !errors) && (
                        <Button onClick={this.handleSubmit}>{this.props.submitText}</Button>
                    )}
                </form>
            </div>
        );
    }
}
