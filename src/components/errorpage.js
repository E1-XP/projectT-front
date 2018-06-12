import React from 'react';
import styled from 'styled-components';

const Container = styled.div`
    width:80%;
    max-width:1200px;
    display:flex;
    padding-top:5rem;
    justify-content:center;
    margin:0 auto;
`;

const ErrorPage = pops => {
    return (
        <Container>
            <h2>The page you requested cannot be displayed.
             We are working to bring it back online as soon as possible.</h2>
        </Container> 
    );
}

export default ErrorPage;