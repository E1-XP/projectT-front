import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import * as actions from '../actions';

class Profile extends React.Component {
    handleLogout() {
        this.props.logout();

    }

    render() {
        return (
            <div>
                <h2>Profile edit</h2>
                <Link onClick={() => this.handleLogout()} to="/login">Logout</Link>
            </div>
        );
    }
}

const mapDispatchToProps = dispatch => ({
    logout: () => dispatch(actions.global.handleLogout())
});

export default connect(null, mapDispatchToProps)(Profile);