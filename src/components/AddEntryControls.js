import React, { Component } from 'react';
import { Button, Glyphicon } from 'react-bootstrap';
import  _ from 'lodash';

class AddEntryControls extends Component {

    constructor(props) {
        super(props);
        if (this.props.onNext) {
            this.onNext = _.debounce(this.props.onNext, 500, {leading: true, trailing: false});
        }
        if (this.props.onBack) {
            this.onBack = _.debounce(this.props.onBack, 500, {leading: true, trailing: false});
        }
        if (this.props.onQuit) {
            this.onQuit = _.debounce(this.props.onQuit, 500, {leading: true, trailing: false});
        }

    }

    render() {
        return (
            <div className="full-width">
                <div className="group-left">
                    {this.onBack &&
                        <Button
                            onClick={this.onBack}
                            disabled={this.props.disableBack}>
                            <Glyphicon glyph="chevron-left" /> Back
                        </Button>
                    }
                    {this.onQuit &&
                        <Button
                            onClick={this.onQuit}
                            disabled={this.props.disableQuit}>
                            <Glyphicon glyph="remove" /> Quit
                        </Button>
                    }
                </div>
                <div className="group-right">
                    {this.onNext &&
                        <Button
                            onClick={this.onNext}
                            disabled={this.props.disableNext}>
                            <Glyphicon glyph="ok" /> OK
                       </Button>
                    }

                </div>
            </div>
        );
    }
}

AddEntryControls.propTypes = {
    onQuit: React.PropTypes.func,
    onBack: React.PropTypes.func,
    onNext: React.PropTypes.func,
    disableNext: React.PropTypes.bool,
    disableBack: React.PropTypes.bool,
    disableQuit: React.PropTypes.bool
};

AddEntryControls.defaultProps = {

};

export default AddEntryControls;
