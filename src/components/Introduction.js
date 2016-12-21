import React, { Component } from 'react';
import Relay from 'react-relay';
import HideIntroductionMutation from './mutations/HideIntroductionMutation.js';
import UpdatePrivacyMutation from './mutations/UpdatePrivacyMutation.js';
import Layout from './Layout';
import {Link} from 'react-router';
const { Header, Content } = Layout;


class Stepper extends Component {
    render () {
        const children = React.Children.toArray(this.props.children);
        const step = children[this.props.active];
        return (<div>{step}</div>);
    }
}
class Step extends Component {
    render () {
        return (<div>{this.props.children}</div>);
    }
}
export default class Introduction extends Component {
    constructor(props) {
        super(props);
        this.state = {
            step: 0,
            confirmedPrivacy: false,
        }
        this.handleNextStep = this.handleNextStep.bind(this);
        this.handleBackStep = this.handleBackStep.bind(this);
        this.handleFinalStep = this.handleFinalStep.bind(this);
        this.handleSharingChange = this.handleSharingChange.bind(this);
    }
    handleSharingChange (evt) {
        const { user } = this.props;
        const value = parseInt(evt.target.value);
        var onSuccess = () => {
            // tell the UI to allow to continue to the next step
            // if they have confirmed their privacy settings
            this.setState({
                confirmedPrivacy: true
            });
        };
        this.props.relay.commitUpdate(
            new UpdatePrivacyMutation({
                user,
                sharing: !!value
            }),
            {
                onSuccess
            });

        this.setState({
            sharing: !!value
        });
    }
    handleFinalStep() {
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
            });
    }
    handleNextStep() {
        this.setState({
            step: this.state.step+1,
        });
    }
    handleBackStep() {
        this.setState({
            step: this.state.step-1,
        });
    }
    render () {
        return (
            <Layout>
                <Header auth={this.props.auth}>
                    <p>Progress</p>
                </Header>
                <Content>
                    <Stepper
                        active={this.state.step}>
                        <Step>
                            <h1>Get Started</h1>
                            <p>Blabla bla</p>
                            <button onClick={this.handleNextStep}>next</button>
                        </Step>
                        <Step>
                            <h1>Adding an Entry</h1>
                            <p>Blabla bla</p>
                            <button onClick={this.handleBackStep}>back</button>
                            <button onClick={this.handleNextStep}>next</button>
                        </Step>
                        <Step>
                            <h1>Privacy Explainer</h1>
                            <p>Blabla bla</p>
                            <button onClick={this.handleBackStep}>back</button>
                            <button onClick={this.handleNextStep}>next</button>
                        </Step>
                        <Step>
                            <h1>Do you want to share?</h1>
                            <p>Blabla bla</p>
                            <form>
                                <label>
                                    Yes
                                    <input type="radio" name="share" value="1" onChange={this.handleSharingChange} />
                                </label>
                                <label>
                                    No
                                    <input type="radio" name="share" value="0" onChange={this.handleSharingChange} />
                                </label>
                            </form>
                            <button onClick={this.handleBackStep}>back</button>
                            { this.state.confirmedPrivacy && <button onClick={this.handleFinalStep}>next</button> }
                        </Step>
                        <Step>
                            <h1>You're Set Up!</h1>
                            <p>Add an entry or do something...</p>
                            <Link to="/app/home">Home</Link>
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
                ${UpdatePrivacyMutation.getFragment('user')}
                ${HideIntroductionMutation.getFragment('user')}
                profile {
                    isSharing
                }
            }
        `,
    }
});
