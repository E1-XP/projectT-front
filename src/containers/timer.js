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

const Container = styled.div`
    background-color:rgb(250,250,250);
    padding-bottom:3rem;
    margin-right:12px;
    position:relative;
`;

const Container_center = styled.div`
    display:flex;
    justify-content:center;
    padding:1rem;
    margin:2rem;
`;

const List = styled.ul`
`;

const List_item = styled.li`
    padding:1rem;
    text-align:center;
`;

const Item_row = styled.td`
    text-align:center;
    padding:.5rem;
    border:1px solid #ddd;
    display:flex;
    justify-content:space-around;
`;

const Item_link = styled.a`
    color:#ccc;
    cursor:pointer;
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
        const { mappedItems, entries, setWeekTimer, setAllEntriesFetched, allEntriesFetched,
            daysToShowLength, setDaysToShowLength } = this.props;

        // const mappedTasks = this.getMappedTasks(mappedItems);
        const filteredItems = this.getFilteredItems();
        console.log('items', 'tasks', mappedItems);

        this.setState({ filteredItems });

        if (daysToShowLength !== 10) setDaysToShowLength(10);

        if (allEntriesFetched) setAllEntriesFetched(false);

        if (entries.length) setWeekTimer(this.getWeekTimeComposed(entries));
        //this.props.createNewEntry('5aed60ebf94ad304ec8fc130', { start: 1528030517000 });
    }

    shouldComponentUpdate(nextP, nextS) {
        const { daysToShowLength, allEntriesFetched, weekTimer } = this.props;
        const { isFetchingEntries, mappedTasks, filteredItems } = this.state;

        if (!this.props.isRunning && nextP.isRunning) return false;

        if (filteredItems !== nextS.filteredItems) return true;

        if (this.props.isRunning && nextP.weekTimer !== weekTimer) return false;

        if (allEntriesFetched !== nextP.allEntriesFetched) return true;

        if (isFetchingEntries === nextS.isFetchingEntries && nextS.mappedTasks === mappedTasks) return false;

        if (nextS.mappedTasks !== mappedTasks || nextP.daysToShowLength !== daysToShowLength ||
            nextP.weekTimer !== weekTimer || nextS.isFetchingEntries !== isFetchingEntries) return true;

        return false;
    }

    UNSAFE_componentWillUpdate(nextProps) {
        Object.keys(nextProps)
            .map(key => nextProps[key] !== this.props[key] && console.log(key + ' changed'));
    }

    componentDidUpdate() {
        console.log('tiemr updated');
    }

    componentWillReceiveProps(nextProps) {
        const { entries, setWeekTimer, isRunning, setAllEntriesFetched, allEntriesFetched, mappedItems } = this.props;
        const { isFetchingEntries } = this.state;

        if (allEntriesFetched && Object.keys(nextProps.mappedItems).length !== Object.keys(mappedItems).length) {
            setAllEntriesFetched(false);
        }

        if ((isRunning && !nextProps.isRunning && nextProps.mappedItems !== mappedItems) ||
            (!nextProps.isRunning && nextProps.mappedItems !== mappedItems)) {
            setWeekTimer(this.getWeekTimeComposed(nextProps.entries));
        }

        if (nextProps.allEntriesFetched && isFetchingEntries) this.setState({ isFetchingEntries: false });

        else if (nextProps.entries.length !== entries.length && isFetchingEntries) {
            this.setState({ isFetchingEntries: false });
        }

        if (nextProps.mappedItems !== mappedItems) {
            const filteredItems = Object.assign({}, this.getFilteredItems(nextProps.mappedItems), this.state.filteredItems);

            this.setState({ filteredItems });
        }
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
        return this.getWeekTimeFormatted(this.getWeekTime(entries));
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
        const { userData, entries, setDaysToShowLength, daysToShowLength } = this.props;
        const startAt = moment(entries[entries.length - 1].start).dayOfYear();

        this.setState({ isFetchingEntries: true });
        this.props.fetchEntries(userData._id, startAt)
            .then(() => setDaysToShowLength(daysToShowLength + 10));
    }

    render() {
        const { userData, entries, projects, isRunning, allEntriesFetched, mappedItems, daysToShowLength,
            createNewEntry } = this.props;
        const { isFetchingEntries, filteredItems, mappedTasks, isUpdating } = this.state;

        if (!entries) return (<p>Loading...</p>);

        return (<Container>
            <Topbar onRef={ref => this.topBarRef = ref} getWeekTime={this.getWeekTimeComposed} />
            <WeekCounter isRunning={isRunning} getProjectColor={this.getProjectColor} />
            <List>
                {entries.length ?
                    <EntriesTable
                        userData={userData}
                        projects={projects}
                        mappedItems={mappedItems}
                        mappedTasks={mappedTasks}
                        filteredItems={filteredItems}
                        setTopbarDescription={this.passRefToChild}
                        createNewEntry={createNewEntry}
                        updateEntry={this.props.updateEntry}
                        handleRemove={this.handleRemove}
                        getProjectColor={this.getProjectColor}
                        daysToShowLength={daysToShowLength}
                        isFetching={isFetchingEntries}
                        isUpdating={isUpdating}
                        isRunning={isRunning}
                        setState={this.setStateBind} /> :
                    <List_item>Add you first task to begin</List_item>}
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
    weekTimer: timer.weekTimer,
    daysToShowLength: global.daysToShowLength,
    allEntriesFetched: global.allEntriesFetched,
    mappedItems: user.mappedItems
});

const mapDispatchToProps = dispatch => ({
    fetchEntries: (uid, begin, end) => dispatch(actions.user.fetchEntries(uid, begin, end)),
    createNewEntry: (uid, obj) => dispatch(actions.entry.createNewEntry(uid, obj)),
    removeEntry: (v, v2) => dispatch(actions.entry.removeEntry(v, v2)),
    updateEntry: (userid, runningEntry, obj) => dispatch(actions.entry.updateEntry(userid, runningEntry, obj)),
    setWeekTimer: str => dispatch(actions.timer.setWeekTimer(str)),
    setDaysToShowLength: num => dispatch(actions.global.setDaysToShowLength(num)),
    setAllEntriesFetched: bool => dispatch(actions.global.setAllEntriesFetched(bool))
});

export default connect(mapStateToProps, mapDispatchToProps)(Timer); 