import { EventEmitter } from 'events';
import Auth0 from 'auth0-js';
import { isTokenExpired } from './jwtHelper';

export default class AuthService extends EventEmitter {
    constructor (clientId, domain, urls) {
        super();

        // Configure Auth0
        this.auth0 = new Auth0({
            clientID: clientId,
            domain: domain,
            callbackOnLocationHash: true,
            callbackURL: urls.callbackURL
        });

        this.urls = urls;
        this.login = this.login.bind(this);
        this.signup = this.signup.bind(this);
        this.parseAuthOnEnter = this.parseAuthOnEnter.bind(this);
        this.requireAuthOnEnter = this.requireAuthOnEnter.bind(this);
    }

    login (params, onError) {
        // Redirects the call to auth0 instance
        this.auth0.login(params, onError);
    }

    signup (params, onError) {
        // Redirects the call to auth0 instance
        this.auth0.signup(params, onError);
    }

    logout () {
        // Clear user token and profile data from localStorage
        localStorage.removeItem('id_token');
        localStorage.removeItem('profile');

        this.emit('profile_updated', null);
    }

    loggedIn () {
        // Checks if there is a saved token and it's still valid
        const token = this.getToken();

        return !!token && !isTokenExpired(token);
    }

    parseHash (hash) {
        // Uses auth0 parseHash method to extract data from url hash
        const authResult = this.auth0.parseHash(hash);

        if (authResult && authResult.idToken) {
            this.setToken(authResult.idToken);
            this.auth0.getProfile(authResult.idToken, (err, profile) => {
                if (err) {
                    console.log(err);
                }

                this.setProfile(profile);
            });

            return !isTokenExpired(authResult.idToken);
        }
    }

    setToken (idToken) {
        if (!idToken) {
            return
        }
        // Saves user token to localStorage
        localStorage.setItem('id_token', idToken);
    }

    getToken () {
        // Retrieves the user token from localStorage
        return localStorage.getItem('id_token');
    }

    setProfile (profile) {
        if (!profile) {
            return
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
            this.parseHash(nextState.location.hash);
        }

        if (this.loggedIn()) {
            replace({ pathname: this.urls.loggedIn });
            return true;
        }
    }

    // onEnter callback to validate authentication in private routes
    requireAuthOnEnter (nextState, replace, callback) {
        if (nextState.location.hash) {
            this.parseHash(nextState.location.hash);
        }

        if (!this.loggedIn()) {
            replace({ pathname: this.urls.login });
            callback(new Error('User is not logged in'));
        }

        callback();
    }
}
