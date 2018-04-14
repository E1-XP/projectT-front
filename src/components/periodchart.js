import React from 'react';
import styled from 'styled-components';
import {
    BarChart, Bar, CartesianGrid, XAxis, YAxis, LabelList,
    Cell, Text, ResponsiveContainer
} from 'recharts';

import moment from 'moment';
import momentDFPlugin from 'moment-duration-format';
momentDFPlugin(moment);

const Chart_header = styled.div`
    padding:1rem;
    float:right;
`;

class PeriodTimeChart extends React.Component {
    getTicks = (highestValue, hourInMs) => {
        let multi = 1;
        while (highestValue > (hourInMs * multi) * 5) { multi += 1; }

        return Array(5).fill(null).map((itm, i) => (hourInMs * multi) * (i + 1));
    }

    getDataWithPlaceholder = (isPeriodNotYears, data, yearData, placeholderHeight) => isPeriodNotYears ?
        data.map(itm => itm.time ?
            Object.assign(itm, { time: itm.time < placeholderHeight ? placeholderHeight : itm.time, hasValue: true }) :
            Object.assign(itm, { time: placeholderHeight, hasValue: false })) :
        yearData().map(itm => itm.time ?
            Object.assign(itm, { time: itm.time < placeholderHeight ? placeholderHeight : itm.time, hasValue: true }) :
            Object.assign(itm, { time: placeholderHeight, hasValue: false }));

    render() {
        const { data, yearData, periodType } = this.props;
        //console.log('DATA', data, yearData());
        //if ! return loading
        const isPeriodYears = periodType === 'years';
        const isPeriodMonths = periodType === 'months';
        //const isPeriodWeeks = periodType === 'weeks';
        const isPeriodTypeShort = ['months', 'years'].indexOf(periodType) === -1;

        const hourInMs = 3600000;
        const highestValue = isPeriodYears ?
            yearData().concat().sort((a, b) => b.time - a.time)[0].time :
            data.concat().sort((a, b) => b.time - a.time)[0].time;

        const todayReadable = moment().format('ddd, Do MMM');
        const placeholderHeight = highestValue * 0.05;//highestValue < 200000 ? 200000 : highestValue * 0.05;
        //console.log(highestValue, 'WH')
        const dataWithPlaceholder = this.getDataWithPlaceholder(!isPeriodYears, data, yearData, placeholderHeight);

        const XAxisInterval = isPeriodYears ? 1 : (isPeriodMonths ? 3 : 0);

        const formattedYticks = v => moment.duration(v).format("h[h]m[m]:s[s]", { largest: 1 });

        const getCustomTick = ({ x, y, width, height, stroke, payload }) =>
            (<g>
                <text x={x} y={y + 15} textAnchor="middle"
                    style={{ fontSize: isPeriodYears ? '12px' : '14px', fontWeight: payload.value === todayReadable ? 700 : 400 }}>
                    {payload.value.split(',')[0]}  </text>
                <text style={{ fontSize: '14px', fontWeight: payload.value === todayReadable ? 700 : 400 }}
                    x={x} y={y + 35} textAnchor="middle">{payload.value.split(',')[1]}</text>
            </g>);

        const CustomLabel = ({ value, x, y, width, height }) => (<text x={x + (width / 4)} y={y - 10}
            fill={value === '0:00' ? '#999' : "#45aaf2"} >{value}</text>);

        return (
            <section style={{ border: '1px solid red', marginTop: '2rem', width: '100%', height: '350px' }}>
                <ResponsiveContainer>
                    <BarChart data={isPeriodYears ? yearData() : data} margin={{ top: 20, right: 30, left: 20, bottom: 10 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis interval={XAxisInterval} tickLine={false} dataKey="readable" height={60} tick={getCustomTick} />
                        <Bar dataKey="time" data={dataWithPlaceholder} isAnimationActive={false} maxBarSize={80}>
                            {isPeriodTypeShort && <LabelList dataKey="duration" position="top" content={CustomLabel} />}
                            {dataWithPlaceholder.map((itm, i) => <Cell fill={itm.hasValue ? "#45aaf2" : '#999'} key={`${i}-${itm.time}`} />)}
                        </Bar>
                        <YAxis stroke="#999" orientation="right" axisLine={false} mirror={false} tickLine={false}
                     /*this *should* do the trick*/ interval={0} ticks={this.getTicks(highestValue, hourInMs)} tickFormatter={formattedYticks} />
                    </BarChart>
                </ResponsiveContainer>
            </section>
        );
    }
}

export default PeriodTimeChart;
