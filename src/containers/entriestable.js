import React from 'react';
import styled from 'styled-components';
import moment from 'moment';
import momentDFPlugin from 'moment-duration-format';
momentDFPlugin(moment);

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
    color:#333;
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
    margin-right:3.3rem;
`;

const Item_day = styled.span`
    font-weight:700;
`;

const DayCount_span = styled.span`
    font-weight:700;
`;

class EntriesTable extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            filteredItems: {},
            mappedTasks: {},
            isUpdating: false
        }

        this.today = moment().format('ddd, Do MMM');
        this.yesterday = moment().add(-1, 'days').format('ddd, Do MMM');
    }

    componentDidMount() {
        const { mappedItems } = this.props;
        const filteredItems = this.getFilteredItems(mappedItems);
        const mappedTasks = this.getMappedTasks(mappedItems);
        this.setState({ filteredItems, mappedTasks });
    }

    componentWillReceiveProps(nextP) {
        const { mappedItems, isFetching } = this.props;

        if (isFetching && JSON.stringify(nextP.mappedItems) === JSON.stringify(mappedItems)) return null;

        if (nextP.mappedItems !== mappedItems) {
            const filteredItems = Object.assign({}, this.getFilteredItems(nextP.mappedItems), this.state.filteredItems);
            const mappedTasks = this.getMappedTasks(nextP.mappedItems);

            this.setState({ filteredItems, mappedTasks });
        }
    }
    shouldComponentUpdate(nxtP, nxtS) {
        if (this.state.isUpdating) return false;
        return true;
    }

    componentDidUpdate() {
        if (this.state.isUpdating) this.setState({ isUpdating: false });
    }

    toggleEntries = (day, item) => {
        const { filteredItems } = this.state;

        filteredItems[day][item] = !filteredItems[day][item];
        this.setState({ filteredItems });
    }

    startNewEntry = item => {
        const { setTopbarDescription, userData, createNewEntry } = this.props;

        const paramsObj = {};
        paramsObj.billable = item.billable;
        if (item.description) paramsObj.description = item.description;
        if (item.project) paramsObj.project = item.project;

        createNewEntry(userData._id, paramsObj);
        setTopbarDescription(item.description);
    }

    getTotalDayCount = array => {
        const total = array
            .reduce((acc, item) => acc + moment.duration(item.stop - item.start), 0);

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
        console.log('change desc', description, previousDescription, '-previous');

        const descrCandidate = description.trim();
        if (descrCandidate !== previousDescription) {
            updateEntry(userData._id, runningEntry, { description: descrCandidate });
        }
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
        const { userData, updateEntry, mappedItems } = this.props;
        const arrId = array.map(itm => itm.id);

        updateEntry(userData._id, JSON.stringify(arrId), { project });

        const readable = moment(array[0].start).format('ddd, Do MMM');
        const dayObj = this.getFilteredItems({ [readable]: mappedItems[readable] });

        const key = array[0].readable;
        const keyStr = `${project} \n${array[0].description || '$empty#'} `;
        const keyStrPrevVal = `${array[0].project} \n${array[0].description || '$empty#'} `;
        const getBoolVal = this.state.filteredItems[key][keyStrPrevVal];

        const filteredItems = { ...this.state.filteredItems, [key]: { ...dayObj, [keyStr]: getBoolVal } };
        this.setState(() => ({ isUpdating: true }), () => this.setState({ filteredItems }));
    }

    isEveryItemBillable = array => {
        if (array[0].billable && array.every(itm => itm.billable === array[0].billable)) return true;
        else return false;
    }

    setBillableMulti = array => {
        const { userData, updateEntry } = this.props;

        const arrId = array.map(itm => itm.id);
        const bool = this.isEveryItemBillable(array);

        updateEntry(userData._id, JSON.stringify(arrId), { billable: !bool });
    }

    onBlurDescriptionSave = (value, currentItem, key, previousVal) => {
        const { mappedItems } = this.props;
        const { filteredItems } = this.state;

        if (currentItem[0].description === value) return null;

        currentItem.length === 1 ?
            this.changeDescription(value, currentItem[0].id) :
            this.changeDescriptionMultiple(value, currentItem, key);

        if (previousVal !== undefined) {
            const keyStr = `${currentItem[0].project} \n${value || '$empty#'} `;
            const keyStrPrevVal = `${currentItem[0].project} \n${previousVal || '$empty#'} `;

            const getBoolVal = previousVal !== undefined ? filteredItems[key][keyStrPrevVal] : false;
            const singleDayMod = { ...filteredItems[key], [keyStr]: getBoolVal };

            this.setState({ filteredItems: Object.assign({}, filteredItems, { [key]: singleDayMod }) });
        }
    }

    getSingleEntries = (entries, key) => {

        return Object.keys(entries).map((item, i) =>
            <TimeEntry key={item} item={entries[i]}
                idx={key}
                userData={this.props.userData}
                setTopbarDescription={this.props.setTopbarDescription}
                startNewEntry={this.startNewEntry}
                changeDescription={this.onBlurDescriptionSave}
                changeProject={this.changeProject}
                updateEntry={this.props.updateEntry}
                handleRemove={this.props.handleRemove}
            />);
    }

    getMappedTasks = mappedItems => {
        const reduceInner = (acc, itm) => {
            const keyStr = `${itm.project} \n${itm.description || '$empty#'} `;

            if (!acc[keyStr]) acc[keyStr] = [];
            acc[keyStr].push(itm);
            return acc;
        }

        return Object.keys(mappedItems)
            .reduce((acc, itm) => {
                acc[itm] = mappedItems[itm].reduce(reduceInner, {});
                return acc;
            }, {});
    }

    getFilteredItems = mappedItems => {
        console.log('call getfiltereditems');
        const reduceInner = (acc, itm) => {
            const keyStr = `${itm.project} \n${itm.description || '$empty#'} `;

            if (!acc[keyStr]) acc[keyStr] = false;
            return acc;
        };

        return Object.keys(mappedItems).reduce((acc, itm) => {
            acc[itm] = mappedItems[itm].reduce(reduceInner, {});
            return acc;
        }, {});
    }

    getTaskEntries = idx => {
        const { handleRemove, userData, getProjectColor } = this.props;
        const { filteredItems, mappedTasks } = this.state;

        return Object.keys(mappedTasks[idx])
            .sort((a, b) => mappedTasks[idx][b][0].stop - mappedTasks[idx][a][0].stop)
            .map((item, i, arr) => {
                const projectName = item.split('\n')[0].trim();
                const projectDescription = item.split('\n')[1].trim();
                const currentItem = mappedTasks[idx][item];

                return <EntryGroup key={currentItem[0].id} currentItem={currentItem} projectDescription={projectDescription}
                    filteredItem={filteredItems[idx][item]} item={item} projectName={projectName} getSingleEntries={this.getSingleEntries}
                    toggleEntries={this.toggleEntries} idx={idx} onBlurDescriptionSave={this.onBlurDescriptionSave}
                    getProjectColor={getProjectColor} userData={userData} changeProject={this.changeProjectMultiple}
                    setBillableMulti={this.setBillableMulti} handleRemove={handleRemove} getTotalDayCount={this.getTotalDayCount}
                    isEveryItemBillable={this.isEveryItemBillable} startNewEntry={this.startNewEntry} />
            });
    }

    render() {
        const { mappedItems } = this.props;
        const { filteredItems } = this.state;

        if (!Object.keys(filteredItems).length) return (<p>Loading...</p>);

        return Object.keys(mappedItems)
            .map((itm, idx) =>
                <List_item key={itm}>
                    <Item_header>
                        <Item_day>{this.getDayField(itm)}</Item_day>
                        <DayCount_span>{this.getTotalDayCount(mappedItems[itm])}</DayCount_span>
                    </Item_header>
                    {this.getTaskEntries(itm)}
                </List_item >);
    }
}

export default EntriesTable;