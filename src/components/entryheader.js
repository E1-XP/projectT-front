import React from 'react';
import styled from 'styled-components';

import ProjectDropdown from './projectdropdown';
import Icon from './icon';

const Color_indicator = styled.span`
    display: inline-block;
    width:.6rem;
    height:.6rem;
    background-color: ${props => props.color};
    border-radius: 50%;
    margin-right: .5rem;
`;

const Item_link = styled.a`
    color:#ccc;
    cursor:pointer;
`;

const Input_task = styled.input`
    border: none;
    outline-color: transparent;
    background-color:transparent;
`;

const Item_project = styled.span`
    color:${({ color }) => color === 'white' ? 'black' : color};
`;

const GroupEntries_length = styled.span`
    cursor:pointer;
    margin-right: .5rem;
    border:1px solid #efefef;
    border-radius:8px;
    padding:.3rem .6rem;
    background-color:${({ isOpen }) => isOpen ? '#efefef' : 'transparent'};
    color: ${({ color }) => color};
`;

const Item_link_relative = styled.span`
    cursor:pointer;
    position:relative;
    opacity:0;
    pointer-events:none;
`;

const Wrapper = styled.div`
    position: relative;
    margin-left:1.5rem;
`;

export default class EntryHead extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            isMenuOpen: false
        }

        this.dropdownStyle = { top: '25px', left: '50%' };
    }

    openMenu = () => {
        this.setState({ isMenuOpen: true });
    }

    onProjectClick = projObj => {
        const { changeProject, currentItem } = this.props;
        const name = (!projObj) ? "" : projObj.name;

        changeProject(name, currentItem);
        this.setState({ isMenuOpen: false });
    }

    toggleEntriesProxy = () => {
        const { toggleEntries, idx, item } = this.props;
        toggleEntries(idx, item);
    }

    onBlurDescriptionSaveProxy = e => {
        const { currentItem, idx, onBlurDescriptionSave } = this.props;
        onBlurDescriptionSave(e, currentItem, idx);
    }

    render() {
        const { filteredItem, idx, item, projectDescription, userData, currentItem, getProjectColor,
            projectName, Item_link_toggle } = this.props;
        const { isMenuOpen } = this.state;

        //console.log('rendering entryheader');
        return (
            <Wrapper>
                {currentItem.length > 1 &&
                    <GroupEntries_length color={filteredItem ? '#4bc800;' : '#333'}
                        onClick={this.toggleEntriesProxy} isOpen={filteredItem} >
                        {currentItem.length}
                    </GroupEntries_length>}
                <Input_task type="text" placeholder="Add description"
                    defaultValue={projectDescription === '$empty#' ? '' : projectDescription}
                    onBlur={this.onBlurDescriptionSaveProxy} />
                {projectName &&
                    <Item_link onClick={this.openMenu}>
                        <Color_indicator color={getProjectColor(projectName)} />
                        <Item_project color={getProjectColor(projectName)}>
                            {projectName}
                        </Item_project>
                    </Item_link>}
                {!projectName && <Item_link_toggle isOpen={isMenuOpen} onClick={this.openMenu}>
                    <Icon name="folder" size="20px" />
                </Item_link_toggle>}
                {<ProjectDropdown project={projectName} userData={userData} isOpen={this.state.isMenuOpen}
                    setProjectState={this.onProjectClick} style={this.dropdownStyle} setParentState={this.setState.bind(this)} />}
            </Wrapper>
        );
    }
}