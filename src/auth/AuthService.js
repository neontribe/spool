import { EventEmitter } from 'events';
import auth0 from 'auth0-js';
import { isTokenExpired } from './jwtHelper';
import { browserHistory } from 'react-router';

export default class AuthService extends EventEmitter {
    constructor (clientId, domain) {
        super();

        // Configure Auth0
        this.auth0 = new auth0.WebAuth({
            clientID: clientId,
            domain: domain,
            responseType: 'token id_token',
            redirectUri: window.location.origin + '/callback'
        });
        this.domain = domain;
        this.login = this.login.bind(this);
        this.emailSignup = this.emailSignup.bind(this);
        this.parseAuthOnEnter = this.parseAuthOnEnter.bind(this);
        this.requireAuthOnEnter = this.requireAuthOnEnter.bind(this);
    }

    login (params, onError) {
        // Redirects the call to auth0 instance
        this.auth0.client.login(params, (err, authResult) => {
            if (err) {
                onError(err);
            }
            if (authResult && authResult.idToken && authResult.accessToken) {
                this.setToken(authResult.accessToken, authResult.idToken);
                alert('navigate');
            }
        });
    }

    authorize (params) {
        this.auth0.authorize(params);
    }

    emailSignup (params, onError) {
        // Redirects the call to auth0 instance
        this.auth0.redirect.signupAndLogin(params, onError);
    }

    logout () {
        let accessToken = localStorage.getItem('access_token');
        // Clear id, access and profile data from localStorage
        localStorage.removeItem('id_token');
        localStorage.removeItem('access_token');
        localStorage.removeItem('profile');

        this.emit('profile_updated', null);

        this.auth0.logout({
            returnTo: encodeURI(`${window.location.origin}/login`),
            access_token: accessToken,
            federated: true
        }, { version: 'v2' });
    }

    loggedIn () {
        // Checks if there is a saved token and it's still valid
        const token = this.getToken();

        return !!token && !isTokenExpired(token);
    }

    parseHash (hash, success) {
        this.auth0.parseHash({ hash }, (err, authResult) => {
            if (err) {
                console.log(err);
            }
            if (authResult && authResult.accessToken && authResult.idToken) {
                this.setToken(authResult.accessToken, authResult.idToken);
                this.auth0.client.userInfo(authResult.accessToken, (error, profile) => {
                    if (error) {
                        console.log('Error loading the Profile', error);
                    } else {
                        this.setProfile(profile);
                    }
                    // All seems good. Run our success handler.
                    success && success();
                });
            } else if (authResult && authResult.error) {
                alert('Error: ' + authResult.error);
            }
        });
    }

    setToken (accessToken, idToken) {
        if (!idToken) {
            return;
        }
        // Saves user access token and ID token into local storage
        localStorage.setItem('access_token', accessToken);
        localStorage.setItem('id_token', idToken);
    }

    getToken () {
        // Retrieves the user token from localStorage
        return localStorage.getItem('id_token');
    }

    setProfile (profile) {
        if (!profile) {
            return;
        }
        // Saves profile data to localStorage
        localStorage.setItem('profile', JSON.stringify(profile));

        // Triggers profile_updated event to update the UI
        this.emit('profile_updated', profile);
    }

    clearAuth () {
        // if we have no profile best case is to force another login
        localStorage.removeItem('id_token');
        localStorage.removeItem('profile');
    }

    getProfile () {
        // Retrieves the profile data from localStorage
        const profile = localStorage.getItem('profile');
        if (!profile) {
            return this.clearAuth();
        }

        try {
            return JSON.parse(profile);
        } catch (e) {
            return this.clearAuth();
        }
    }

    // onEnter callback to parse the authToken on login
    parseAuthOnEnter (nextState, replace) {
        // Because the page can't set the id token fast enough, check the nextState to see if the hash exists
        // if it does exist then grab the id token from the hash and then set it to local storage
        if (nextState.location.hash) {
            this.parseHash(nextState.location.hash, () => {
                if (this.loggedIn()) {
                    browserHistory.replace('/app');
                }
            });
        }
    }

    // onEnter callback to validate authentication in private routes
    requireAuthOnEnter (nextState, replace, callback) {
        if (nextState.location.hash) {
            this.parseHash(nextState.location.hash);
        }

        if (!this.loggedIn()) {
            replace({ pathname: '/login' });
            callback(new Error('User is not logged in'));
        }

        callback();
    }
}
