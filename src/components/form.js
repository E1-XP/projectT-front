import React from 'react';
import { withRouter } from 'react-router-dom';
import axios from 'axios';

class Form extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            email: "",
            username: "",
            password: ""
        }
    }

    handleSubmit(e) {
        e.preventDefault();


    }

    render() {
        const { location } = this.props;
        const { email, username, password } = this.state;
        const isSignUp = location.pathname.toLowerCase().slice(1) === 'signup';
        const formHeading = isSignUp ? 'Sign Up to enter our App' : 'Log in to get access to your account';

        return (
            <form onSubmit={this.handleSubmit.bind(this)}>
                <h2>{formHeading}</h2>
                <input value={email} onChange={(e) => this.setState({ email: e.target.value })} placeholder="email" />
                {isSignUp ? (<input value={username} onChange={(e) => this.setState({ username: e.target.value })} placeholder="username" />) : null}
                <input value={password} onChange={(e) => this.setState({ password: e.target.value })} type="password" placeholder="password" />
                <button>Submit</button>
            </form>
        );
    }
}

export default withRouter(Form);