import React from 'react';
import styled, { keyframes } from 'styled-components';
import {
    BarChart, Bar, CartesianGrid, XAxis, YAxis, LabelList,
    Cell, Text, ResponsiveContainer, Tooltip
} from 'recharts';

import moment from 'moment';
import momentDFPlugin from 'moment-duration-format';
momentDFPlugin(moment);

const Chart_header = styled.div`
    padding:1rem;
    float:right;
`;

const Wrapper = styled.section`
    margin-top: 1rem;
    width: 100%;
    height: 350px;
    position:relative;
    > div > div {
            box-shadow: 0 1px 3px rgba(128,128,128,0.2);
            height:281px !important;
            border-bottom: 2px solid #888;
            background-color:#fff;   
        }
`;

const Overlay = styled.div`
    position:absolute;
    top:0;
    left:0;
    width:100%;
    height:100%;
    background-color:rgba(255,255,255,.6);
    transition:all .2s linear;
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

const Ttip = styled.div`
    background-color:#fff;
    border:1px solid #ddd;
    padding:.3rem .6rem;
    color:${props => props.hasValue ? '#45aaf2' : '#333'};
`;

const CustomTooltip = ({ active, payload, label }) =>
    (active ? <Ttip hasValue={payload[0].payload.duration !== '0:00'}>
        {payload[0].payload.duration}</Ttip> : null);

export default class PeriodTimeChart extends React.Component {
    shouldComponentUpdate(nextP) {
        if (nextP.isOpen && !this.props.isOpen) return false;
        return true;
    }

    componentDidUpdate(prevP, prevS) {
        const { periodType, allEntriesFetched, getYearData, data, setIsLoading, isLoading, shouldUpdate } = this.props;

        const isPeriodYears = periodType === 'years';
        const areSomeItemsEmpty = isPeriodYears ? getYearData().some(itm => !itm.time) : data.some(itm => !itm.time);

        if (shouldUpdate && isLoading && !allEntriesFetched && areSomeItemsEmpty) {
            this.props.getMoreEntries();
        }
        else if (shouldUpdate && isLoading) setIsLoading(false);
    }

    getTicks = (highestValue) => {
        const hourInMs = 3600000;
        let multi = 1;

        while (highestValue > (hourInMs * multi) * 5) { multi += 1; }

        return Array(5).fill(null).map((itm, i) => (hourInMs * multi) * (i + 1));
    }

    getCheckedData = (isPeriodNotYears, data, yearData, isPeriodCustomAndLong) => {
        console.log(data,'data');

        const checkForDataValue = itm => itm.time ? Object.assign({}, itm, { hasValue: true }) :
            Object.assign({}, itm, { hasValue: false });

        return isPeriodNotYears ? (isPeriodCustomAndLong ?
            this.getWeeksFromDays(data).map(checkForDataValue) : data.map(checkForDataValue)) :
            yearData.map(checkForDataValue);
    }

    getTotalDayCount = array => {
        console.log(array, 'arr');
        const toSeconds = array.reduce((acc, item) =>
            acc += moment.duration(Number(item.stop) - item.start).asSeconds(), 0);

        return moment.duration(toSeconds, 'seconds').format('h:mm', { stopTrim: "hh mm" });
    }

    getWeeksFromDays = data => {
        console.log(data,'data');
        const reducedData = data.reduce((acc, itm) => {
            acc[itm.week] ?
                acc[itm.week] = {
                    readable: `week ${itm.week} ${moment().isoWeek(itm.week).startOf('isoWeek').format('DD MMM')}` +
                        ` ${moment().isoWeek(itm.week).endOf('isoWeek').format('DD MMM')}`,
                    time: acc[itm.week].time + itm.time
                } :
                acc[itm.week] = {
                    readable: `week ${itm.week} ${moment().isoWeek(itm.week).startOf('isoWeek').format('DD MMM')}` +
                        ` ${moment().isoWeek(itm.week).endOf('isoWeek').format('DD MMM')}`,
                    time: itm.time
                };
            return acc;
        }, {});

        const getDuration = itm => moment.duration(itm.time).format('h:mm', { stopTrim: "hh mm" });

        const reducedToArr = Object.keys(reducedData).map(itm =>
            Object.assign({}, reducedData[itm], {
                duration: reducedData[itm].time ?
                    getDuration(reducedData[itm]) : '0:00'
            }));

        return reducedToArr;
    }

    getCustomLabel = ({ value, x, y, width, height }) => {
        if (this.props.periodType === 'years') {
            const tmpVal = value.split(':');
            value = `${tmpVal[0]}:${tmpVal[1]}`;
        }
        return (<React.Fragment>
            <rect x={x} y={y - 40} width={width} height={25} style={{ fill: 'white', stroke: '#ddd' }} />
            <text x={x + (width / 2)} y={y - 22.5} textAnchor="middle" style={{ fontSize: '13px' }}
                fill={value === '0:00' ? '#999' : "#45aaf2"} >{value}</text>
        </React.Fragment>);
    }

    getCustomTick = ({ x, y, width, height, stroke, payload }) => {
        const { periodType, customPeriodLength } = this.props;

        const isPeriodYears = periodType === 'years';
        const isPeriodCustomAndLong = periodType === 'custom' && customPeriodLength > 31;
        const todayReadable = moment().format('ddd, Do MMM');

        if (isPeriodCustomAndLong) {
            const isSameMonth = payload.value.split(' ')[3] === payload.value.split(' ')[5];

            const row1 = `${payload.value.split(' ')[0]} ${payload.value.split(' ')[1]}`;
            const row2 = isSameMonth ?
                `${payload.value.split(' ')[2]} - ${payload.value.split(' ')[4]} ${payload.value.split(' ')[3]}` :
                `${payload.value.split(' ')[2]} ${payload.value.split(' ')[3]}`;
            const row3 = !isSameMonth ? `${payload.value.split(' ')[4]} ${payload.value.split(' ')[5]}` : null;

            return (<g>
                <text x={x} y={y + 15} textAnchor="middle"
                    style={{ fontSize: '13px', fontWeight: payload.value === todayReadable ? 700 : 400 }}> {row1}
                </text>
                <text style={{ fontSize: '13px', fontWeight: payload.value === todayReadable ? 700 : 400 }}
                    x={x} y={y + 35} textAnchor="middle">{row2}</text>
                {!isSameMonth && <text style={{ fontSize: '13px', fontWeight: payload.value === todayReadable ? 700 : 400 }}
                    x={x} y={y + 55} textAnchor="middle">{row3}</text>}
            </g>);
        }

        return (<g>
            <text x={x} y={y + 15} textAnchor="middle"
                style={{ fontSize: isPeriodYears ? '12px' : '13px', fontWeight: payload.value === todayReadable ? 700 : 400 }}>
                {payload.value.split(',')[0]}  </text>
            <text style={{ fontSize: '13px', fontWeight: payload.value === todayReadable ? 700 : 400 }}
                x={x} y={y + 35} textAnchor="middle">{payload.value.split(',')[1]}</text>
        </g>);
    }

    render() {
        const { data, getYearData, periodType, customPeriodLength, isLoading, allEntriesFetched } = this.props;
        let yearData;
        if (periodType === 'years') yearData = getYearData();
        //if ! return loading
        const isPeriodYears = periodType === 'years';
        const isPeriodMonths = periodType === 'months';
        const isPeriodCustom = periodType === 'custom';
        const isPeriodCustomAndLong = isPeriodCustom && customPeriodLength > 31;
        const isPeriodTypeShort = ['months', 'years'].indexOf(periodType) === -1;

        const checkedData = this.getCheckedData(!isPeriodYears, data, yearData, isPeriodCustomAndLong);

        const highestValue = checkedData.concat().sort((a, b) => b.time - a.time)[0].time;

        const shouldShowLabelList = () => isPeriodCustomAndLong || isPeriodYears ||
            (isPeriodTypeShort && !isPeriodCustom) || (isPeriodCustom && customPeriodLength < 16);

        const xAxisInterval = length => length > 7 ? (isPeriodYears ? 1 : (length > 14 ? 4 : (length % 7) + 1)) : 0;

        const formattedYticks = v => moment.duration(v).format("h[h]m[m]:s[s]", { largest: 1 });

        return (<Wrapper>
            <Overlay visible={isLoading || !isLoading && !highestValue || !highestValue}>
                {isLoading ? (<Spinner />) : (highestValue ? '' : 'No data available')}
            </Overlay>
            <ResponsiveContainer >
                <BarChart data={isPeriodYears ? yearData : isPeriodCustomAndLong ? this.getWeeksFromDays(data) : data}
                    barCategoryGap={5} margin={{ top: 30, right: 30, left: 50, bottom: 10 }} >
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis interval={xAxisInterval(checkedData.length)} tickLine={false} dataKey="readable" height={60}
                        tick={this.getCustomTick} />
                    {!shouldShowLabelList() && <Tooltip cursor={false} isAnimationActive={false} content={<CustomTooltip />} />}
                    <Bar dataKey="time" data={checkedData} isAnimationActive={false} maxBarSize={100} minPointSize={4}>
                        {shouldShowLabelList() && <LabelList dataKey="duration" position="top" content={this.getCustomLabel} />}
                        {checkedData.map((itm, i) => <Cell fill={itm.hasValue ? "#45aaf2" : '#999'} key={`${i}-${itm.time}`} />)}
                    </Bar>
                    <YAxis stroke="#ccc" orientation="right" axisLine={false} mirror={false} tickLine={false} width={30}
                        interval={0} ticks={this.getTicks(highestValue)} tickFormatter={formattedYticks} />
                </BarChart>
            </ResponsiveContainer>
        </Wrapper>);
    }
}