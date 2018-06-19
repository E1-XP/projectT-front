import React from 'react';
import { withRouter } from 'react-router-dom';
import styled from 'styled-components';

const Dropdown = styled.ul`
    position:absolute;
    border:1px solid #ccc;
    right: -3px;
    width: 18rem;
    background-color:white;
    z-index:100;
    top: -95px;
    right: -295px;
    border-radius:7px;
`;

const Dropdown_item = styled.li`
    color:black;
    padding:.6rem;
    text-align:left;
    &:hover{
        background-color:#ddd;
    }
    &:last-child{
        border-radius:0px 0px 7px 7px;        
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

const Dropdown_item_border = styled(Dropdown_item)`
    border-top:1px solid #ddd;
`;

const Dropdown_item_noclick = styled(Dropdown_item)`
    cursor:default;
    &:hover{
        background-color:initial;
    }
`;

const IconProfile = styled.span`
    display:flex;
    background-color:#e20505;
    background-image:url(${props => props.url || 'none'});
    background-size:cover;
    width:1.7rem;
    height:1.7rem;
    font-size:14px;
    border-radius:50%;
    justify-content:center; 
    align-items:center;
    font-weight:700;
`;

const Profile_link = styled.a`
    cursor:pointer;
    position:relative;
    color:#ddd;
    display:flex;
    align-items: center;
    justify-content: center;
    margin-bottom:0.3rem;
    border-radius: 50%;
    @media only screen and (min-width:1024px){
         justify-content:initial;
}
`;

const Link_label = styled.span`
    display:none;
    @media only screen and (min-width:1024px){
        display:block;
        margin-right:1rem;
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
        !e.target.classList.contains('js-noclick') &&
            this.setState({ isOpen: false }, () => document.removeEventListener('click', this.closeMenu));
    }

    getShortUsername = () => {
        const { username } = this.props.userData;

        return username.split(' ').length >= 2 ?
            username.split(' ')[0].charAt(0).toUpperCase() +
            username.split(' ')[1].charAt(0).toUpperCase() :
            username.toUpperCase().slice(0, 2);
    }

    goToProfile = () => {
        this.props.history.push('/profile');
    }

    render() {
        const { isOpen } = this.state;
        const { handleLogout, userData } = this.props;
        const { username } = this.props.userData;

        return (
            <React.Fragment>
                <Profile_link onClick={this.openMenu}>
                    <Link_label>{username.length > 12 ? username.substring(0, 10) + '...' : username}</Link_label>
                    <IconProfile url={userData.avatar || null} >
                        {!userData.avatar && this.getShortUsername()}
                    </IconProfile>
                    {isOpen && <Dropdown>
                        <Dropdown_item_noclick className="js-noclick">
                            {`${username}'s workspace`}
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
