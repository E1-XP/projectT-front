import React from 'react';
import { BarChart, Bar, CartesianGrid, XAxis, YAxis, LabelList, Cell, Text } from 'recharts';

const WeekTimeChart = props => {
    const { data } = props;

    //if ! return loading

    const setPlaceholderBar = data.map(itm => itm.time ? itm : Object.assign({}, itm, itm.time = 2000));

    const CustomLabel = ({ value, x, y, width, height }) => (<text x={x + (width / 4)} y={y - 10}
        fill={value === '0:00' ? '#999' : "#45aaf2"} >{value}</text>);

    const CustomTick = ({ x, y, width, height, stroke, payload }) =>
        (<g>
            <text x={x} y={y + 15} textAnchor="middle">{payload.value.split(',')[0]}</text>
            <text style={{ fontSize: '14px' }} x={x} y={y + 35} textAnchor="middle">{payload.value.split(',')[1]}</text>
        </g>);

    return (
        <section style={{ border: '1px solid red', marginTop: '2rem' }}>
            <BarChart width={600} height={300} data={data} margin={{ top: 20, right: 30, left: 20, bottom: 10 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis interval={0} tickLine={false} dataKey="readable" height={60} tick={CustomTick} />
                <Bar dataKey="time" data={setPlaceholderBar} isAnimationActive={false}>
                    <LabelList dataKey="duration" position="top" content={CustomLabel} />
                    {data.map((itm, i) => <Cell fill={itm.duration === '0:00' ? '#999' : "#45aaf2"} key={i} />)}
                </Bar>
                <YAxis stroke="#999" orientation="right" axisLine={false} mirror={false} tickLine={false} />
            </BarChart>
        </section >
    );
}

export default WeekTimeChart;
