import React, { Component } from 'react';
import _ from 'lodash';

import AddControls from './AddControls';

class SentimentForm extends Component {
    constructor (props) {
        super(props);

        this.state = {
            value: props.initialValue
        };

        this.continue = this.continue.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    continue () {
        this.props.save(this.props.saveKey, this.state.value);
    }

    handleChange (value) {
        this.setState({
            value: value
        })
    }

    render () {
        return (
            <div>
                <div>
                    <p><strong>Does it make you happy or sad?</strong></p>
                </div>

                <div>
                    <a role="button" onClick={_.partial(this.handleChange, 'happy')} >
                        <img src="/static/happy.png" alt="Happy" />
                    </a>

                    <a role="button" onClick={_.partial(this.handleChange, 'sad')}>
                        <img src="/static/sad.png" alt="Sad" />
                    </a>
                </div>
                <div>
                    <AddControls
                        onNext={this.continue}
                        disableNext={!this.state.value}
                    />
                </div>
            </div>
        );
    }
}

SentimentForm.propTypes = {
    initialValue: React.PropTypes.string,
    save: React.PropTypes.func,
    saveKey: React.PropTypes.string
};

SentimentForm.defaultProps = {
    initialValue: '',
    saveKey: 'sentiment'
};

export default SentimentForm;
