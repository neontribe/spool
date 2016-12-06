import React, { Component } from 'react';
import DatePicker from 'react-bootstrap-date-picker';
import _ from 'lodash';
import moment from 'moment';
import Relay from 'react-relay';
import { withRouter } from 'react-router';

import AddControls from './AddControls';
import IconChooser from './IconChooser';
import withRoles from '../auth/withRoles.js';

export class AccessForm extends Component {
    static fields = ['from', 'to', 'topics']
    constructor (props) {
        super(props);

        this.state = {
            from: moment().add(-1, 'months').toISOString(),
            to: moment().add(1, 'months').toISOString(),
            topics: [],
        }
        this.handleChange = this.handleChange.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleSuccess = this.handleSuccess.bind(this);

        this.handleTopics = _.partial(this.handleChange, 'topics');
        this.handleFrom = _.partial(this.handleInputChange, 'from');
        this.handleTo = _.partial(this.handleInputChange, 'to');
    }

    handleInputChange(key, evt) {
        this.handleChange(key, evt.target.value);
    }

    handleChange (key, value) {
        this.setState({
            [key]: value,
        });
    }

    handleSuccess () {
        this.props.onSuccess(_.pluck(this.state, AccessForm.fields));
    }

    render () {
        console.log(this.props);
        //validate
        var valid = false;
        if (this.state.from && this.state.to && this.state.topics.length > 0) {
            valid = true;
        }
        return (
            <div>
                <h2>Access Form</h2>
                <div>
                    <IconChooser
                        label='Entries tagged with topic'
                        choices={this.props.consumer.topics}
                        maxSelections={1}
                        onChange={this.handleTopics}
                    />
                    <div>
                        {/*<ControlLabel>From</ControlLabel>*/}
                        <DatePicker
                            value={this.state.from}
                            onChange={this.handleChange}
                        />
                    </div>
                    <div>
                        {/*<ControlLabel>To</ControlLabel>*/}
                        <DatePicker
                            value={this.state.to}
                            onChange={this.handleChange}
                        />
                    </div>
                </div>
                <div>
                    <AddControls
                        disableNext={valid}
                        onNext={this.handleSuccess}
                        onQuit={this.props.router.goBack}
                    />
                </div>
            </div>
        );
    }
}

AccessForm = withRouter(AccessForm);
export default AccessForm;

export const AccessFormContainer = Relay.createContainer(AccessForm, {
    fragments: {
        consumer: () => Relay.QL`
        fragment on Consumer {
            topics {
                type,
                name
            }
        }`
    }
});
