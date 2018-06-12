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
    text-overflow:ellipsis;
    white-space:nowrap;
    overflow:hidden;
    margin-right:3px;
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
    margin-left:1.5rem;
    white-space: nowrap;
`;

export default class EntryHead extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            isMenuOpen: false
        }

        this.dropdownStyle = { top: '25px', left: '146px' };

        this.setStateBind = this.setState.bind(this);
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
        const { currentItem, idx, onBlurDescriptionSave, projectDescription } = this.props;

        onBlurDescriptionSave(e.target.value, currentItem, idx, projectDescription);
    }

    componentDidUpdate() {
        const { projectDescription } = this.props;

        if (projectDescription !== this.input.value) {
            this.input.value = projectDescription === '$empty#' ? '' : projectDescription;
        }
    }

    render() {
        const { filteredItem, item, projectDescription, projects, currentItem, getProjectColor,
            projectName, Item_link_toggle } = this.props;
        const { isMenuOpen } = this.state;

        //console.log('rendering entryheader');
        return (<Wrapper>
            {currentItem.length > 1 &&
                <GroupEntries_length color={filteredItem ? '#4bc800;' : '#333'}
                    onClick={this.toggleEntriesProxy} isOpen={filteredItem} >
                    {currentItem.length}
                </GroupEntries_length>}
            <Input_task type="text" placeholder="Add description" innerRef={node => this.input = node}
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
            {<ProjectDropdown project={projectName} projects={projects} isOpen={this.state.isMenuOpen}
                setProjectState={this.onProjectClick} style={this.dropdownStyle} setParentState={this.setStateBind} />}
        </Wrapper>);
    }
}