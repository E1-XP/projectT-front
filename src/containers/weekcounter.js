import React from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';

import moment from 'moment';
import momentDFPlugin from 'moment-duration-format';
momentDFPlugin(moment);

import getWeekProjectsSum from '../selectors/getweekprojectssum';

const Week_counter = styled.div`
    text-transform:uppercase;
    font-size:13px;
    margin-top:61px;
    padding:1.8rem;
`;

const WeekBar = styled.div`
    background-color:#bbb;
    width:100%;
    height:3px;
    border-radius:1.5px;
    margin-top:3rem; 
`;

const WeekBarPart = styled.div`
    background-color:${props => props.color};
    width:${props => props.width + '%'};
    height:100%;
    float:left;
    /* &:after{
        content:${props => props.name};
        display: block;
        height: 15px;
        width: 50px;
        background-color:red;
        border:1px solid black;
        position:absolute;
        top:0;
        left:0;
    } */
`;

class WeekTimer extends React.Component {
    shouldComponentUpdate(nextProps) {
        if (this.props.isRunning && !nextProps.isRunning) return false;
        return true;
    }

    getBarParts = () => {
        const { weekProjectsSum, getProjectColor } = this.props;

        if (Object.keys(weekProjectsSum).length <= 1) return null;

        const totalSum = Object.keys(weekProjectsSum).reduce((acc, itm) => acc + weekProjectsSum[itm], 0);

        return Object.keys(weekProjectsSum).map(itm => (<WeekBarPart key={itm} width={(weekProjectsSum[itm] / totalSum) * 100}
            name={itm} color={getProjectColor(itm)} />));
    }

    render() {
        const { weekTimer } = this.props;

        return (
            <Week_counter>
                This week: <span>{weekTimer}</span>
                <WeekBar>
                    {this.getBarParts()}
                </WeekBar>
            </Week_counter>
        );
    }
}

const mapStateToProps = ({ timer, user }) => ({
    weekTimer: timer.weekTimer,
    projects: user.userData.projects,
    weekProjectsSum: getWeekProjectsSum(user.userData)
});

export default connect(mapStateToProps, null)(WeekTimer);