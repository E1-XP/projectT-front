import React from 'react';
import { Link } from 'react-router-dom';

class Profile extends React.Component {
    render() {
        return (
            <div>
                <h2>Profile edit</h2>
                <Link onClick={this.props.handleLogout} to="/login">Logout</Link>
            </div>
        );
    }
}

export default Profile;