import React from 'react';
import { withRouter, NavLink } from 'react-router-dom';
import { connect } from 'react-redux';
import * as actions from '../actions';

import styled from 'styled-components';

const Wrapper = styled.div`
    width:100%;
    max-width:1200px;
    margin:00 auto;
`;

const Container = styled.section`
    width:50%;
    max-width:450px;
    margin:5rem auto;
`;

const Header = styled.header`
    display:flex;
    justify-content:space-between;
    padding:1rem;
`;

const Nav = styled.nav`
    display:flex;
    justify-content:space-between;
    width:7rem;
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
    background-color:red;
    border:none;
    margin:none;
    color:white;
    &:hover{
        opacity:.8;
    }
`;

const Form_validation_hints = styled.p`
    color:red;
`;

const StaySigned_section = styled.section`
    display:flex;
    align-items:center;
    padding:.7rem;
`;

class Form extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            email: "",
            username: "",
            password: "",
            persistentSession: false
        }
    }

    handleSubmit = e => {
        e.preventDefault();

        const { location, handleAuth } = this.props;
        const route = location.pathname.toLowerCase().slice(1);

        handleAuth(route, this.state);
    }

    toggleChecked = () => {
        this.setState(prevState =>
            ({ persistentSession: !prevState.persistentSession }));
    }

    getHeading = isSignUpRoute => {
        return isSignUpRoute ? 'Sign Up to enter our App.' : 'Log in to get access to your account.';
    }

    render() {
        const { location } = this.props;
        const { email, username, password, checked } = this.state;

        const isSignUp = location.pathname.toLowerCase().slice(1) === 'signup';

        return (
            <Wrapper>
                <Header>
                    <h2>ProjectT</h2>
                    <Nav>
                        <NavLink to="/signup">SignUp</NavLink>
                        <NavLink to="/login">LogIn</NavLink>
                    </Nav>
                </Header>
                <Container>
                    <Form_section onSubmit={this.handleSubmit}>
                        <Heading>{this.getHeading(isSignUp)}</Heading>
                        <Form_item value={email} onChange={(e) => this.setState({ email: e.target.value })} placeholder="email" />
                        {isSignUp ? (<Form_item value={username} onChange={(e) => this.setState({ username: e.target.value })} placeholder="username" />) : null}
                        <Form_item value={password} onChange={(e) => this.setState({ password: e.target.value })} type="password" placeholder="password" />
                        {!isSignUp && <StaySigned_section>
                            <input type="checkbox" checked={checked} onChange={this.toggleChecked}
                                style={{ marginRight: '.5rem' }} />
                            <p>Stay logged in</p>
                        </StaySigned_section>}
                        <Button>Submit</Button>
                    </Form_section>
                    <Form_validation_hints />
                </Container>
            </Wrapper>);
    }
}

const mapDispatchToProps = dispatch => ({
    handleAuth: (type, data) => dispatch(actions.handleAuth(type, data))
});

export default withRouter(connect(null, mapDispatchToProps)(Form));