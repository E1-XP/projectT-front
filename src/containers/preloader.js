import React from 'react';
import { connect } from 'react-redux';
import * as actions from '../actions';
import { withRouter } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';

const Main_preloader = styled.div`
    background-color:#333;
    color:white;
    width:100%;
    display:flex;
    flex-direction:column;
    justify-content:center;
    align-items:center;
`;

const rotateAnim = keyframes`
    from{
        transform:rotate(0deg);
    }
    to{
        transform:rotate(360deg);
    }
`;

const Spinner = styled.div`
    margin-top:1rem;
    padding:.6rem;
    border:3px solid red;
    border-right:3px solid transparent; 
    border-radius:50%;   
    transform:translateZ(0);
    animation:${rotateAnim} .5s linear infinite;
`;

class Preloader extends React.Component {
    componentDidMount() {
        this.handleAuth();
    }

    handleAuth() {
        const { handleReAuth, setIsLoading } = this.props;
        const sessionData = sessionStorage.getItem('session');
        const isAuth = localStorage.getItem('isAuth');

        if (isAuth) handleReAuth();
        else {
            // <Redirect to="/login" />;
            setIsLoading(false);
        };
    }

    render() {
        const { isLoading, children } = this.props;

        return isLoading ? (
            <Main_preloader>
                <h1>ProjectT</h1>
                <Spinner />
            </Main_preloader>)
            : (children);
    }
}

const mapStateToProps = ({ global }) => ({
    isLoading: global.isLoading,
    isUserLoggedIn: global.isUserLoggedIn
});

const mapDispatchToProps = dispatch => ({
    setIsLoading: v => dispatch(actions.global.setIsLoading(v)),
    handleReAuth: () => dispatch(actions.global.handleReAuth()),
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Preloader));