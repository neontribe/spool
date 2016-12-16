import React, { Component } from 'react';
import DatePicker from 'react-bootstrap-date-picker';
import _ from 'lodash';
import moment from 'moment';
import Relay from 'react-relay';
import { withRouter } from 'react-router';

import Button from './Button';
import IconChooser from './IconChooser';
import withRoles from '../auth/withRoles.js';

export class AccessForm extends Component {
    static fields = [
        'from',
        'to',
        'topics'
    ]

    constructor (props) {
        super(props);

        this.state = {
            from: moment().add(-1, 'months').toISOString(),
            to: moment().add(1, 'months').toISOString(),
            topics: [],
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleFromChange = this.handleFromChange.bind(this);
        this.handleToChange = this.handleToChange.bind(this);
        this.handleSuccess = this.handleSuccess.bind(this);

        this.handleTopics = _.partial(this.handleChange, 'topics');
        this.handleFrom = _.partial(this.handleInputChange, 'from');
        this.handleTo = _.partial(this.handleInputChange, 'to');
    }

    handleInputChange(key, evt) {
        this.handleChange(key, evt.target.value);
    }

    handleFromChange(value) {
        this.handleChange('from', value);
    }

    handleToChange(value) {
        this.handleChange('to', value);
    }

    handleChange (key, value) {
        this.setState({
            [key]: value,
        });
    }

    handleSuccess () {
        const payload = _.pick(this.state, AccessForm.fields);

        console.log(payload);

        this.props.onSuccess(payload);
    }

    render () {
        console.log(this.props, this.state);

        // Validate
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
                        <DatePicker
                            value={this.state.from}
                            onChange={this.handleFromChange}
                        />
                    </div>
                    <div>
                        <DatePicker
                            value={this.state.to}
                            onChange={this.handleToChange}
                        />
                    </div>
                </div>
                <div>
                    <Button onClick={this.handleSuccess}>Search</Button>
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
