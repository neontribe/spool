import React, { Component } from 'react';
import { Image, Modal, Button } from 'react-bootstrap';

class ProfileLink extends Component {

    constructor(...args) {
        super(...args);

        this.state = {
            showProfile: false
        };

        this.showProfile = this.showProfile.bind(this);
        this.hideProfile = this.hideProfile.bind(this);
    }

    showProfile() {
        this.setState({ showProfile: true });
    }

    hideProfile() {
        this.setState({ showProfile: false });
    }

    render() {
        if (!this.props.profile) {
            return (<div></div>);
        }
        return (
            <div>
                <div onClick={this.showProfile}>
                    <Image src={this.props.profile.picture} circle responsive />
                    <h3>{this.props.profile.nickname}</h3>
                </div>

                <Modal show={this.state.showProfile} onHide={this.state.hideProfile} bsSize="large">
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

ProfileLink.propTypes = {
    profile: React.PropTypes.object
}

export default ProfileLink;
