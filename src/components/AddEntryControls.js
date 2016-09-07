import React, { Component } from 'react';
import { Button, Glyphicon } from 'react-bootstrap';

class AddEntryControls extends Component {
    constructor(props) {
        super(props);

        this.state = {

        };
    }

    render() {
        return (
            <div className="add-entry-controls">
                <div className="group-left">
                    {this.props.onBack &&
                        <Button
                            onClick={this.props.onBack}
                            disabled={this.props.disableBack}>
                            <Glyphicon glyph="chevron-left" /> Back
                        </Button>
                    }
                    {this.props.onQuit &&
                        <Button
                            onClick={this.props.onQuit}
                            disabled={this.props.disableQuit}>
                            <Glyphicon glyph="remove" /> Quit
                        </Button>
                    }
                </div>
                <div className="group-right">
                    {this.props.onNext &&
                        <Button
                            onClick={this.props.onNext}
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