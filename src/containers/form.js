import React from 'react';
import { withRouter, NavLink } from 'react-router-dom';
import { connect } from 'react-redux';
import styled from 'styled-components';

import * as actions from '../actions';

import handleValidation from '../services/formValidation';

const Wrapper = styled.div`
    width:100%;
    max-width:1200px;
    margin:0 auto;
`;

const Container = styled.section`
    width:50%;
    max-width:450px;
    margin:5rem auto;
    @media only screen and (max-width:768px) {
        width:80%;
    }
`;

const Header = styled.header`
    display:flex;
    justify-content:space-between;
    padding:1rem; 
`;

const Nav = styled.nav`
    display:flex;
    justify-content:space-between;
    align-items:center;
    width:7rem;
`;

const Form_section = styled.form`
    display:flex;
    flex-direction:column;
`;

const Form_item = styled.input`
    padding:.8rem;
    margin:.5rem 0;
    border:1.5px solid ${props => props.state !== false ? '#eee' : 'red'};
`;

const Heading = styled.h2`
    padding:2rem;
`;

const Button = styled.button`
    padding:.8rem .5rem;
    background-color:red;
    border:none;
    margin:none;
    color:white;
    &:hover{
        opacity:.8;
    }
`;

const Check = styled.input`
    margin-right:.5rem;
`;

const Form_validation_hints = styled.p`
    color:red;
    font-weight:700;
    margin-top:1rem;
    text-align:center;
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
            password2: "",
            persistentSession: false,
            newAccountValidation: {
                email: true,
                usern: true,
                pass: true,
                pass2: true
            },
            validationMessage: ""
        }
    }

    handleSubmit = e => {
        e.preventDefault();

        const { location, handleAuth } = this.props;
        const route = location.pathname.toLowerCase().slice(1);

        if (handleValidation(this.state, this.setState.bind(this))) {
            handleAuth(route, this.state).then(res => {
                if (res.status && res.status !== 200) {
                    this.setState({ validationMessage: 'incorrect login data' });
                }
            });
        }
    }

    toggleChecked = () => {
        this.setState(prevState => ({ persistentSession: !prevState.persistentSession }));
    }

    getHeading = isSignUpRoute => {
        return isSignUpRoute ? 'Sign Up to enter our App.' : 'Log in to get access to your account.';
    }

    isSignUpRoute = () => {
        return this.props.location.pathname.toLowerCase().slice(1) === 'signup';
    }

    render() {
        const { email, username, password, password2, checked, validationMessage,
            newAccountValidation } = this.state;

        const isSignUp = this.isSignUpRoute();

        return (
            <Wrapper>
                <Header>
                    <h2><NavLink to="/">ProjectT</NavLink></h2>
                    <Nav>
                        <NavLink to="/signup">SignUp</NavLink>
                        <NavLink to="/login">LogIn</NavLink>
                    </Nav>
                </Header>
                <Container>
                    <Form_section onSubmit={this.handleSubmit}>
                        <Heading>{this.getHeading(isSignUp)}</Heading>
                        <label htmlFor="email" hidden>email</label>
                        <Form_item value={email} onChange={(e) => this.setState({ email: e.target.value })}
                            placeholder="email" state={isSignUp ? newAccountValidation.email : null} name="email" />
                        {isSignUp &&
                            (<label htmlFor="username" hidden>username</label>) &&
                            (<Form_item value={username}
                                onChange={(e) => this.setState({ username: e.target.value })}
                                name="username" placeholder="username"
                                state={isSignUp ? newAccountValidation.usern : null} />)}
                        <label htmlFor="password" hidden>password</label>
                        <Form_item value={password}
                            onChange={(e) => this.setState({ password: e.target.value })}
                            name="password" type="password" placeholder="password"
                            state={isSignUp ? newAccountValidation.pass : null} />
                        {isSignUp && <label htmlFor="password2" hidden>password again</label> &&
                            <Form_item value={password2}
                                onChange={(e) => this.setState({ password2: e.target.value })} type="password"
                                name="password2" placeholder="confirm password"
                                state={isSignUp ? newAccountValidation.pass2 : null} />}
                        {!isSignUp && <StaySigned_section>
                            <Check type="checkbox" checked={checked} name="staysigned"
                                onChange={this.toggleChecked} />
                            <label htmlFor="staysigned"><span></span>Stay logged in</label>
                        </StaySigned_section>}
                        <Button>Submit</Button>
                    </Form_section>
                    <Form_validation_hints>{validationMessage}</Form_validation_hints>
                </Container>
            </Wrapper>);
    }
}

const mapDispatchToProps = dispatch => ({
    handleAuth: (type, data) => dispatch(actions.global.handleAuth(type, data))
});

export default withRouter(connect(null, mapDispatchToProps)(Form));