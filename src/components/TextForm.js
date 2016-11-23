import React, { Component } from 'react';

import AddControls from './AddControls';

class TextForm extends Component {
    constructor (props) {
        super(props);

        this.state = {
            value: props.initialValue
        };

        this.continue = this.continue.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    continue () {
        this.props.save({
            text: this.state.value
        });
    }

    handleChange (event) {
        this.setState({
            value: event.target.value
        });
    }

    render () {
        return (
            <div>
                <form>
                    <h2>I just want to say...</h2>
                    <textarea
                        maxLength={this.props.maxLength}
                        placeholder=""
                        onChange={this.handleChange}
                    >{this.state.value}</textarea>

                    {/*<HelpBlock>{this.state.value.length} of {this.props.maxLength} letters used</HelpBlock>*/}
                    <p>{this.state.value.length} of {this.props.maxLength} letters used</p>
                </form>

                <AddControls
                    onNext={this.continue}
                    disableNext={!this.state.value}
                />
            </div>
        );
    }
}

TextForm.propTypes = {
    initialValue: React.PropTypes.string,
    save: React.PropTypes.func
};

TextForm.defaultProps = {
    initialValue: '',
    maxLength: 250
};

export default TextForm;
