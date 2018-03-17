import React from 'react';
import { withRouter, Redirect } from 'react-router-dom';

class Protected_container extends React.Component {
    componentDidMount() {
        const { location, history, isAuthenticated } = this.props;

        if (!isAuthenticated && location.pathname.slice(1).toLowerCase() !== 'signup') history.push('/login');
    }

    render() {
        const { isAuthenticated, children } = this.props;
        const path = this.props.location.pathname.toLowerCase();
        return (isAuthenticated) ? children : ((path === '/login') ? null : <Redirect to="/login" />);
    }
}

export default withRouter(Protected_container);