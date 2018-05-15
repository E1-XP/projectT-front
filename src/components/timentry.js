import React from 'react';
import styled from 'styled-components';
import moment from 'moment';
import momentDFPlugin from 'moment-duration-format';
momentDFPlugin(moment);

import EntryDropdown from './entrydropdown';
import Icon from './icon';
import ProjectDropdown from './projectdropdown';

const Item_link = styled.a`
    color:#ccc;
    cursor:pointer;
`;

const Item_link_toggle = styled(Item_link) `
    opacity:${props => props.isOpen ? '1' : '0'};
    pointer-events:none;
    color:${props => props.isOpen ? '#999' : '#ccc'};
    background-color:${props => props.isOpen ? '#eee' : 'transparent'};
    padding: .2rem .4rem;
    border-radius: 5px;
    &:hover{
        color:#999;
    }
`;

const Item_link_relative = styled.span`
    cursor:pointer;
    position:relative;
    opacity:0;
    pointer-events:none;
    color:${props => props.fill || '#ccc'};
        &:hover{
            color:${props => props.fill || '#999'};
        }
`;

const Time_container_inner = styled.div`
    display:flex;
    flex-direction:column;
    align-items:flex-end;
    justify-content:center;
    width:12rem;
`;

const Time_container_outer = styled.div`
    display:flex;
    align-items:center;
`;

const Item_toggle = styled.span`
    display:none;
`;

const Item_row = styled.li`
    text-align:center;
    padding:.5rem 0rem;
    padding-left:2.5rem;
    height:4rem;
    display:flex;
    justify-content:space-between;
    align-items:center;
    &:hover {
        background-color:#f5f5f5;
    }
    &:hover ${Item_link_relative} {
        opacity:1;
        pointer-events:all;
    }
    &:hover ${Item_link_toggle} {
        opacity:1;
        pointer-events:all;
    }
    &:hover ${Item_toggle} {
        display:block;
    }
 `;

const Input_task = styled.input`
    border:none;
    outline-color:transparent;
    background-color:transparent;
`;

const Item_project = styled.span`
    color:${({ color }) => color === 'white' ? 'black' : color};
`;

const Color_indicator = styled.span`
    display: inline-block;
    width:.6rem;
    height:.6rem;
    background-color: ${props => props.color};
    border-radius: 50%;
    margin-right: .5rem;
`;

const Info_container = styled.div`
    position:relative;
`;

const dropdownStyle = { top: 25, left: '50%' };

export default class TimeEntry extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            description: "",
            isMenuOpen: false
        }
    }

    openMenu = () => {
        this.setState({ isMenuOpen: true }, () => document.addEventListener('click', this.closeMenu));
    }

    closeMenu = () => {
        this.setState({ isMenuOpen: false }, () => document.removeEventListener('click', this.closeMenu));
    }

    setDescription(e) {
        const { i, item, handleRemove } = this.props;

        this.props.changeDescription(e.target.value, item.id, item.description);
    }

    setBillable = (entryid, bool) => {
        const { userData, updateEntry } = this.props;

        updateEntry(userData._id, entryid, { billable: bool });
    }

    getStopStartTime(start, stop) {
        const startFormat = moment(start).format('hh:mm A');
        const stopFormat = moment(Number(stop)).format('hh:mm A');

        return `${startFormat} - ${stopFormat}`;
    }

    getProjectColor = projectName => {
        const { projects } = this.props.userData;
        let color;

        projects.map(itm => itm.name === projectName ? color = itm.color : null);
        return `#${color}`;
    }

    onProjectClick = projObj => {
        console.log(projObj);
        const { changeProject, item } = this.props;
        const name = (!projObj) ? "" : projObj.name;
        changeProject(name, item.id);
    }

    setDescriptionProxy = e => {
        this.setDescription(e);
    }

    handleRemoveProxy = () => {
        this.props.handleRemove(this.props.item.id);
    }

    startNewEntryProxy = () => {
        this.props.startNewEntry(this.props.item);
    }

    setBillableProxy = () => {
        const { item } = this.props;
        this.setBillable(item.id, !item.billable)
    }

    getDescription = () => {
        const { description } = this.props.item;
        return description ? (description === '$empty#' ? '' : description) : null;
    }

    render() {
        const { item, userData } = this.props;
        const { isMenuOpen } = this.state;

        return (
            <Item_row key={item.id}>
                <Info_container>
                    <Input_task type="text" defaultValue={this.getDescription()}
                        onBlur={this.setDescriptionProxy} placeholder='Add description' />
                    {item.project && <Item_link onClick={this.openMenu}>
                        <Color_indicator color={this.getProjectColor(item.project)} />
                        <Item_project color={this.getProjectColor(item.project)}>
                            {item.project}
                        </Item_project>
                    </Item_link>}
                    {!item.project && <Item_link_toggle isOpen={isMenuOpen} onClick={this.openMenu}>
                        <Icon name="folder" size="20px" />
                    </Item_link_toggle>}
                    <ProjectDropdown project={item.project} userData={userData} isOpen={isMenuOpen}
                        setProjectState={this.onProjectClick} style={dropdownStyle}
                        setParentState={this.setState.bind(this)} />
                </Info_container>
                <Time_container_outer>
                    <Item_link_toggle onClick={this.setBillableProxy}>
                        <Icon name="attach_money" size="20px" fill={item.billable ? 'green' : null} />
                    </Item_link_toggle>
                    <Time_container_inner>
                        <span>{item.duration}</span>
                        <Item_toggle>{this.getStopStartTime(item.start, item.stop)}</Item_toggle>
                    </Time_container_inner>
                    <Item_link_toggle onClick={this.startNewEntryProxy}>
                        <Icon name="play_arrow" size="32px" />
                    </Item_link_toggle>
                    <EntryDropdown Item_link_relative={Item_link_relative}
                        handleRemove={this.handleRemoveProxy} />
                </Time_container_outer>
            </Item_row>);
    }
}