import React from 'react';
import styled from 'styled-components';

import Icon from './icon';

const Screen_blocker = styled.div`
     display: block;
        position:fixed;
        top:0;
        left:0;
        background-color:transparent;
        width:100%;
        height:100%;
`;

const Item_link_danger = styled.a`
    cursor:pointer;
    color:red;
`;

const Dropdown = styled.ul`
    position:absolute;
    border:1px solid black;
    right: -3px;
    width: 7.5rem;
    background-color:white;
    z-index:10;
`;

const Dropdown_item = styled.li`
    padding:.3rem;
    text-align:left;
    &:hover{
        background-color:#ddd;
    }
`;

class EntryDropdown extends React.Component {
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

    onRemove = () => {
        this.props.handleRemove();
    }


    render() {
        const { isOpen } = this.state;
        const { Item_link_relative } = this.props;

        return (
            <React.Fragment>
                <Item_link_relative onClick={this.openMenu}>
                    <Icon name="more_vert" />
                    {isOpen &&
                        <Dropdown>
                            <Dropdown_item>
                                <Item_link_relative>
                                    Go to Projects
                            </Item_link_relative>
                            </Dropdown_item>
                            <Dropdown_item onClick={this.onRemove}>
                                <Item_link_danger >
                                    Delete
                            </Item_link_danger>
                            </Dropdown_item>
                        </Dropdown>}
                </Item_link_relative>
                {isOpen && <Screen_blocker onClick={this.closeMenu} />}
            </React.Fragment>
        );
    }
}

export default EntryDropdown;