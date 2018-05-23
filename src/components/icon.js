import React from 'react';


const Icon = (props) => {
    const style = { color: props.fill, fontSize: props.size, userSelect: 'none' };

    return (<span className="material-icons" style={style}>{props.name}</span>);
}

export default Icon;