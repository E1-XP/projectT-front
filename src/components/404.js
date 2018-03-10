import React from 'react';
import { withRouter } from 'react-router-dom';

const NotFound = (props) => {
    props.history.push('/');
    return null;
}

export default NotFound;