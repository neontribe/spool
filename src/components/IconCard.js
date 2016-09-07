import React, { Component } from 'react';
import { FormGroup, ControlLabel, Button, ButtonToolbar, Glyphicon, Grid, Row, Col } from 'react-bootstrap';

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
            <Col xs={6} sm={3} className={this.generateClassName()}>
                <div>
                    <span className="icon"></span>
                    <span>{this.props.message}</span>
                </div>
            </Col>
        );
    }
    renderCheckbox() {
        return (
            <Col xs={6} sm={3} className={this.generateClassName()}>
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
            </Col>
        );
    }
    render() {
        if(this.props.onChange) {
            return this.renderCheckbox();
        }
        return this.renderStatic();
    }
};
