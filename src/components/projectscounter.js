import React from 'react';
import styled from 'styled-components';

import moment from 'moment';
import momentDFPlugin from 'moment-duration-format';
momentDFPlugin(moment);

const Color_Indicator = styled.span`
    display:inline-block;
    width:.3rem;
    height:.3rem;
    background-color:${props => '#' + props.color};
    border-radius:50%;
    margin-right:.5rem;
`;

const List_item = styled.li`
    display:flex;
    justify-content:space-between;
`;

const ProjectsCounter = ({ userData }) => {

    const projectsLengthSum = (projectStr) => {
        const now = moment();
        const total = userData.entries
            .filter(item => item.stop !== undefined)
            .filter(itm => itm.project === projectStr)
            // .filter(item => now.diff(item.start, 'days') < 7)
            .reduce((acc, item) =>
                acc + moment.duration(moment(Number(item.stop)).diff(item.start)).valueOf(), 0);

        return total;// moment(total);//.format('h:mm:ss', { stopTrim: "hh mm ss" });
    };

    const getProjectTime = projectStr => {
        const total = projectsLengthSum(projectStr);
        return moment.duration(total).format('h:mm:ss', { stopTrim: "hh mm ss" });
    };

    return (
        <section style={{ border: '1px solid red' }}>
            <h2>Most Tracked</h2>
            <ul>
                {userData.projects.length ?
                    userData.projects.map((itm, i) =>
                        (<List_item key={itm.name}>
                            <span>
                                <Color_Indicator color={itm.color} />{itm.name}
                            </span>
                            <span>{getProjectTime(itm.name)}</span>
                        </List_item>)) :
                    <li>No projects</li>}
            </ul>
        </section>
    );
}

export default ProjectsCounter;