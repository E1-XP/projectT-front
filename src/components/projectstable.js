import React from 'react';
import styled from 'styled-components';

import moment from 'moment';
import momentDFPlugin from 'moment-duration-format';
momentDFPlugin(moment);

import Dropdown, { DropdownContent, DropdownTrigger } from 'react-simple-dropdown';
import 'react-simple-dropdown/styles/Dropdown.css';
import Icon from './icon';

const Table = styled.table`
    border-collapse:collapse;
    table-layout:fixed;
    width:95%;
    margin:3rem auto;
`;

const Table_Row = styled.tr`
    padding:1rem;
    border-bottom:2px solid #ddd;

    &:hover{
        background-color:#eee;
    }
`;

const Table_Row_Header = styled.tr`
    border-bottom:2px solid #bbb;
    display:flex;
    width:400%;
`;

const TH = styled.th`
    padding:1rem;
    height:4.2rem;
    display:flex;
    width:100%;
`;

const TD = styled.td`
    padding:1rem;
    height:4.2rem;    
    text-align:center;
`;

const No_Entries = styled.td`
    display: block;
    width:301%;
    text-align:center;
    padding:1rem;
`;

const Icon_Link = styled.a`
    
`;

const Color_Indicator = styled.span`
    display:inline-block;
    width:.6rem;
    height:.6rem;
    background-color:${props => props.color};
    border-radius:50%;
    margin-left:.5rem;
`;

const Dropdown_CheckBox = styled.div`
    display:flex;
    align-items:center;
    justify-content:center;
    padding:.2rem;
    width:3rem;

    &:hover{
    border:1px solid #ccc;
    }
`;

const CheckBox = ({ name, state, handleChecks }) => {
    // const overlay =
    return (
        <Dropdown >
            <DropdownTrigger >
                <Dropdown_CheckBox>
                    <input type="checkbox" checked={name ? state[name] : state}
                        onChange={(e) => handleChecks(e, name)} />
                    <Icon name="arrow_drop_down" />
                </ Dropdown_CheckBox>
            </DropdownTrigger>
            <DropdownContent>
                OK
</DropdownContent>

        </Dropdown>
    );
}

const Sortable_Panel = ({ stateFn, sortBy }) => {
    return (
        <div>
            <Icon_Link onClick={() => stateFn('asc', sortBy)}>
                <Icon name="keyboard_arrow_up" />
            </Icon_Link>
            <Icon_Link onClick={() => stateFn('desc', sortBy)}>
                <Icon name="keyboard_arrow_down" />
            </Icon_Link>
        </div>
    );
}

class ProjectsTable extends React.Component {
    constructor() {
        super();

        this.state = {
            checkedProjects: [],
            MainCheckBox: false,
            sortOrder: 'desc',
            sortBy: 'name'
        }
    }

    componentDidMount() {
        if (this.props.data.projects.length) {
            const reduceFn = (acc, itm) => {
                acc[itm.name] = false;
                return acc;
            };

            const checkedProjects = this.props.data.projects.reduce(reduceFn, {});
            this.setState({ checkedProjects });
        }
    }

    handleChecks = (e, name) => {
        const checkedProjects = Object.assign({}, this.state.checkedProjects);
        const { checked } = e.target;

        if (!name) {
            Object.keys(checkedProjects).forEach(key => checkedProjects[key] = checked);

            return this.setState({ checkedProjects, MainCheckBox: checked });
        }

        checkedProjects[name] = checked;
        this.setState({ checkedProjects });
    }

    getProjectTime = () => {

    }

    setSortState = (sortOrder, sortBy) => {
        this.setState({ sortOrder, sortBy });
    }

    sortFn = (sortBy) => (a, b) => {
        const { sortOrder } = this.state;

        let boolArg;
        a = a.name;
        b = b.name;

        switch (sortOrder) {
            case 'asc': boolArg = a < b; break;
            case 'desc': boolArg = a > b; break;
        }

        return (boolArg) ? -1 : (!boolArg ? 1 : 0);
    }

    render() {
        const { projects } = this.props.data;
        const { sortBy, checkedProjects } = this.state;

        if (!projects.length || !Object.keys(checkedProjects).length) return (<p>Loading...</p>);

        return (
            <Table>
                <tbody>
                    <Table_Row_Header>
                        <TH><CheckBox state={this.state.MainCheckBox}
                            handleChecks={this.handleChecks} /></TH>
                        <TH>Project<Sortable_Panel sortBy={'name'} stateFn={this.setSortState} /></TH>
                        <TH>Client<Sortable_Panel sortBy={'client'} stateFn={this.setSortState} /></TH>
                        <TH>Status<Sortable_Panel sortBy={'name'} stateFn={this.setSortState} /></TH>
                    </Table_Row_Header>

                    {projects.length ? projects.sort(this.sortFn(sortBy)).map((itm, i) =>
                        (<Table_Row key={itm.name}>
                            <TD>
                                <CheckBox name={itm.name} state={this.state.checkedProjects}
                                    handleChecks={this.handleChecks} />
                            </TD>
                            <TD>{itm.name}
                                <Color_Indicator color={`#${itm.color}`} />
                            </TD>
                            <TD>{itm.client ? itm.client : '(No Client)'}</TD>
                            <TD>(Not Started)</TD>
                        </Table_Row>)) :
                        <tr><No_Entries>Press the 'Create Project' button to get started.</No_Entries></tr>}
                </tbody>
            </Table >
        );
    }
}

export default ProjectsTable;