import React from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import moment from 'moment';
import momentDFPlugin from 'moment-duration-format';
momentDFPlugin(moment);

import * as actions from '../actions/entry';
import getMappedItems from '../selectors/getmappeditems';

import EntryGroup from '../components/entrygroup';
import EntryHeader from '../components/entryheader';
import EntryTimer from '../components/entrytimer';
import TimeEntry from '../components/timentry';
import ProjectDropdown from '../components/projectdropdown';
import EntryDropdown from '../components/entrydropdown';
import Icon from '../components/icon';

const List_item = styled.li`
    background-color:white;
    border-bottom:1px solid #ddd;
    border-top:1px solid #eee;
    margin-bottom:2rem;
`;

const Item_link = styled.a`
    color:#ccc;
    cursor:pointer;
`;

const Item_header = styled.header`
    display:flex;
    justify-content:space-between;
    align-items:center;    
    padding:1rem;
    margin:auto .3rem;
    margin-right:2.2rem;
`;

const Item_day = styled.span`
    font-weight:700;
`;


class EntriesTable extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            filteredItems: {},
            mappedTasks: {}
            // taskEntries:
        }

        this.today = moment().format('ddd, Do MMM');
        this.yesterday = moment().add(-1, 'days').format('ddd, Do MMM');
    }

    componentDidMount() {
        // if (this.props.userData) {
        const { mappedItems } = this.props;
        const filteredItems = this.getFilteredItems(mappedItems);
        const mappedTasks = this.getMappedTasks(mappedItems);
        this.setState({ filteredItems, mappedTasks });
    }

    componentWillReceiveProps(nextProps) {
        if (JSON.stringify(nextProps.mappedItems) !== JSON.stringify(this.props.mappedItems)) {
            const filteredItems = Object.assign({},
                this.getFilteredItems(nextProps.mappedItems), this.state.filteredItems);
            const mappedTasks = this.getMappedTasks(nextProps.mappedItems);
            this.setState({ filteredItems, mappedTasks });
        }
    }

    toggleEntries = (idx, item) => {
        const { filteredItems } = this.state;

        filteredItems[idx][item] = !filteredItems[idx][item];
        this.setState({ filteredItems });
    }

    startNewEntry = item => {
        const { setTopbarDescription, userData, createNewEntry } = this.props;
        console.log(item, 'ITEM');

        const paramsObj = {};
        paramsObj.billable = item.billable;
        if (item.description) paramsObj.description = item.description;
        if (item.project) paramsObj.project = item.project;

        createNewEntry(userData._id, paramsObj);
        setTopbarDescription(item.description);
    }

    getTotalDayCount = array => {
        const total = array.reduce((acc, item) =>
            acc + moment.duration(item.stop - item.start), 0);

        return moment.duration(total).format('h:mm:ss', { stopTrim: "hh mm ss" });
    }

    getDayField = item => {
        const cut2nd = (itm, i) => i === 1 ? (itm.length === 3 ? itm.slice(0, 1) : itm.slice(0, 2)) : itm;

        return (this.today === item) ? 'Today' :
            ((item === this.yesterday) ? 'Yesterday' : item.split(' ').map(cut2nd).join(' '));
    }

    changeDescription = (description, runningEntry, previousDescription) => {
        const { userData, updateEntry } = this.props;
        if (!runningEntry) runningEntry = this.props.runningEntry;
        console.log('change desc', description);

        const descrCandidate = description.trim();
        descrCandidate !== previousDescription
            && updateEntry(userData._id, runningEntry, { description: descrCandidate });
    }

    changeDescriptionMultiple = (desc, array, idx) => {
        const { mappedItems } = this.props;
        const arrId = array.map(itm => itm.id);

        this.changeDescription(desc, JSON.stringify(arrId), null);
    }

    changeProject = (project, entryid) => {
        const { userData, updateEntry } = this.props;

        updateEntry(userData._id, entryid, { project });
    }

    changeProjectMultiple = (project, array) => {
        const { userData, updateEntry } = this.props;

        const arrId = array.map(itm => itm.id);

        updateEntry(userData._id, JSON.stringify(arrId), { project });
    }

    isEveryItemBillable = (array) => {
        if (array[0].billable && array.every(itm => itm.billable === array[0].billable)) return true;
        else return false;
    }

    setBillableMulti = (array) => {
        const { userData, updateEntry } = this.props;

        const arrId = array.map(itm => itm.id);
        const bool = this.isEveryItemBillable(array);

        updateEntry(userData._id, JSON.stringify(arrId), { billable: !bool });
    }

    getProjectColor = name => {
        const { userData } = this.props;

        return name.length ?
            '#' + userData.projects[userData.projects.map(itm => itm.name)
                .findIndex(itm => itm === name)].color :
            'white';
    }

    onBlurDescriptionSave = (e, currentItem, idx) => {
        currentItem.length === 1 ?
            this.changeDescription(e.target.value, currentItem[0].id) :
            this.changeDescriptionMultiple(e.target.value, currentItem, idx);
    }

    getSingleEntries = entries => {
        return Object.keys(entries).map((item, i) =>
            <TimeEntry key={item} item={entries[i]}
                userData={this.props.userData}
                setTopbarDescription={this.props.setTopbarDescription}
                startNewEntry={this.startNewEntry}
                changeDescription={this.changeDescription}
                changeProject={this.changeProject}
                updateEntry={this.props.updateEntry}
                handleRemove={this.props.handleRemove}
            />);
    }

    getMappedTasks = mappedItems => {
        const reduceFn = (acc, itm) => {
            const keyStr = `${itm.project} \n${itm.description || '$empty#'} `;

            if (!acc[keyStr]) acc[keyStr] = [];
            acc[keyStr].push(itm);
            return acc;
        }
        return Object.keys(mappedItems)
            .map(itm => mappedItems[itm].reduce(reduceFn, {}));
    }

    getFilteredItems = mappedItems => {
        return Object.keys(mappedItems)
            .map(itm => mappedItems[itm]
                .reduce((acc, itm) => {
                    const keyStr = `${itm.project} \n${itm.description || '$empty#'} `;

                    if (!acc[keyStr]) acc[keyStr] = false;
                    return acc;
                }, {}));
    }

    getTaskEntries = idx => {
        const { handleRemove, userData } = this.props;
        const { filteredItems, mappedTasks } = this.state;

        return Object.keys(mappedTasks[idx]).map((item, i) => {
            const projectName = item.split('\n')[0].trim();
            const projectDescription = item.split('\n')[1].trim();
            const currentItem = mappedTasks[idx][item];

            return <EntryGroup key={currentItem[0].id} currentItem={currentItem} projectDescription={projectDescription}
                filteredItem={filteredItems[idx][item]} item={item} projectName={projectName}
                toggleEntries={this.toggleEntries} idx={idx} onBlurDescriptionSave={this.onBlurDescriptionSave}
                getProjectColor={this.getProjectColor} userData={userData}
                changeProject={this.changeProjectMultiple}
                currentItem={currentItem} setBillableMulti={this.setBillableMulti}
                toggleEntries={this.toggleEntries} idx={idx} item={item} handleRemove={handleRemove}
                getTotalDayCount={this.getTotalDayCount} isEveryItemBillable={this.isEveryItemBillable}
                startNewEntry={this.startNewEntry} getSingleEntries={this.getSingleEntries} />
        });
    }

    render() {
        const { mappedItems, toggleEntries, changeDescription } = this.props;
        const { filteredItems } = this.state;

        if (!Object.keys(filteredItems).length) return (<p>Loading...</p>);

        return Object.keys(mappedItems)
            .map((itm, idx) =>
                <List_item key={itm}>
                    <Item_header>
                        <Item_day>{this.getDayField(itm)}</Item_day>
                        <span>{this.getTotalDayCount(mappedItems[itm])}</span>
                    </Item_header>
                    {this.getTaskEntries(idx)}
                </List_item >);
    }
}

const mapStateToProps = ({ user }) => {
    return {
        userData: user.userData,
        mappedItems: getMappedItems(user.userData)
    }
};

const mapDispatchToProps = dispatch => ({
    createNewEntry: (uid, obj) => dispatch(actions.createNewEntry(uid, obj))
});

export default connect(mapStateToProps, mapDispatchToProps)(EntriesTable);