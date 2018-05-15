import React from 'react';
import styled from 'styled-components';

import moment from 'moment';
import momentDFPlugin from 'moment-duration-format';
momentDFPlugin(moment);

import Dropdown, { DropdownContent, DropdownTrigger } from 'react-simple-dropdown';
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
    background-color:white;
`;

const TH = styled.th`
    padding:1rem;
    height:4.2rem;
    align-items:center;
    justify-content:center;    
    display:flex;
    width:100%;
    &:first-of-type{
        width:4rem;
    }
`;

const TD = styled.td`
    padding:1rem;
    height:4.2rem;    
    text-align:center;
    &:first-of-type{
        width:4rem;
    }
`;

const No_Entries = styled.td`
    display: block;
    width:301%;
    text-align:center;
    padding:1rem;
`;

const Icon_Link = styled.a`
    cursor: pointer;
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

    projectsLengthSum = projectStr => {
        const { entries } = this.props.data;
        const now = moment();
        const condition = itm => itm.stop !== undefined && itm.project === projectStr;

        return entries
            .reduce((acc, item) => {
                return condition(item) ?
                    acc + moment.duration(moment(Number(item.stop)).diff(item.start)).valueOf() :
                    acc;
            }, 0);
    }

    getProjectTime = projectStr => {
        const total = this.projectsLengthSum(projectStr);
        return moment.duration(total).format('h:mm:ss', { stopTrim: "hh mm ss" });
    }

    setSortState = (sortOrder, sortBy) => {
        this.setState({ sortOrder, sortBy });
    }

    sortFn = sortBy => (a, b) => {
        const { sortOrder } = this.state;

        let boolArg;
        if (sortBy === 'name') {
            a = a.name;
            b = b.name;
        }
        else if (sortBy === 'client') {
            a = a.client;
            b = b.client;

        }
        else if (sortBy === 'status') {
            a = this.projectsLengthSum(a.name);
            b = this.projectsLengthSum(b.name);
        }

        switch (sortOrder) {
            case 'asc': boolArg = a > b; break;
            case 'desc': boolArg = b > a; break;
        }

        return boolArg ? -1 : (!boolArg ? 1 : 0);
    }

    generateItems = () => {
        const { sortBy, checkedProjects } = this.state;

        return this.props.data.projects
            .sort(this.sortFn(sortBy))
            .map((itm, i) =>
                (<Table_Row key={itm.name}>
                    <TD>
                        <CheckBox name={itm.name} state={this.state.checkedProjects}
                            handleChecks={this.handleChecks} />
                    </TD>
                    <TD>{itm.name}
                        <Color_Indicator color={`#${itm.color}`} />
                    </TD>
                    <TD>{itm.client ? itm.client : '(No Client)'}</TD>
                    <TD>{this.projectsLengthSum(itm.name) ?
                        this.getProjectTime(itm.name) : '(Not Started)'}</TD>
                </Table_Row>))
    }

    render() {
        const { projects, entries } = this.props.data;
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
                        <TH>Status<Sortable_Panel sortBy={'status'} stateFn={this.setSortState} /></TH>
                    </Table_Row_Header>
                    {projects.length ? this.generateItems() :
                        <tr><No_Entries>Press the 'Create Project' button to get started.</No_Entries></tr>}
                </tbody>
            </Table >
        );
    }
}

export default ProjectsTable;