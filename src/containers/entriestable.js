import React from 'react';
import styled from 'styled-components';
import throttle from 'lodash.throttle';
import moment from 'moment';
import momentDFPlugin from 'moment-duration-format';
momentDFPlugin(moment);

import EntryGroup from '../components/entrygroup';
import TimeEntry from '../components/timentry';

const List_item = styled.li`
    background-color:white;
    border-bottom:1px solid #ddd;
    border-top:1px solid #eee;
    margin-bottom:2rem;
    color:#333;
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

const Load_p = styled.p`
    text-align:center;
`;

class EntriesTable extends React.Component {
    constructor() {
        super();

        this.today = moment().format('ddd, Do MMM');
        this.yesterday = moment().add(-1, 'days').format('ddd, Do MMM');

        this.actionsQueue = [];

        this.startNewEntry = throttle(this.startNewEntry, 1500);
    }

    shouldComponentUpdate(nextP) {
        const { isUpdating, isRunning, mappedItems, filteredItems,
            daysToShowLength } = this.props;
        //return true;
        if (nextP.daysToShowLength !== daysToShowLength) return true;

        if (!isUpdating && nextP.isUpdating) return false;

        if (isRunning && isRunning !== nextP.isRunning) return false;

        if (mappedItems === nextP.mappedItems && filteredItems === nextP.filteredItems) {
            return false;
        }

        return true;
    }

    componentWillReceiveProps(nextP) {
        console.log(this.actionsQueue.length);

        while (!nextP.isFetching && this.actionsQueue.length) {
            const fn = this.actionsQueue.shift();
            fn && fn();
        }
    }

    componentDidUpdate() {
        if (this.props.isUpdating) this.props.setState({ isUpdating: false });
        if (this.props.isUpdating) console.log('set isupdating to false')
    }

    toggleEntries = (day, item) => {
        const { filteredItems } = this.props;

        filteredItems[day][item] = !filteredItems[day][item];
        this.props.setState({ filteredItems: Object.assign({}, filteredItems) });
    }

    startNewEntry = item => {
        const { setTopbarDescription, userData, createNewEntry,
            isFetching } = this.props;

        const innerFn = () => {
            const paramsObj = {};
            paramsObj.billable = item.billable;
            if (item.description) paramsObj.description = item.description;
            if (item.project) paramsObj.project = item.project;

            createNewEntry(userData._id, paramsObj);
            setTopbarDescription(item.description);
        }

        isFetching ? this.actionsQueue.push(innerFn) : innerFn();
    }

    getTotalDayCount = dayOfItems => {
        const reduceInner = (acc, itm) => acc += moment.duration(itm.stop - itm.start);

        const total = (Array.isArray(dayOfItems)) ? dayOfItems.reduce(reduceInner, 0) :
            Object.keys(dayOfItems)
                .reduce((acc, itm) => acc += dayOfItems[itm].reduce(reduceInner, 0), 0);

        return moment.duration(total).format('h:mm:ss', { stopTrim: "hh mm ss" });
    }

    getDayField = item => {
        const cut2nd = (itm, i) => i === 1 ?
            (itm.length === 3 ? itm.slice(0, 1) : itm.slice(0, 2)) : itm;

        return (this.today === item) ? 'Today' :
            ((item === this.yesterday) ? 'Yesterday' : item.split(' ')
                .map(cut2nd).join(' '));
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
        const arrId = array.map(itm => itm.id);

        this.changeDescription(desc, JSON.stringify(arrId), null);
    }

    changeProject = (project, entryid) => {
        const { userData, updateEntry } = this.props;

        updateEntry(userData._id, entryid, { project });
    }

    changeProjectMultiple = (project, array) => {
        const { userData, updateEntry, mappedItems, getFilteredItems } = this.props;
        const arrId = array.map(itm => itm.id);

        updateEntry(userData._id, JSON.stringify(arrId), { project });

        const readable = moment(array[0].start).format('ddd, Do MMM');
        const dayObj = getFilteredItems({ [readable]: mappedItems[readable] });
        console.log(dayObj, 'DOBJ')
        const key = array[0].readable;
        const keyStr = `${project} \n${array[0].description || '$empty#'} `;
        const keyStrPrevVal =
            `${array[0].project} \n${array[0].description || '$empty#'} `;
        const getBoolVal = this.props.filteredItems[key][keyStrPrevVal];
        console.log(keyStr, getBoolVal, 'val,key')
        const filteredItems = {
            ...this.props.filteredItems,
            [key]: { ...dayObj, [keyStr]: getBoolVal }
        };

        this.props.setState(() => ({ isUpdating: true, filteredItems }));
    }

    isEveryItemBillable = array => {
        return (array[0].billable &&
            array.every(itm => itm.billable === array[0].billable)) ? true : false;
    }

    setBillableMulti = array => {
        const { userData, updateEntry } = this.props;

        const arrId = array.map(itm => itm.id);
        const bool = this.isEveryItemBillable(array);

        updateEntry(userData._id, JSON.stringify(arrId), { billable: !bool });
    }

    onBlurDescriptionSave = (value, currentItem, key, previousVal) => {
        const { filteredItems } = this.props;

        if (currentItem[0].description === value) return null;

        currentItem.length === 1 ?
            this.changeDescription(value, currentItem[0].id) :
            this.changeDescriptionMultiple(value, currentItem, key);

        if (previousVal !== undefined) {
            const keyStr = `${currentItem[0].project} \n${value || '$empty#'} `;
            const keyStrPrevVal =
                `${currentItem[0].project} \n${previousVal || '$empty#'} `;

            const getBoolVal = previousVal !== undefined ?
                filteredItems[key][keyStrPrevVal] : false;
            const singleDayMod = { ...filteredItems[key], [keyStr]: getBoolVal };

            this.props.setState({
                filteredItems: Object.assign({},
                    filteredItems, { [key]: singleDayMod })
            });
        }
    }

    getSingleEntries = (entries, key) => {
        return Object.keys(entries).map((item, i) =>
            <TimeEntry key={item} item={entries[i]}
                idx={key}
                userData={this.props.userData}
                projects={this.props.projects}
                setTopbarDescription={this.props.setTopbarDescription}
                startNewEntry={this.startNewEntry}
                changeDescription={this.onBlurDescriptionSave}
                changeProject={this.changeProject}
                updateEntry={this.props.updateEntry}
                handleRemove={this.props.handleRemove}
            />);
    }

    getTaskEntries = idx => {
        const { handleRemove, userData, projects, getProjectColor, filteredItems,
            mappedItems, isFetching } = this.props;

        return Object.keys(mappedItems[idx])
            .sort((a, b) => mappedItems[idx][b][mappedItems[idx][b].length - 1].stop -
                mappedItems[idx][a][mappedItems[idx][a].length - 1].stop)
            .map(item => {
                const projectName = item.split('\n')[0].trim();
                const projectDescription = item.split('\n')[1].trim();
                const currentItem = mappedItems[idx][item];

                return (<EntryGroup key={currentItem[0].id} currentItem={currentItem}
                    projectDescription={projectDescription} filteredItem={filteredItems[idx][item]}
                    item={item} projectName={projectName} getSingleEntries={this.getSingleEntries}
                    toggleEntries={this.toggleEntries} idx={idx}
                    onBlurDescriptionSave={this.onBlurDescriptionSave}
                    getProjectColor={getProjectColor} userData={userData}
                    changeProject={this.changeProjectMultiple}
                    projects={projects} setBillableMulti={this.setBillableMulti}
                    handleRemove={handleRemove} getTotalDayCount={this.getTotalDayCount}
                    isEveryItemBillable={this.isEveryItemBillable}
                    startNewEntry={this.startNewEntry} isFetching={isFetching} />)
            });
    }

    render() {
        const { mappedItems, filteredItems, daysToShowLength } = this.props;

        if (!Object.keys(filteredItems).length) return (<Load_p>Loading...</Load_p>);
        console.log('current items to show:', daysToShowLength);

        return Object.keys(mappedItems)
            .map((itm, idx) =>
                idx < daysToShowLength ? (<List_item key={itm}>
                    <Item_header>
                        <Item_day>{this.getDayField(itm)}</Item_day>
                        <DayCount_span>{this.getTotalDayCount(mappedItems[itm])}</DayCount_span>
                    </Item_header>
                    {this.getTaskEntries(itm)}
                </List_item>) : null);
    }
}

export default EntriesTable;