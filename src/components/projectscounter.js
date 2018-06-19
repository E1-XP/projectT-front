import React from 'react';
import styled from 'styled-components';

import moment from 'moment';
import momentDFPlugin from 'moment-duration-format';
momentDFPlugin(moment);

const Wrapper = styled.section`
    margin-top:.5rem;
    width:25%;
    min-width:205px;
    @media only screen and (max-width:900px) {
        display:none;
    }
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

const ProjectsCounter = ({ projects, entries }) => {

    const projectsLengthSum = projectStr => entries
        .reduce((acc, itm) => {
            return (itm.stop !== undefined && itm.project === projectStr) ?
                acc += itm.stop - itm.start :
                acc;
        }, 0);

    const getReadableSum = total => moment.duration(total).format('h:mm:ss', { stopTrim: "hh mm ss" });

    const projectTimes = projects.reduce((acc, itm) => {
        acc[itm.name] = projectsLengthSum(itm.name);
        return acc;
    }, {});

    return (<Wrapper>
        <Heading>Most Tracked</Heading>
        <List>
            {projects.length ? projects
                .map(itm => ({ ...itm, total: projectTimes[itm.name] }))
                .sort((a, b) => b.total - a.total)
                .map((itm, i) =>
                    (<List_item key={itm.name}>
                        <span>
                            <Color_Indicator color={itm.color} />{itm.name}
                        </span>
                        <span>{getReadableSum(itm.total)}</span>
                    </List_item>)) :
                <List_item>No projects</List_item>}
        </List>
    </Wrapper>);
}

export default ProjectsCounter;