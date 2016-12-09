import React, { Component } from 'react';
import _ from 'lodash';

import styles from './css/AddControls.module.css';
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
            <div className={styles.wrapper}>
                {this.onBack && (
                    <a
                        role='button'
                        onClick={this.onBack}
                        disabled={this.props.disableBack}
                        className={controls.btnRaised}
                    >Back</a>
                )}

                {this.onQuit && (
                    <a
                        role='button'
                        onClick={this.onQuit}
                        disabled={this.props.disableQuit}
                        className={controls.btnRaised}
                    >Quit</a>
                )}

                {this.onNext && (
                    <a
                        role='button'
                        onClick={this.onNext}
                        disabled={this.props.disableNext}
                        className={controls.btnRaised}
                    >Next</a>
                )}
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
