import React from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';

import Tooltip from 'rc-tooltip';

import moment from 'moment';
import momentDFPlugin from 'moment-duration-format';
momentDFPlugin(moment);

import getWeekProjectsSum from '../selectors/getWeekProjectsSum';

const Week_counter = styled.div`
    text-transform:uppercase;
    font-size:13px;
    margin-top:61px;
    padding:1.8rem;
    color:#777;
    font-weight:500;
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
    > span {
        color:${props => props.color};
        position:relative;
        display:inline-block;
        bottom:1.2rem;
        width:100%;     
    }
`;

const Bar_text = styled.span`
    font-weight:500;
    white-space:nowrap;
    overflow: hidden;
    text-overflow:ellipsis;
`;

const Timer = styled.span`
    color:black;
`;

const TooltipContainer = styled.div`
    display:flex;
    justify-content:space-between;
`;

const overlayStyle = { fontSize: '14px', padding: '.5rem' };

const WeekTime = connect(({ timer }) => ({ weekTimer: timer.weekTimer }))(({ weekTimer }) => weekTimer);

class WeekTimer extends React.Component {
    shouldComponentUpdate(nextProps) {
        if (this.props.isRunning && !nextProps.isRunning) return false;
        return true;
    }

    showInfoOnHover = (itm, total) => {
        const { weekProjectsSum } = this.props;
        const percent = `${~~((weekProjectsSum[itm] / total) * 100)}%`;
        const readable = moment.duration(weekProjectsSum[itm]).format('h:mm:ss', { stopTrim: "hh mm ss" });

        return (<TooltipContainer>
            <span>{itm === 'noproject' ? '(No Project)' : itm}</span><span>{readable}</span><span>{percent}</span>
        </TooltipContainer>);
    }

    getBarParts = () => {
        const { weekProjectsSum, getProjectColor } = this.props;
        const isDataAvailable = Object.keys(weekProjectsSum).length > 1 || weekProjectsSum['noproject'] !== 0;

        const dataSrc = isDataAvailable ? weekProjectsSum : { ['No data available']: 1 };
        const totalSum = isDataAvailable ? Object.keys(weekProjectsSum).reduce((acc, itm) => acc + weekProjectsSum[itm], 0) : 1;

        return Object.keys(dataSrc)
            .sort((a, b) => dataSrc[a] - dataSrc[b])
            .map(itm => {
                const width = (dataSrc[itm] / totalSum) * 100;

                return (<Tooltip key={itm} overlay={this.showInfoOnHover(itm, totalSum)} placement="top"
                    overlayStyle={overlayStyle} mouseLeaveDelay={.2}>
                    <WeekBarPart key={itm} width={width} name={itm} color={itm === 'No data available' ? '#bbb' : getProjectColor(itm)}>
                        {width > 3 && <Bar_text width={width}>
                            {itm === 'noproject' ? '(NO PROJECT)' : itm.toUpperCase()}</Bar_text>}
                    </WeekBarPart>
                </Tooltip>)
            });
    }

    render() {


        return (<Week_counter>
            This week: <Timer><WeekTime /></Timer>
            <WeekBar>
                {this.getBarParts()}
            </WeekBar>
        </Week_counter>);
    }
}

const mapStateToProps = ({ user }) => ({
    projects: user.projects,
    weekProjectsSum: getWeekProjectsSum(user)
});

export default connect(mapStateToProps, null)(WeekTimer);