import React from 'react';
import styled from 'styled-components';

import moment from 'moment';
import momentDFPlugin from 'moment-duration-format';
momentDFPlugin(moment);

const Wrapper = styled.section`
    margin-top:.5rem;
    width:25%;
    min-width:205px;
`;

const Heading = styled.h3`
    color:#aaa;
    font-weight:500;
`;

const List = styled.ul`
    margin-top:1.7rem;
    padding:.5rem;
    box-shadow: 0 1px 4px rgba(128,128,128,0.4);
    background-color:white;
`;

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
    padding: 0.1rem;
    font-size: 14px;
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
        <Wrapper>
            <Heading>Most Tracked</Heading>
            <List>
                {userData.projects.length ?
                    userData.projects.map((itm, i) =>
                        (<List_item key={itm.name}>
                            <span>
                                <Color_Indicator color={itm.color} />{itm.name}
                            </span>
                            <span>{getProjectTime(itm.name)}</span>
                        </List_item>)) :
                    <li>No projects</li>}
            </List>
        </Wrapper>
    );
}

export default ProjectsCounter;