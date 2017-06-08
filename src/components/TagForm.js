import React, { Component } from 'react';

import Button from './Button';
import TouchIcon from './TouchIcon';

import styles from './css/TagForm.module.css';

class TagForm extends Component {
    constructor (props) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
        this.continue = this.continue.bind(this);
        this.state = { value: [] };
    }

    continue () {
        this.props.save(this.props.saveKey, this.state.value);
    }

    handleChange (event) {
        const { value } = event.target;

        const newValue = this.state.value.slice(0);
        var existing = newValue.indexOf(value);

        if (existing === -1) {
            newValue.push(value);
        } else {
            newValue.splice(existing, 1);
        }
        this.setState({value: newValue});
    }

    renderTags () {
        const { serviceUsers } = this.props;

        return serviceUsers.map(({ nickname, userId }) => {
            let checked = this.state.value.indexOf(userId.toString()) !== -1;
            return (
                <label key={userId} className={styles.tag}>
                    <input
                        type='checkbox'
                        name='tags'
                        checked={checked}
                        value={userId}
                        className={styles.field}
                        onChange={this.handleChange}
                    />
                    <span className={styles.message}>{nickname}</span>
                </label>
            );
        });
    }

    render () {
        return (
            <div className={styles.wrapper}>
                { this.renderTags() }
                <div>
                    <div className={styles.controls}>
                        <Button onClick={this.continue}><TouchIcon />Continue</Button>
                    </div>
                </div>
            </div>
        );
    }
}

TagForm.propTypes = {
    save: React.PropTypes.func
};

TagForm.defaultProps = {
    save: Function.prototype,
    saveKey: 'tags'
};

export default TagForm;
