import React, { Component } from 'react';
import { ListGroup } from 'react-bootstrap';
import Entry from './Entry';

class Timeline extends Component {
    render() {
        return (
            <ListGroup componentClass="div">
                {this.props.entries.map((entry, i) => {
                    return (<Entry key={i} {...entry}/>);
                })}
            </ListGroup>
        );
    }
}

Timeline.propTypes = {
    entries: React.PropTypes.array.isRequired
};

export default Timeline
