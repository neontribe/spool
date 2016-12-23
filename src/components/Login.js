import React, { Component } from 'react';
import _ from 'lodash';

import AuthService from '../auth/AuthService';
import Layout from './Layout';
import Button from './Button';

import styles from './css/SimpleLogin.module.css';

const { Content } = Layout;

class SimpleLogin extends Component {
    constructor (props) {
        super(props);

        this.googleLogin = _.debounce(this.googleLogin.bind(this), 500, { leading: true, trailing: false });
        this.twitterLogin = _.debounce(this.twitterLogin.bind(this), 500, { leading: true, trailing: false });
    }

    googleLogin () {
        this.props.auth.login({
            connection: 'google-oauth2'
        }, function (err) {
            if (err) {
                alert('something went wrong: ' + err.message);
            }
        });
    }

    twitterLogin () {
        this.props.auth.login({
            connection: 'twitter'
        }, function (err) {
            if (err) {
                alert('something went wrong: ' + err.message);
            }
        });
    }

    render () {
        return (
            <Layout>
                <Content>
                    <div className={styles.wrapper}>
                        <div className={styles.btnWrapper}>
                            <Button onClick={this.googleLogin}>Login with Google</Button>
                            <Button onClick={this.twitterLogin}>Login with Twitter</Button>
                        </div>
                    </div>
                </Content>
            </Layout>
        );
    }
}

SimpleLogin.propTypes = {
    location: React.PropTypes.object,
    auth: React.PropTypes.instanceOf(AuthService)
}

SimpleLogin.defaultProps = {
    email: '',
    password: ''
}

export default SimpleLogin;
