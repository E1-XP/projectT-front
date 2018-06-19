import React from 'react';
import { connect } from 'react-redux';
import { withRouter, NavLink, Link } from 'react-router-dom';
import styled from 'styled-components';

import * as actions from '../actions';

import ProfileDropdown from '../components/profiledropdown';
import Icon from '../components//icon';

const Sidebar = styled.section`
    color:white;
    background-color:rgb(50, 50, 50);
    max-width:52px;
    padding:1rem;
    order:-1;
    display:flex;
    flex-direction:column;
    align-items:center;
    position:fixed;
    height:100%;
    z-index:150;
    transform:translateZ(0);
    @media only screen and (min-width:1024px){
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

const Navigation_link = styled(NavLink)`
    color:#ddd;
    display:flex;
    align-items: center;
    justify-content: center;
    padding: 0.3rem;
    border-radius: 7px;
    position:relative;
    @media only screen and (min-width:1024px){
         justify-content:initial;
}
&:hover{
    color:white;
}
`;

const Navigation_item = styled.li`
    margin:.1rem;
&:first-of-type ${Navigation_link}  {
    border-style:solid;
    border-width:1px;
    border-color:${props => props.isFetching ? '#e20505' : 'rgb(50, 50, 50)'};
}
`;

const Header_link = styled(Link)`
    color:#ddd;
    display:flex;
    align-items: center;
    &:hover {
        color:white;
}
`;

const Link_label = styled.span`
    display:none;
    @media only screen and (min-width:1024px){
        display:block;
        margin-left:1rem;
        &:first-of-type{
            margin:0;
        }
}`;

class SideBar extends React.Component {
    shouldComponentUpdate(nextP, nextS) {
        const { userData, isRunning, location, isFetching } = this.props;

        const should = nextP.isRunning || (isRunning && !nextP.isRunning) || location.pathname !== nextP.location.pathname ||
            nextP.isFetching !== isFetching || userData.avatar !== nextP.userData.avatar ||
            userData.username !== nextP.userData.username;

        return should ? true : false;
    }

    render() {
        const { handleLogout, userData, isRunning, timer, shouldShowTimerOnTitle, isFetching, location } = this.props;
        const route = location.pathname.toLowerCase();

        return (
            <Sidebar>
                <Sidebar_header>
                    <Header_link to="/timer">
                        <Link_label>Project</Link_label> <h1>T</h1>
                    </Header_link>
                </Sidebar_header>
                <Sidebar_navigation>
                    <Navigation_list>
                        <Navigation_item isFetching={route === '/timer' && isFetching}>
                            <Navigation_link to="/timer">
                                <Icon name="access_time" />
                                <Link_label>{isRunning && shouldShowTimerOnTitle ? timer : 'Timer'}</Link_label>
                            </Navigation_link>
                        </Navigation_item>
                        <Navigation_item>
                            <Navigation_link to="/dashboard" activeClassName="active" >
                                <Icon name="bar_chart" />
                                <Link_label>Dashboard</Link_label>
                            </Navigation_link>
                        </Navigation_item>
                        <Navigation_item>
                            <Navigation_link to="/projects" activeClassName="active">
                                <Icon name="folder" />
                                <Link_label>Projects</Link_label>
                            </Navigation_link>
                        </Navigation_item>
                    </Navigation_list>
                </Sidebar_navigation>
                <Sidebar_profile>
                    <ProfileDropdown userData={userData} handleLogout={handleLogout} />
                </Sidebar_profile>
            </Sidebar>
        );
    }
}

const mapStateToProps = ({ user, timer, global }) => ({
    userData: user.userData,
    timer: timer.timer,
    isRunning: global.isRunning,
    isFetching: global.isFetching,
    shouldShowTimerOnTitle: user.settings.shouldShowTimerOnTitle

});

const mapDispatchToProps = dispatch => ({
    handleLogout: () => dispatch(actions.global.handleLogout())
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(SideBar));