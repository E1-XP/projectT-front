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
    position:fixed;
    background-color:#fff;
    width:95%;
@media only screen and (min-width:1200px){
    width:91%;
}
`;

const Task_timing = styled.div`
    min-width:15rem;
    display:flex;
    justify-content:space-between;
    align-items:center;
`;

const Task_description = styled.input`
`;

const Task_timer = styled.span`
`;

const Task_button = styled.a`
    cursor:pointer;
    color:white;
    background-color:${props => props.isRunning ? 'red' : 'green'};
    border-radius:50%;
`;

export default class TopBar extends React.Component {
    componentWillUnmount() {
        //if (this.props.state.running) this.props.stopTimer();
    }

    render() {
        const { isRunning, timer } = this.props;

        return (
            <Task_controller>
                <Task_description placeholder={isRunning ? 'Add description' : 'What are you working on?'}></ Task_description>
                <Task_timing>
                    <span>no project</span>
                    <Task_timer>{timer}</Task_timer>
                    <Task_button isRunning={isRunning} onClick={() => this.props.handleClick()}>
                        <Icon name={isRunning ? "stop" : "play_arrow"} />
                    </Task_button>
                </Task_timing>

            </Task_controller>
        );
    }
}