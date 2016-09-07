import React, { Component } from 'react';

export class IconCard extends Component {
    static propTypes = {
        /* If no onChange is provided the IconCard is rendered as a static UI component */
        onChange: React.PropTypes.func,
        value: React.PropTypes.string,
        icon: React.PropTypes.string.isRequired,
        message: React.PropTypes.string.isRequired,
    }
    generateClassName() {
        return 'iconCard '+this.props.icon;
    }
    renderStatic() {
        return (
            <div className={this.generateClassName()}>
                <div>
                    <span className="icon"></span>
                    <span>{this.props.message}</span>
                </div>
            </div>
        );
    }
    renderCheckbox() {
        return (
            <div className={this.generateClassName()}>
                <label>
                    <input
                        type='checkbox'
                        className='visual-hidden'
                        value={this.props.value}
                        onChange={this.props.onChange}
                    />
                    <span className="icon"></span>
                    <span>{this.props.message}</span>
                </label>
            </div>
        );
    }
    render() {
        if(this.props.onChange) {
            return this.renderCheckbox();
        }
        return this.renderStatic();
    }
};
