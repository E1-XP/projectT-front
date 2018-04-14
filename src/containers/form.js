import React from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import * as actions from '../actions';

import styled from 'styled-components';

const Container = styled.section`
    width:50%;
    margin:5rem auto;
`;

const Form_section = styled.form`
    display:flex;
    flex-direction:column;
`;

const Form_item = styled.input`
    padding:.5rem;
`;

const Heading = styled.h2`
    padding:2rem;
`;

const Button = styled.button`
    padding:.5rem;
    background-color:green;
    border:none;
    margin:none;
    color:white;
    &:hover{
        opacity:.8;
    }
`;

const Form_validation_hints = styled.p`
    
`;

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

        const { location, handleAuth } = this.props;
        const route = location.pathname.toLowerCase().slice(1);

        const formData = new URLSearchParams();
        for (const prop in this.state) {
            if (this.state[prop]) formData.append(prop, this.state[prop]);
        }

        handleAuth(route, formData);
    }

    render() {
        const { location } = this.props;
        const { email, username, password } = this.state;
        const isSignUp = location.pathname.toLowerCase().slice(1) === 'signup';
        const formHeading = isSignUp ? 'Sign Up to enter our App.' : 'Log in to get access to your account.';

        return (
            <Container>
                <Form_section onSubmit={this.handleSubmit.bind(this)}>
                    <Heading>{formHeading}</Heading>
                    <Form_item value={email} onChange={(e) => this.setState({ email: e.target.value })} placeholder="email" />
                    {isSignUp ? (<Form_item value={username} onChange={(e) => this.setState({ username: e.target.value })} placeholder="username" />) : null}
                    <Form_item value={password} onChange={(e) => this.setState({ password: e.target.value })} type="password" placeholder="password" />
                    <Button>Submit</Button>
                </Form_section>
                <Form_validation_hints />
            </Container>
        );
    }
}

const mapDispatchToProps = dispatch => ({
    handleAuth: (type, data) => dispatch(actions.handleAuth(type, data))
});

export default withRouter(connect(null, mapDispatchToProps)(Form));