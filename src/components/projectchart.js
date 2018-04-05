import React from 'react';
import { PieChart, Pie, Label, Legend } from 'recharts';

const ProjectsChart = props => {
    //if ! return loading
    const LegendFormatted = (props) =>
        (<ul>{props.payload.map((itm, i) => (<li key={i}>{itm.value}</li>))}</ul>);

    return (
        <div>
            <PieChart width={600} height={400}>
                <Pie data={[{ name: 'project1', v: 44 }, { name: 'p2', v: 22 }]}
                    innerRadius={60} outerRadius={130} fill="#3867d6" dataKey="v">
                    <Label value={props.totalWeekTime} position="center"
                        style={{ fontSize: '26px' }} />
                </Pie>
                <Legend layout="vertical" align="left" verticalAlign="middle" iconSize={8} iconType="circle" />
            </PieChart>
        </div>
    );
}
export default ProjectsChart;
