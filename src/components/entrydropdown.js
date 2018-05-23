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
    border:1px solid #ddd;
    top:32px;
    right: 0px;
    width: 7.5rem;
    background-color:white;
    z-index:10;
    border-radius:4px;
    box-shadow: 0 2px 6px 0 rgba(0,0,0,.1);
`;

const Dropdown_item = styled.li`
    padding:.3rem;
    color:#333;
    line-height:170%;
    text-align:left;
    &:hover{
        background-color:#eee;
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
                    <Icon name="more_vert" fill={isOpen ? "#4bc800" : null} />
                    {isOpen &&
                        <Dropdown>
                            <Dropdown_item>
                                <Item_link_relative fill="#333">
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