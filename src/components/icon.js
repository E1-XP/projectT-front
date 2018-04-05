import React from 'react';

const Icon = (props) => {
    return (<span className="material-icons" style={{ color: props.fill, fontSize: props.size }} >{props.name}</span>);
}

export default Icon;