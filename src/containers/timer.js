import React from 'react';
import { connect } from 'react-redux';
import * as actions from '../actions';

import styled, { keyframes } from 'styled-components';
import moment from 'moment';
import momentDFPlugin from 'moment-duration-format';
momentDFPlugin(moment);

import Topbar from '../containers/topbar';
import WeekCounter from '../containers/weekcounter';
import EntriesTable from '../containers/entriestable';
import WelcomeScreen from '../components/welcomescreen'

const Container = styled.div`
    background-color:rgb(250,250,250);
    padding-bottom:3rem;
    position:relative;
    min-width: 570px;
`;

const Container_center = styled.div`
    display:flex;
    justify-content:center;
    padding:1rem;
    margin:2rem;
`;

const List = styled.ul`
`;

const Button_load = styled.button`
    background-color:white;
    font-weight:500;
    border:none; 
    padding:.1rem;
    cursor:pointer;
`;

const rotateAnim = keyframes`
    from{
        transform:rotate(0deg);
    }
    to{
        transform:rotate(360deg);
    }
`;

const Spinner = styled.div`
    padding:1.2rem;
    border:3px solid #bbb;
    border-right:3px solid transparent; 
    border-radius:50%;   
    transform:translateZ(0);
    animation:${rotateAnim} .5s infinite;
`;

class Timer extends React.Component {
    constructor() {
        super();

        this.state = {
            filteredItems: {},
            isUpdating: false,
            isFetchingEntries: false
        }

        this.setStateBind = this.setState.bind(this);
    }

    componentDidMount() {
        const { entries, setWeekTimer, setAllEntriesFetched, allEntriesFetched,
            daysToShowLength, setDaysToShowLength } = this.props;

        this.setState({ filteredItems: this.getFilteredItems() });

        if (daysToShowLength !== 10) setDaysToShowLength(10);

        if (allEntriesFetched) setAllEntriesFetched(false);

        if (entries.length) setWeekTimer(this.getWeekTimeComposed(entries));
    }

    shouldComponentUpdate(nextP, nextS) {
        const { daysToShowLength, allEntriesFetched, weekTimer, mappedItems } = this.props;
        const { isFetchingEntries, filteredItems } = this.state;

        if (!Object.keys(filteredItems).length) return true;

        if (!this.props.isRunning && nextP.isRunning) return false;

        if (filteredItems !== nextS.filteredItems) return true;

        if (this.props.isRunning && nextP.weekTimer !== weekTimer) return false;

        if (allEntriesFetched !== nextP.allEntriesFetched) return true;

        if (isFetchingEntries === nextS.isFetchingEntries && nextS.mappedItems === mappedItems) return false;

        if (nextS.mappedItems !== mappedItems || nextP.daysToShowLength !== daysToShowLength ||
            nextP.weekTimer !== weekTimer || nextS.isFetchingEntries !== isFetchingEntries) return true;

        return false;
    }

    componentWillReceiveProps(nextP) {
        const { setWeekTimer, isRunning, setAllEntriesFetched, allEntriesFetched,
            mappedItems } = this.props;
        const { isFetchingEntries, filteredItems } = this.state;
        const newState = {};
        const mappedItemsLength = Object.keys(mappedItems).length;

        if (allEntriesFetched && (mappedItemsLength > nextP.daysToShowLength ||
            nextP.daysToShowLength - mappedItemsLength <= 10)) {
            setAllEntriesFetched(false);
        }

        if ((isRunning && !nextP.isRunning && nextP.mappedItems !== mappedItems) ||
            (!nextP.isRunning && nextP.mappedItems !== mappedItems)) {
            setWeekTimer(this.getWeekTimeComposed(nextP.entries));
        }

        if (isFetchingEntries) newState.isFetchingEntries = false;

        if (nextP.mappedItems !== mappedItems) {
            newState.filteredItems = Object.assign({},
                this.getFilteredItems(nextP.mappedItems), filteredItems);
        }

        Object.keys(newState).length && this.setState(newState);
    }

    handleRemove = id => {
        const { removeEntry, userData } = this.props;
        console.log(id);
        removeEntry(userData._id, id);
    }

    getWeekTime = entries => {
        const thisWeekStart = moment().startOf('isoWeek');

        const total = entries
            .reduce((acc, itm) => {
                return (itm.stop !== undefined && itm.start >= thisWeekStart.valueOf()) ?
                    acc + itm.stop - itm.start :
                    acc;
            }, 0);

        return total;
    }

    getWeekTimeFormatted = time => {
        return moment.duration(time).format('h:mm:ss', { stopTrim: "hh mm ss" });
    }

    getWeekTimeComposed = entries => {
        const number = this.getWeekTime(entries);
        const string = this.getWeekTimeFormatted(number);

        return { number, string };
    }

    passRefToChild = str => {
        this.topBarRef.setStateWithRef(str);
    }

    getProjectColor = name => {
        const { projects } = this.props;
        if (name === 'noproject') return '#bbb';

        if (name.length) {
            const idx = projects.map(itm => itm.name).findIndex(itm => itm === name);
            const item = projects[idx];
            if (item) return '#' + item.color;
        }
        return 'white';
    }

    getFilteredItems = (src = null) => {
        const mappedTasks = src || this.props.mappedItems;
        console.log('call getfiltereditems');

        const reduceInner = (acc, key) => {
            if (!acc[key]) acc[key] = false;
            return acc;
        };

        return Object.keys(mappedTasks)
            .reduce((acc, itm) => {
                acc[itm] = Object.keys(mappedTasks[itm]).reduce(reduceInner, {});
                return acc;
            }, {});
    }

    appendEntries = () => {
        const { userData, setDaysToShowLength, daysToShowLength, fetchEntries,
            mappedItems } = this.props;

        const entriesToKeys = Object.keys(mappedItems);
        const lastShowedItem = mappedItems[entriesToKeys[daysToShowLength - 1]];
        const areTenNextItemsInStore = !!entriesToKeys[daysToShowLength - 1 + 10];
        console.log(entriesToKeys[daysToShowLength - 1 + 10]);

        if (!areTenNextItemsInStore) { //  less than ten next items in store, fetch remaining
            const dayThatEnds = mappedItems[entriesToKeys[entriesToKeys.length - 1]];
            const keysFromThatDay = Object.keys(dayThatEnds);
            const existingItemsCount = entriesToKeys.length - entriesToKeys
                .findIndex(key => mappedItems[key] === lastShowedItem) - 1;

            console.log(existingItemsCount);
            const dayDifference = 10 - existingItemsCount;
            console.log(dayDifference);

            const startAt = moment(dayThatEnds[keysFromThatDay[0]][0].start).startOf('day').valueOf();
            // const endAt = moment(startAt).add(dayDifference, 'days').endOf('day').valueOf();
            console.log(startAt);

            this.setState({ isFetchingEntries: true });
            fetchEntries(userData._id, startAt, undefined, dayDifference)
                .then(() => setDaysToShowLength(daysToShowLength + 10));
        }
        else {
            this.setState({ isFetchingEntries: true });
            setTimeout(() => {
                setDaysToShowLength(daysToShowLength + 10);
                this.setState({ isFetchingEntries: false })
            }, 300);
        }
    }

    render() {
        const { userData, entries, projects, isRunning, allEntriesFetched, mappedItems, daysToShowLength,
            createNewEntry,isFetching } = this.props;
        const { isFetchingEntries, filteredItems, mappedTasks, isUpdating } = this.state;

        return (<Container>
            <Topbar onRef={ref => this.topBarRef = ref} />
            <WeekCounter isRunning={isRunning} getProjectColor={this.getProjectColor} />
            <List>
                {entries.length ?
                    <EntriesTable
                        userData={userData}
                        projects={projects}
                        mappedItems={mappedItems}
                        mappedTasks={mappedTasks}
                        filteredItems={filteredItems}
                        getFilteredItems={this.getFilteredItems}
                        setTopbarDescription={this.passRefToChild}
                        createNewEntry={createNewEntry}
                        updateEntry={this.props.updateEntry}
                        handleRemove={this.handleRemove}
                        getProjectColor={this.getProjectColor}
                        daysToShowLength={daysToShowLength}
                        isFetching={isFetchingEntries}
                        isUpdating={isUpdating}
                        isRunning={isRunning}
                        isFetching={isFetching}
                        setState={this.setStateBind} /> :
                    <WelcomeScreen />}
            </List>
            {Object.keys(mappedItems).length > 9 &&
                <Container_center>
                    {isFetchingEntries ? <Spinner /> :
                        ((!isFetchingEntries && allEntriesFetched) ? <p>No data available for this period</p> :
                            <Button_load onClick={this.appendEntries}>Load more entries</Button_load>)}
                </Container_center>}
        </Container>);
    }
}

const mapStateToProps = ({ user, global, timer }) => ({
    userData: user.userData,
    entries: user.entries,
    projects: user.projects,
    isRunning: global.isRunning,
    isFetching:global.isFetching,
    weekTimer: timer.weekTimer,
    daysToShowLength: global.daysToShowLength,
    allEntriesFetched: global.allEntriesFetched,
    mappedItems: user.mappedItems
});

const mapDispatchToProps = dispatch => ({
    fetchEntries: (uid, begin, end, dCount) => dispatch(actions.user.fetchEntries(uid, begin, end, dCount)),
    createNewEntry: (uid, obj) => dispatch(actions.entry.createNewEntry(uid, obj)),
    removeEntry: (v, v2) => dispatch(actions.entry.removeEntry(v, v2)),
    updateEntry: (userid, runningEntry, obj) => dispatch(actions.entry.updateEntry(userid, runningEntry, obj)),
    setWeekTimer: obj => dispatch(actions.timer.setWeekTimer(obj)),
    setDaysToShowLength: num => dispatch(actions.global.setDaysToShowLength(num)),
    setAllEntriesFetched: bool => dispatch(actions.global.setAllEntriesFetched(bool))
});

export default connect(mapStateToProps, mapDispatchToProps)(Timer); 