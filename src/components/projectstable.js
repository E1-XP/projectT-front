import React from 'react';
import styled from 'styled-components';

import moment from 'moment';
import momentDFPlugin from 'moment-duration-format';
momentDFPlugin(moment);

import Icon from './icon';

const Table = styled.table`
    border-collapse:collapse;
    table-layout:fixed;
    width:95%;
    margin:3rem auto;
`;

const Table_Row = styled.tr`
    border-bottom: 2px solid #ddd;
    display: flex;
    justify-content: space-between;
    &:hover{
        background-color:#eee;
    }
`;

const Table_Row_Header = styled.tr`
    border-bottom:2px solid #bbb;
    display:flex;
    background-color:white;
`;

const TH = styled.th`
    padding:1rem;
    height:4.2rem;
    align-items:center;
    justify-content:center;    
    display:flex;
    width:100%;
    color:#666;
    &:first-of-type{
        width:4rem;
    }
`;

const TD = styled.td`
    padding:1rem;
    width:100%;
    height:4.2rem;    
    display:flex;
    align-items:center;
    justify-content:center;
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

const CheckBox = ({ name, state, handleChecks }) => {
    const syntheticTarget = { target: { checked: name !== 'maincheck' ? state[name] : state } };

    return (<React.Fragment>
        <input type="checkbox" checked={name !== 'maincheck' ? state[name] : state}
            value={name !== 'maincheck' ? state[name] : state} name={name}
            onChange={(e) => handleChecks(e, name !== 'maincheck' ? name : null)} />
        <label htmlFor={name}><span onClick={() =>
            handleChecks(syntheticTarget, name !== 'maincheck' ? name : null)}></span></label>
    </React.Fragment>);
}

const Sortable_Panel = ({ stateFn, sortBy }) => {
    return (<div>
        <Icon_Link onClick={() => stateFn('asc', sortBy)}>
            <Icon name="keyboard_arrow_up" />
        </Icon_Link>
        <Icon_Link onClick={() => stateFn('desc', sortBy)}>
            <Icon name="keyboard_arrow_down" />
        </Icon_Link>
    </div>);
}

class ProjectsTable extends React.Component {
    constructor() {
        super();

        this.state = {
            checkedProjects: [],
            sortedProjects: [],
            MainCheckBox: false,
            sortOrder: 'desc',
            sortBy: 'name'
        }
    }

    componentDidMount() {
        const { projects } = this.props.data;

        if (projects.length) {
            this.handlePropsChange();
        }
    }

    componentDidUpdate(prevP, prevS) {
        const { projects } = this.props.data;

        if (projects.length && projects.length !== prevP.data.projects.length) {
            this.handlePropsChange();
        }
    }

    handlePropsChange = () => {
        const { projects } = this.props.data;

        const reduceFn = (acc, itm) => {
            acc[itm.name] = false;
            return acc;
        };
        const checkedProjects = projects.reduce(reduceFn, {});
        const sortedProjects = projects.sort(this.sortFn(this.state.sortBy));

        this.setState({ checkedProjects, sortedProjects });
    }

    handleChecks = (e, name = null) => {
        const checkedProjects = Object.assign({}, this.state.checkedProjects);
        const { checked } = e.target;

        if (!name) {
            //handle main checkbox             
            Object.keys(checkedProjects).forEach(key => checkedProjects[key] = checked);
            this.setState({ checkedProjects, MainCheckBox: checked });
        }
        else {
            checkedProjects[name] = checked;
            const isEveryItemEqualChecked = Object.keys(checkedProjects)
                .every(itm => checkedProjects[itm] === checked);

            const MainCheckBox = isEveryItemEqualChecked && checked ? true : false;
            this.setState({ checkedProjects, MainCheckBox });
        }
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
        const { state } = this;
        const { projects } = this.props.data;

        const newState = { sortOrder, sortBy };

        if (state.sortOrder !== sortOrder || state.sortBy !== sortBy) {
            newState.sortedProjects = projects.sort(this.sortFn(this.state.sortBy));
        }
        this.setState(newState);
    }

    sortFn = sortBy => (a, b) => {
        const { sortOrder } = this.state;

        if (sortBy === 'name') {
            a = a.name.toLowerCase();
            b = b.name.toLowerCase();
        }
        else if (sortBy === 'client') {
            a = a.client.toLowerCase();
            b = b.client.toLowerCase();
        }
        else if (sortBy === 'status') {
            a = this.projectsLengthSum(a.name);
            b = this.projectsLengthSum(b.name);
        }

        let boolArg;
        switch (sortOrder) {
            case 'asc': boolArg = a > b; break;
            case 'desc': boolArg = b > a; break;
        }

        return boolArg ? -1 : (!boolArg ? 1 : 0);
    }

    generateItems = () => {
        const { sortBy, checkedProjects, sortedProjects } = this.state;

        return sortedProjects.map((itm, i) =>
            (<Table_Row key={itm.name}>
                <TD>
                    <CheckBox name={itm.name} state={checkedProjects}
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
        const { sortBy, checkedProjects, sortedProjects } = this.state;

        if (!projects.length || !sortedProjects.length) return (<p>Loading...</p>);

        return (
            <Table>
                <tbody>
                    <Table_Row_Header>
                        <TH><CheckBox state={this.state.MainCheckBox}
                            handleChecks={this.handleChecks} name="maincheck" />
                        </TH>
                        <TH>Project<Sortable_Panel sortBy={'name'} stateFn={this.setSortState} /></TH>
                        <TH>Client<Sortable_Panel sortBy={'client'} stateFn={this.setSortState} /></TH>
                        <TH>Status<Sortable_Panel sortBy={'status'} stateFn={this.setSortState} /></TH>
                    </Table_Row_Header>
                    {projects.length ? this.generateItems() :
                        <tr><No_Entries>Press the 'Create Project' button to get started.</No_Entries></tr>}
                </tbody>
            </Table>
        );
    }
}

export default ProjectsTable;