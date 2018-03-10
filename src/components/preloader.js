import React from 'react';
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
    render() {
        const { isLoading } = this.props;
        if (isLoading) return (<Main_preloader><p>Loading...</p></Main_preloader>);
        else return (this.props.children);
    }
}

export default Preloader;