import React, { Component } from 'react';
import { Grid, Row, Col, Image, Modal, Button, Panel, Glyphicon } from 'react-bootstrap';
import { withRouter } from 'react-router';

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
        this.navigateToSettings = this.navigateToSettings.bind(this);
    }

    showProfile(e) {
        e.preventDefault();
        this.setState({ showProfile: true });
    }

    hideProfile() {
        this.setState({ showProfile: false });
    }

    navigateToSettings(){
        this.hideProfile();
        this.props.router.push('/settings');
    }

    render() {
        if (this.props.disabled || !this.props.profile) {
            return false;
        }

        return (
            <div className='profile'>
                <a href='/view-profile' className='profile-img-container' onClick={this.showProfile}>
                    <Image
                        src={this.props.profile.picture}
                        className='profile-img'
                        circle
                    />
                </a>
                <h3 className='welcome'>
                    <span>Welcome</span>
                    <span>{this.props.profile.name}</span>
                </h3>

                <Modal show={this.state.showProfile} onHide={this.hideProfile} bsSize='large' backdrop={true}>
                    <Modal.Header closeButton/>
                        <Modal.Title>My SPOOL Profile</Modal.Title>
                    <Modal.Header/>
                    <Modal.Body>
                        <Grid>
                            <Row>
                                <Col>
                                    <div className="full-width centered">
                                        <Button onClick={this.navigateToSettings}>
                                            <Glyphicon glyph="cog"/> Edit My Settings
                                        </Button>
                                    </div>
                                </Col>
                            </Row>
                            <Row>
                                <Col>
                                    <div className="full-width centered">
                                        <Button
                                            onClick={() => this.setState({ showTechDetails: !this.state.showTechDetails})}>
                                            <Glyphicon glyph="zoom-in"/> Show Technical Info
                                        </Button>
                                    </div>
                                    <Panel collapsible expanded={this.state.showTechDetails}>
                                        <h3>SPOOL Version: {process.env.VERSION}</h3>
                                        <h3>Social Profile Data</h3>
                                        <pre>
                                            { JSON.stringify(this.props.profile, null, '\t') }
                                        </pre>
                                    </Panel>
                                </Col>
                            </Row>
                        </Grid>


                    </Modal.Body>
                    <Modal.Footer>
                        <Button onClick={this.hideProfile}><Glyphicon glyph="remove"/> Close</Button>
                    </Modal.Footer>
                </Modal>
            </div>
        );
    }
}

export default withRouter(ProfileLink);
