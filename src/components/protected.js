import React from 'react';
import { withRouter } from 'react-router-dom';

class Protected_container extends React.Component {
    componentDidMount() {
        const { location, history, isAuthenticated } = this.props;

        if (!isAuthenticated && location.pathname.slice(1).toLowerCase() !== 'signup') history.push('/login');
    }

    render() {
        const { isAuthenticated, children } = this.props;

        return (isAuthenticated) ? children : null;///<Redirect to="/login" />;
    }
}

export default withRouter(Protected_container);