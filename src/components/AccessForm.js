import React, { Component } from 'react';
import _ from 'lodash';
import moment from 'moment';
import Relay from 'react-relay';
import { withRouter } from 'react-router';

import DatePicker from './DatePicker';
import Button from './Button';
import IconChooser from './IconChooser';

export class AccessForm extends Component {
    static fields = [
        'from',
        'to',
        'topics'
    ]

    constructor (props) {
        super(props);

        this.state = {
            from: moment().add(-1, 'months').startOf('date').toISOString(),
            to: moment().add(1, 'months').endOf('date').toISOString(),
            topics: []
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

    handleInputChange (key, evt) {
        this.handleChange(key, evt.target.value);
    }

    handleFromChange (value) {
        this.handleChange('from', moment(value).startOf('date'));
    }

    handleToChange (value) {
        this.handleChange('to', moment(value).endOf('date'));
    }

    handleChange (key, value) {
        this.setState({
            [key]: value
        });
    }

    handleSuccess () {
        const payload = _.pick(this.state, AccessForm.fields);

        this.props.onSuccess(payload);
    }

    render () {
        var valid = false;

        if (this.state.from && this.state.to && this.state.topics.length > 0) {
            valid = true;
        }

        return (
            <div>
                <h1>Access Form</h1>
                <div>
                    <IconChooser
                        label='Entries tagged with topic'
                        choices={this.props.consumer.topics}
                        maxSelections={1}
                        onChange={this.handleTopics}
                    />
                    <DatePicker
                        value={this.state.from}
                        onChange={this.handleFromChange}
                    />
                    <DatePicker
                        value={this.state.to}
                        onChange={this.handleToChange}
                    />
                </div>

                {valid && (
                    <Button onClick={this.handleSuccess}>Search</Button>
                )}
            </div>
        );
    }
}

// AccessForm = withRouter(AccessForm);

export default withRouter(AccessForm);

export const AccessFormContainer = Relay.createContainer(withRouter(AccessForm), {
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
