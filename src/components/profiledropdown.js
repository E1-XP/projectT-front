import React from 'react';
import { withRouter } from 'react-router-dom';
import styled from 'styled-components';

const Dropdown = styled.ul`
    position:absolute;

    border:1px solid #ccc;
    right: -3px;
    width: 10rem;
    background-color:white;
    z-index:100;
    top: -90px;
    left: 43px;
    border-radius:7px;
`;

const Dropdown_item = styled.li`
    color:black;
    padding:.6rem;
    text-align:left;
    &:hover{
        background-color:#ddd;
    }
`;

const Screen_blocker = styled.div`
     display: block;
        position:fixed;
        top:0;
        left:0;
        background-color:transparent;
        width:100%;
        height:100%;
`;

const Dropdown_item_border = styled(Dropdown_item) `
    border-top:1px solid #ddd;
`;

const Dropdown_item_noclick = styled(Dropdown_item) `
    cursor:default;
    &:hover{
        background-color:#fff;
    }
`;

const IconProfile = styled.span`
    display:flex;
    background-color:red;
    width:2rem;
    height:2rem;
    border-radius:50%;
    justify-content:center; 
    align-items:center;
`;

const Profile_link = styled.a`
    cursor:pointer;
    position:relative;
    color:#ddd;
    display:flex;
    align-items: center;
    justify-content: center;
    padding: 0.3rem;
    border-radius: 7px;
    @media only screen and (min-width:1200px){
         justify-content:initial;
}
`;

class ProfileDropdown extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            isOpen: false
        }
    }

    openMenu = () => {
        this.setState({ isOpen: true }, () => document.addEventListener('click', this.closeMenu));
    }

    closeMenu = e => {
        this.setState({ isOpen: false }, () => document.removeEventListener('click', this.closeMenu));
    }

    goToProfile = () => {
        this.props.history.push('/profile');
    }

    render() {
        const { isOpen } = this.state;
        const { handleLogout, username } = this.props;

        return (
            <React.Fragment>
                <Profile_link onClick={this.openMenu}>
                    <IconProfile>P</IconProfile>
                    {isOpen && <Dropdown>
                        <Dropdown_item_noclick>
                            {username}
                        </Dropdown_item_noclick>
                        <Dropdown_item onClick={this.goToProfile}>
                            Profile settings
                    </Dropdown_item>
                        <Dropdown_item_border onClick={handleLogout}>
                            Log out
                    </Dropdown_item_border>
                    </Dropdown>}
                </Profile_link>
                {isOpen && <Screen_blocker onClick={this.closeMenu} />}
            </React.Fragment>);
    }
}

export default withRouter(ProfileDropdown);
