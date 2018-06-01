import React from 'react';

import styled, { keyframes } from 'styled-components';
import moment from 'moment';
import momentDFPlugin from 'moment-duration-format';
momentDFPlugin(moment);

import { PieChart, Pie, Label, Legend, ResponsiveContainer, Cell } from 'recharts';

const Color_Indicator = styled.span`
    display:inline-block;
    width:.6rem;
    height:.6rem;
    background-color:${props => props.color};
    border-radius:50%;
    margin-right:.5rem;
`;

const List_item = styled.li`
    width:15rem;
    display:flex;
    justify-content:space-between;
    padding:.5rem;
    background-color:${props => props.value === props.state ? '#efeb97' : '#fff'};
`;

const Wrapper = styled.section`
    width: 100%;
    height: 300px;
    background-color:#fff;
    margin-top:2rem;
    margin-bottom:4rem;
    box-shadow: 0 1px 3px rgba(128,128,128,0.2);
    position:relative;
`;

const Overlay = styled.div`
    position:absolute;
    top:0;
    left:0;
    width:100%;
    height:100%;
    background-color:rgba(255,255,255,.6);
    transition:all .4s linear;
    z-index:50;    
    display:flex;
    justify-content:center;
    align-items:center;
    font-weight:700;
    color:#bbb;
    font-size:18px;
    opacity: ${props => props.visible ? 1 : 0};
    pointer-events:none;
`;

const rotateAnim = keyframes`
    from{
        transform:rotate(0deg);
    }
    to{
        transform:rotate(360deg);
    }
`;

const Spinner = styled.span`
    width:50px;
    height:50px;
    border:3px solid #ddd;
    border-right:3px solid transparent; 
    border-radius:50%;   
    transform:translateZ(0);
    animation:${rotateAnim} .5s linear infinite;
`;

class ProjectsChart extends React.Component {
    constructor() {
        super();

        this.state = {
            hoveredItem: null,
            activeIdx: -1
        }
    }

    shouldComponentUpdate(nextP) {
        if (nextP.isOpen && !this.props.isOpen) return false;
        return true;
    }

    getProjectsLengthSum = projectStr => {
        const { periodStart, periodStop, userData } = this.props;

        const condition = itm => projectStr === undefined ?
            (itm.project === projectStr || itm.project === '') :
            itm.project === projectStr;

        const filterCondition = itm => itm.stop !== undefined && condition(itm) &&
            itm.start >= periodStart.valueOf() && itm.stop <= moment(periodStop).valueOf();

        const total = userData.entries
            .reduce((acc, item) => {
                return filterCondition(item) ?
                    acc + moment.duration(moment(Number(item.stop)).diff(item.start)).valueOf() :
                    acc;
            }, 0);

        return total;
    }

    getProjectTime = projectStr => {
        const total = this.getProjectsLengthSum(projectStr);

        return moment.duration(total).format('h:mm:ss', { stopTrim: "hh mm ss" });
    }

    customLegend = ({ payload }) => {
        return (<ul>
            {payload.filter(itm => itm.value !== 'Without Project' && itm.payload.v)
                .map((itm, i) =>
                    <List_item state={this.state.hoveredItem} value={itm.value}
                        key={`${i}-${itm.value}`}>
                        <span>
                            <Color_Indicator color={itm.color} />{itm.value}
                        </span>
                        <span>
                            {this.getProjectTime(itm.value)}
                        </span>
                    </List_item>)}
            {/* add rest of entries */}
            {!!this.getProjectsLengthSum(undefined) ?
                (<List_item
                    value={`Without Project`} state={this.state.hoveredItem}
                    key={`Without Project`}>
                    <span>
                        <Color_Indicator color={'#bbb'} />{'Without Project'}
                    </span>
                    <span>
                        {this.getProjectTime(undefined)}
                    </span>
                </List_item>) : null}
        </ul>);
    }

    render() {
        const { hoveredItem, activeIdx } = this.state;
        const { userData, totalWeekTime, isLoading } = this.props;

        const LegendFormatted = (props) =>
            (<ul>{props.payload.map((itm, i) => (<li key={i}>{itm.value}</li>))}</ul>);

        const data = userData.projects.map(itm =>
            Object.assign({}, itm, { v: this.getProjectsLengthSum(itm.name), fill: `#${itm.color}` }));

        data.push({ name: 'Without Project', fill: '#bbb', v: this.getProjectsLengthSum(undefined) });

        const handleMouseEnter = (payload, idx) => this.setState({ hoveredItem: payload.name, activeIdx: idx });
        const handleMouseLeave = (payload) => this.setState({ hoveredItem: null });

        const labelValue = hoveredItem ? (hoveredItem === 'Without Project' ? this.getProjectTime(undefined) :
            this.getProjectTime(hoveredItem)) : totalWeekTime(userData.entries);

        const periodContainsData = data.some(itm => !!itm.v);

        return (
            <Wrapper>
                <Overlay visible={isLoading || !periodContainsData}>
                    {isLoading ? (<Spinner />) : (periodContainsData ? '' : 'No data available')}
                </Overlay>
                <ResponsiveContainer >
                    <PieChart width={700} height={300}>
                        <Pie isAnimationActive={false} data={data} innerRadius={70}
                            outerRadius={140} dataKey="v" onMouseEnter={handleMouseEnter}
                            onMouseLeave={handleMouseLeave} activeIndex={activeIdx} >
                            {data.map((itm, idx) => (<Cell key={`cell-${idx}`}
                                style={{ opacity: hoveredItem === itm.name ? '.7' : '1' }} />))}
                            <Label value={labelValue} position="center" style={{ fontSize: '26px' }} />
                        </Pie>
                        <Legend content={this.customLegend} layout="vertical" align="left"
                            verticalAlign="middle" iconSize={8} iconType="circle" />
                    </PieChart>
                </ResponsiveContainer>
            </Wrapper>
        );
    }
}

export default ProjectsChart;