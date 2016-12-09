import React, { Component } from 'react';

import Layout from './Layout';
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
            step: 0
        }
        this.handleNextStep = this.handleNextStep.bind(this);
        this.handleBackStep = this.handleBackStep.bind(this);
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
                        active={this.state.step}
                        onNext={this.handleNextStep}
                        onBack={this.handleBackStep}>
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
                                    Share Settings
                                    <input type="radio" name="share" value="yes" />
                                    <input type="radio" name="share" value="no" />
                                </label>
                            </form>
                            <button onClick={this.handleBackStep}>back</button>
                            <button onClick={this.handleNextStep}>next</button>
                        </Step>
                        <Step>
                            <h1>You're Set Up!</h1>
                            <p>Add an entry or do something...</p>
                        </Step>
                    </Stepper>
                </Content>
            </Layout>
        );
    }
}
