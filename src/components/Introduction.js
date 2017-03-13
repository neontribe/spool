import React, { Component } from 'react';
import Relay from 'react-relay';
import Layout from './Layout';
import Button from './Button';
import ButtonLink from './ButtonLink';
import HideIntroductionMutation from './mutations/HideIntroductionMutation.js';
import UpdatePrivacyMutation from './mutations/UpdatePrivacyMutation.js';
import PrivacyForm from './PrivacyForm.js';

import styles from './css/Introduction.module.css';
import headings from '../css/Headings.module.css';

const { Header, Content } = Layout;

class Stepper extends Component {
    render () {
        const children = React.Children.toArray(this.props.children);
        const step = children[this.props.active];

        return (
            <div className={styles.step}>{step}</div>
        );
    }
}

class Step extends Component {
    render () {
        return (
            <div className={styles.stepContent}>{this.props.children}</div>
        );
    }
}

export default class Introduction extends Component {
    constructor (props) {
        super(props);

        this.state = {
            step: 0,
            confirmedPrivacy: false
        };

        this.handleNextStep = this.handleNextStep.bind(this);
        this.handleBackStep = this.handleBackStep.bind(this);
        this.handleFinalStep = this.handleFinalStep.bind(this);
        this.handlePrivacyChange = this.handlePrivacyChange.bind(this);
    }

    handlePrivacyChange (isSharing) {
        const { user } = this.props;
        var onSuccess = () => {
            // Tell the UI to allow to continue to the next step
            // if they have confirmed their privacy settings
            this.setState({
                confirmedPrivacy: true
            });
        };
        this.props.relay.commitUpdate(
            new UpdatePrivacyMutation({
                user,
                sharing: isSharing
            }),
            {
                onSuccess
            });
    }

    handleFinalStep () {
        const { user } = this.props;

        var onSuccess = () => {
            this.handleNextStep();
        };

        this.props.relay.commitUpdate(
            new HideIntroductionMutation({
                user
            }),
            {
                onSuccess
            }
        );
    }

    handleNextStep () {
        this.setState({
            step: this.state.step + 1
        });
    }

    handleBackStep () {
        this.setState({
            step: this.state.step - 1
        });
    }

    render () {
        return (
            <Layout>
                <Header auth={this.props.auth} user={this.props.user}>
                    <ol className={styles.header}>
                        <li className={(this.state.step >= 0) && styles.stepComplete}>1. About</li>
                        <li className={(this.state.step >= 1) && styles.stepComplete}>2. Entries</li>
                        <li className={(this.state.step >= 2) && styles.stepComplete}>3. Privacy</li>
                        <li className={(this.state.step >= 3) && styles.stepComplete}>4. Sharing</li>
                        <li className={(this.state.step >= 4) && styles.stepComplete}>5. Done</li>
                    </ol>
                </Header>
                <Content>
                    <Stepper active={this.state.step}>
                        <Step>
                            <div>
                                <h1 className={headings.large}>Get Started</h1>
                                <p>Welcome! Watch the video below to find out more about Daybook</p>
                            </div>
                            <div className={styles.videoWrapper}>
                                <video
                                    src='/video/intro.m4v'
                                    controls={true}
                                    className={styles.video}
                                />
                            </div>
                            <div className={styles.controls}>
                                <Button onClick={this.handleNextStep}>Next</Button>
                            </div>
                        </Step>

                        <Step>
                            <div>
                                <h1 className={headings.large}>Adding an Entry</h1>
                                <p>Great, you’re all set up! Watch the video below to find out to get started with adding an entry.</p>
                            </div>
                            <div className={styles.videoWrapper}>
                                <video
                                    src='/video/adding.m4v'
                                    controls={true}
                                    className={styles.video}
                                />
                            </div>
                            <div className={styles.controls}>
                                <Button onClick={this.handleBackStep}>Back</Button>
                                <Button onClick={this.handleNextStep}>Next</Button>
                            </div>
                        </Step>

                        <Step>
                            <div>
                                <h1 className={headings.large}>Privacy</h1>
                                <p>Watch the video below to learn how you can help share your experiences on Daybook</p>
                            </div>
                            <div className={styles.videoWrapper}>
                                <video
                                    src='/video/privacy.m4v'
                                    controls={true}
                                    className={styles.video}
                                />
                            </div>
                            <div className={styles.controls}>
                                <Button onClick={this.handleBackStep}>Back</Button>
                                <Button onClick={this.handleNextStep}>Next</Button>
                            </div>
                        </Step>

                        <Step>
                            <div>
                                <h1 className={headings.large}>Do you want to share your Daybook?</h1>
                                <p>If you click <strong>Yes</strong> to share your Daybook people at the council or your service provider will be able to look at what you have put in it. This is so that the Council or service provider can use your views to help them make plans and choices.</p>

                                <p>If you choose <strong>No</strong> to sharing the council or service provider will not be able to see your diary entries but it will still get information about what you and other people are making entries about.</p>
                                <PrivacyForm onChange={this.handlePrivacyChange} />
                            </div>
                            <div className={styles.controls}>
                                <Button onClick={this.handleBackStep}>Back</Button>
                                {this.state.confirmedPrivacy && (
                                    <Button onClick={this.handleFinalStep}>Next</Button>
                                )}
                            </div>
                        </Step>

                        <Step>
                            <div>
                                <h1 className={headings.large}>You're Set Up!</h1>
                                <p>Add an entry or do something&hellip;</p>
                            </div>
                            <div className={styles.controls}>
                                <ButtonLink to='/app/home'>I'm Ready!</ButtonLink>
                            </div>
                        </Step>
                    </Stepper>
                </Content>
            </Layout>
        );
    }
}

export const IntroductionContainer = Relay.createContainer(Introduction, {
    fragments: {
        user: () => Relay.QL`
            fragment on User {
                id
                ${Header.getFragment('user')}
                ${UpdatePrivacyMutation.getFragment('user')}
                ${HideIntroductionMutation.getFragment('user')}
                profile {
                    isSharing
                }
            }
        `
    }
});
