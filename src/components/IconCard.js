import React, { Component } from 'react';

export class IconCard extends Component {
    static propTypes = {
        /* If no `onChange` is provided the IconCard is rendered as a static UI component */
        onChange: React.PropTypes.func,
        value: React.PropTypes.string,
        icon: React.PropTypes.string.isRequired,
        message: React.PropTypes.string.isRequired,
    }

    renderStatic () {
        return (
            <div>{this.props.message}</div>
        );
    }

    renderCheckbox () {
        return (
            <div>
                <label>
                    <input
                        type='checkbox'
                        className='vh'
                        checked={this.props.checked}
                        value={this.props.value}
                        onChange={this.props.onChange}
                    />

                    {this.props.message}
                </label>
            </div>
        );
    }

    render () {
        if (this.props.onChange) {
            return this.renderCheckbox();
        }

        return this.renderStatic();
    }
};

export default IconCard;
