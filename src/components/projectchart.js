import React from 'react';

import styled from 'styled-components';
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
`;

class ProjectsChart extends React.Component {
    constructor() {
        super();

        this.state = {
            hoveredItem: null,
            activeIdx: -1
        }
    }

    projectsLengthSum = projectStr => {
        const { periodStart, periodStop, userData } = this.props;

        const condition = itm => projectStr === undefined ?
            (itm.project === projectStr || itm.project === '') :
            itm.project === projectStr;

        const filterCondition = itm => itm.stop !== undefined && condition(itm) &&
            itm.start > periodStart.valueOf() && itm.stop < moment(periodStop).valueOf();

        const total = userData.entries
            .reduce((acc, item) => {
                return filterCondition(item) ?
                    acc + moment.duration(moment(Number(item.stop)).diff(item.start)).valueOf() :
                    acc;
            }, 0);

        return total;
    }

    getProjectTime = projectStr => {
        const total = this.projectsLengthSum(projectStr);

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
            {!!this.projectsLengthSum(undefined) ?
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
        const { userData, totalWeekTime } = this.props;
        //if ! return loading

        const LegendFormatted = (props) =>
            (<ul>{props.payload.map((itm, i) => (<li key={i}>{itm.value}</li>))}</ul>);

        const data = userData.projects.map(itm =>
            Object.assign({}, itm, { v: this.projectsLengthSum(itm.name), fill: `#${itm.color}` }));

        data.push({ name: 'Without Project', fill: '#bbb', v: this.projectsLengthSum(undefined) });

        const handleMouseEnter = (payload, idx) => this.setState({ hoveredItem: payload.name, activeIdx: idx });
        const handleMouseLeave = (payload) => this.setState({ hoveredItem: null });

        const labelValue = hoveredItem ? (hoveredItem === 'Without Project' ? this.getProjectTime(undefined) :
            this.getProjectTime(hoveredItem)) : totalWeekTime(userData.entries);

        return (
            <Wrapper>
                <ResponsiveContainer >
                    <PieChart width={700} height={300}>
                        <Pie isAnimationActive={false} data={data} innerRadius={65}
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