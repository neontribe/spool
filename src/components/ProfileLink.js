import React, { Component } from 'react';
import { Image, Modal, Button } from 'react-bootstrap';

class ProfileLink extends Component {

    static propTypes = {
        profile: React.PropTypes.object,
        disabled: React.PropTypes.bool
    }

    constructor(...args) {
        super(...args);

        this.state = {
            showProfile: false
        };

        this.showProfile = this.showProfile.bind(this);
        this.hideProfile = this.hideProfile.bind(this);
    }

    showProfile(e) {
        e.preventDefault();
        this.setState({ showProfile: true });
    }

    hideProfile() {
        this.setState({ showProfile: false });
    }

    render() {
        if (this.props.disabled || !this.props.profile) {
            return false;
        }

        return (
            <div className='profile'>
                <a href='./view-profile' className='profile-img-container' onClick={this.showProfile}>
                    <Image
                        src={this.props.profile.picture}
                        className='profile-img'
                        circle
                    />
                </a>
                <h3 className='welcome'>
                    <span>Welcome</span>
                    <span>{this.props.profile.nickname}</span>
                </h3>

                <Modal show={this.state.showProfile} onHide={this.state.hideProfile} bsSize='large'>
                    <Modal.Header closeButton/>
                        <Modal.Title>My SPOOL Profile</Modal.Title>
                    <Modal.Header/>
                    <Modal.Body>
                        <pre>
                            { JSON.stringify(this.props.profile, null, '\t') }
                        </pre>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button onClick={this.hideProfile}>Close</Button>
                    </Modal.Footer>
                </Modal>
            </div>
        );
    }
}

export default ProfileLink;
