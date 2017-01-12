import React, { Component } from 'react';

import { IconCard } from './IconCard';
import Grid from './Grid';

import styles from './css/IconChooserGrid.module.css';
import headings from '../css/Headings.module.css';

class IconChooserGrid extends Component {
    constructor (props) {
        super(props);

        this.state = {
            value: props.initialValue
        };

        this.handleChange = this.handleChange.bind(this);
    }

    handleChange (event) {
        var valueExists = this.state.value.indexOf(event.target.value);
        var values = this.state.value.slice(0);

        if (valueExists === -1) {
            values.push(event.target.value);
        } else {
            values.splice(valueExists, 1);
        }

        if (this.props.maxSelections) {
            if (values.length > this.props.maxSelections) {
                values.shift();
            }
        }

        this.setState({
            value: values
        });

        this.props.onChange(values);
    }

    render () {
        return (
            <div className={styles.wrapper}>
                <h2 className={headings.large}>{this.props.label}</h2>

                <Grid enforceConsistentSize={true}>
                    {this.props.choices.map((t, i) => (
                        <IconCard
                            key={i}
                            onChange={this.handleChange}
                            checked={(this.state.value.indexOf(t.type) !== -1)}
                            icon={t.type}
                            message={t.name}
                            value={t.type}
                            classNames={{
                                wrapper: styles.iconWrapper,
                                option: styles.option,
                                message: styles.message,
                                icon: styles.icon,
                                field: styles.field
                            }}
                        />
                    ))}
                </Grid>
            </div>
        );
    }
}

IconChooserGrid.propTypes = {
    initialValue: React.PropTypes.array,
    onChange: React.PropTypes.func,
    choices: React.PropTypes.array,
    saveKey: React.PropTypes.string,
    label: React.PropTypes.string,
    maxSelections: React.PropTypes.number,
    applyGrid: React.PropTypes.bool
};

IconChooserGrid.defaultProps = {
    initialValue: []
};

export default IconChooserGrid;
