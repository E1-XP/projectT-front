import React from 'react';
import { connect } from 'react-redux';
import { withRouter, Redirect } from 'react-router-dom';

class Protected_container extends React.Component {
    componentDidMount() {
        const { location, history, isUserLoggedIn } = this.props;

        if (!isUserLoggedIn && location.pathname.slice(1).toLowerCase() !== 'signup') history.push('/login');
    }

    render() {
        const { isUserLoggedIn, children } = this.props;
        const path = this.props.location.pathname.toLowerCase();

        return (isUserLoggedIn) ? children : ((path === '/login') ? null : <Redirect to="/login" />);
    }
}
const mapStateToProps = ({ global }) => ({ isUserLoggedIn:global.isUserLoggedIn });

export default withRouter(connect(mapStateToProps, null)(Protected_container));