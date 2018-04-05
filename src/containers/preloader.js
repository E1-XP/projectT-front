import React from 'react';
import { connect } from 'react-redux';
import * as actions from '../actions';
import { withRouter } from 'react-router-dom';
import styled from 'styled-components';

const Main_preloader = styled.div`
    background-color:#333;
    color:white;
    width:100%;
    display:flex;
    justify-content:center;
    align-items:center;
`;

class Preloader extends React.Component {
    componentDidMount() {
        this.handleAuth();
    }

    handleAuth() {
        const { fetchAuthentication, setIsLoading } = this.props;
        const sessionData = sessionStorage.getItem('session');
        const isAuth = localStorage.getItem('isAuth');

        if (isAuth) fetchAuthentication();
        else {
            // <Redirect to="/login" />;
            setIsLoading(false);
        };
    }

    render() {
        const { isLoading } = this.props;

        if (isLoading) return (<Main_preloader><p>Loading...</p></Main_preloader>);
        else return (this.props.children);
    }
}

const mapStateToProps = ({ isLoading, isUserLoggedIn }) => ({
    isLoading,
    isUserLoggedIn
});

const mapDispatchToProps = dispatch => ({
    setIsLoading: v => dispatch(actions.setIsLoading(v)),
    fetchAuthentication: () => dispatch(actions.fetchAuthentication()),
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Preloader));