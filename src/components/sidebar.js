import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

import Icon from './icon';

const Sidebar = styled.section`
color:white;
background-color:#333;
max-width:52px;
padding:1rem;
order:-1;
display:flex;
flex-direction:column;
align-items:center;

@media only screen and (min-width:1200px){
max-width:250px;
}
`;

const Sidebar_header = styled.header`
`;

const Sidebar_navigation = styled.nav`
margin-top:1rem;
`;

const Sidebar_profile = styled.section`
margin-top:auto;
`;

const Navigation_list = styled.ul`
`;

const Navigation_item = styled.li`
margin:.5rem;
`;

const Navigation_link = styled(Link) `
display:flex;
align-items: center;
`;

const Link_label = styled.span`
display:none;
@media only screen and (min-width:1200px){
display:block;
margin-left:1rem;
}`;

export default class SideBar extends React.Component {
    render() {
        return (
            <Sidebar>
                <Sidebar_header>
                    <Navigation_link to="/timer">
                        <h1>S</h1>
                    </Navigation_link>
                </Sidebar_header>
                <Sidebar_navigation>
                    <Navigation_list>
                        <Navigation_item>
                            <Navigation_link to="/timer">
                                <Icon name="access_time" />
                                <Link_label>Timer</Link_label>
                            </Navigation_link>
                        </Navigation_item>
                        <Navigation_item>
                            <Navigation_link to="/dashboard">
                                <Icon name="insert_chart" />
                                <Link_label>Dashboard</Link_label>
                            </Navigation_link>
                        </Navigation_item>
                    </Navigation_list>
                </Sidebar_navigation>
                <Sidebar_profile>
                    <Navigation_link to="/profile">
                        P
                    </Navigation_link>
                </Sidebar_profile>
            </Sidebar>
        );
    }
}