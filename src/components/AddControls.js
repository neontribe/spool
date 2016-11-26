import React, { Component } from 'react';
import _ from 'lodash';

import controls from '../css/Controls.module.css';

class AddControls extends Component {
    constructor (props) {
        super(props);

        if (this.props.onNext) {
            this.onNext = _.debounce(this.props.onNext, 500, { leading: true, trailing: false });
        }

        if (this.props.onBack) {
            this.onBack = _.debounce(this.props.onBack, 500, { leading: true, trailing: false });
        }

        if (this.props.onQuit) {
            this.onQuit = _.debounce(this.props.onQuit, 500, { leading: true, trailing: false });
        }
    }

    render () {
        return (
            <div className={controls.btnToolbar}>
                <div>
                    {this.onBack && (
                        <button
                            onClick={this.onBack}
                            disabled={this.props.disableBack}
                            className={controls.btn}
                        >Back</button>
                    )}

                    {this.onQuit && (
                        <button
                            onClick={this.onQuit}
                            disabled={this.props.disableQuit}
                            className={controls.btn}
                        >Quit</button>
                    )}
                </div>
                <div>
                    {this.onNext && (
                        <button
                            onClick={this.onNext}
                            disabled={this.props.disableNext}
                            className={controls.btn}
                        >OK</button>
                    )}
                </div>
            </div>
        );
    }
}

AddControls.propTypes = {
    onQuit: React.PropTypes.func,
    onBack: React.PropTypes.func,
    onNext: React.PropTypes.func,
    disableNext: React.PropTypes.bool,
    disableBack: React.PropTypes.bool,
    disableQuit: React.PropTypes.bool
};

export default AddControls;
