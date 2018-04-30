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
        opacity:0;
        pointer-events:none;
`;

const Item_link_relative = styled.span`
    cursor:pointer;
    position:relative;
    opacity:0;
    pointer-events:none;
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
    margin-right: .3rem;
    height:4rem;
    display:flex;
    justify-content:space-between;
    align-items:center;
    &:hover {
        background-color:#eee;
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

const Screen_blocker = styled.div`
     display: block;
        position:fixed;
        top:0;
        left:0;
        background-color:transparent;
        width:100%;
        height:100%;
`;

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

    render() {
        const { i, item, handleRemove, startNewEntry, userData } = this.props;
        const { description } = this.props.item;
        const { isMenuOpen } = this.state;

        return (
            <Item_row key={item.id}>
                <Info_container>
                    <Input_task type="text" defaultValue={description ?
                        (description === '$empty#' ? '' : description) : null}
                        // onChange={e => this.setState({ description: e.target.value })}
                        onBlur={e => this.setDescription(e)} placeholder='Add description' />
                    {item.project && <Item_link onClick={this.openMenu}>
                        <Color_indicator color={this.getProjectColor(item.project)} />
                        <Item_project color={this.getProjectColor(item.project)}>
                            {item.project}
                        </Item_project>
                    </Item_link>}
                    {!item.project && <Item_link_toggle onClick={this.openMenu}>
                        <Icon name="folder" />
                    </Item_link_toggle>}
                    {isMenuOpen && <Screen_blocker />}
                    {isMenuOpen && <ProjectDropdown project={item.project} userData={userData}
                        setProjectState={this.onProjectClick} style={{ top: 25, left: '50%' }} />}
                </Info_container>
                <Time_container_outer>
                    <Item_link_toggle onClick={() => this.setBillable(item.id, !item.billable)}>
                        <Icon name="attach_money" fill={item.billable ? 'green' : '#bbb'} />
                    </Item_link_toggle>
                    <Time_container_inner>
                        <span>{item.duration}</span>
                        <Item_toggle>{this.getStopStartTime(item.start, item.stop)}</Item_toggle>
                    </Time_container_inner>
                    <Item_link_toggle onClick={() => startNewEntry(item)} >
                        <Icon name="play_arrow" style={{ color: '#ccc' }} />
                    </Item_link_toggle>
                    <EntryDropdown Item_link_relative={Item_link_relative}
                        handleRemove={() => handleRemove(item.id)} />
                </Time_container_outer>
            </Item_row>);
    }
}