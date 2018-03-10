import React from 'react';
import styled from 'styled-components';

import Icon from './icon';

const Task_controller = styled.section`
border:2px solid #ccc;
border-width:0 0 2px 0;
display:flex;
padding:1rem;
justify-content:space-between;
align-items:center;
`;

const Task_description = styled.h2`
`;

const Task_timer = styled.span`
`;

const Task_button = styled.a`
cursor:pointer;
color:white;
background-color:green;
border-radius:50%;
`;

export default class TopBar extends React.Component {
    handleClick() {
        alert('ok');
    }

    render() {
        return (
            <Task_controller>
                < Task_description>What are you working on?</ Task_description>
                <Task_timer>0:00:00</Task_timer>
                <Task_button onClick={this.handleClick.bind(this)}>
                    <Icon name="play_arrow" />
                </Task_button>
            </Task_controller>
        );
    }
}