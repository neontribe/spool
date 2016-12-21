import React, { Component } from 'react';
import { withRouter } from 'react-router';

class ProfileLink extends Component {
    static propTypes = {
        profile: React.PropTypes.object,
        disabled: React.PropTypes.bool
    }

    constructor (...args) {
        super(...args);

        this.state = {
            showProfile: false
        };

        this.showProfile = this.showProfile.bind(this);
        this.hideProfile = this.hideProfile.bind(this);
        this.navigateToSettings = this.navigateToSettings.bind(this);
    }

    showProfile (e) {
        e.preventDefault();

        this.setState({
            showProfile: true
        });
    }

    hideProfile () {
        this.setState({
            showProfile: false
        });
    }

    navigateToSettings () {
        this.hideProfile();
        this.props.router.push('/app/settings');
    }

    render () {
        if (this.props.disabled || !this.props.profile) {
            return false;
        }

        return (
            <div>
                {/*<Modal show={this.state.showProfile} onHide={this.hideProfile} bsSize='large' backdrop={true}>*/}
                <button onClick={this.navigateToSettings}>Edit My Settings</button>

                <div>
                    <button
                        onClick={() => this.setState({ showTechDetails: !this.state.showTechDetails })}
                    >Show Technical Info</button>

                    {/*<Panel collapsible expanded={this.state.showTechDetails}>*/}
                    {this.state.showTechDetails && (
                        <div>
                            <h3>SPOOL Version: {process.env.VERSION}</h3>
                            <h3>Social Profile Data</h3>
                            <pre>{JSON.stringify(this.props.profile, null, '\t')}</pre>
                        </div>
                    )}
                </div>

                <button onClick={this.hideProfile}>Close</button>
            </div>
        );
    }
}

export default withRouter(ProfileLink);
