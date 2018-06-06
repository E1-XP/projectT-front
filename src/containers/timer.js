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
import Icon from '../components/icon';

import getFilteredMappedItems from '../selectors/getfilteredmappeditems';

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
            isFetchingEntries: false
        }
    }

    componentDidMount() {
        const { userData, setWeekTimer, setAllEntriesFetched, allEntriesFetched, daysToShowLength,
            setDaysToShowLength } = this.props;

        if (daysToShowLength !== 10) setDaysToShowLength(10);

        if (allEntriesFetched) setAllEntriesFetched(false);

        if (userData.entries.length) setWeekTimer(this.getWeekTimeComposed(userData.entries));
        //this.props.createNewEntry('5aed60ebf94ad304ec8fc130', { start: 1528030517000 });
    }

    shouldComponentUpdate(nextP, nextS) {
        const { mappedItems, daysToShowLength, allEntriesFetched, weekTimer } = this.props;
        const { isFetchingEntries } = this.state;

        if (allEntriesFetched !== nextP.allEntriesFetched) return true;

        if (isFetchingEntries === nextS.isFetchingEntries &&
            JSON.stringify(nextP.mappedItems) === JSON.stringify(mappedItems)) return false;

        if (nextP.mappedItems !== mappedItems || nextP.daysToShowLength !== daysToShowLength ||
            nextP.weekTimer !== weekTimer || nextS.isFetchingEntries !== isFetchingEntries) return true;

        return false;
    }

    componentWillReceiveProps(nextProps) {
        const { userData, setWeekTimer, isRunning, setAllEntriesFetched, allEntriesFetched, mappedItems } = this.props;
        const { isFetchingEntries } = this.state;

        if (allEntriesFetched && Object.keys(nextProps.mappedItems).length !== Object.keys(mappedItems).length) {
            setAllEntriesFetched(false);
        }

        if ((isRunning && !nextProps.isRunning && nextProps.mappedItems !== mappedItems) ||
            (!nextProps.isRunning && nextProps.mappedItems !== mappedItems)) {
            setWeekTimer(this.getWeekTimeComposed(nextProps.userData.entries));
        }

        if (nextProps.allEntriesFetched && isFetchingEntries) this.setState({ isFetchingEntries: false });

        else if (nextProps.userData.entries.length !== userData.entries.length && isFetchingEntries) {
            this.setState({ isFetchingEntries: false });
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
        const { userData } = this.props;
        if (name === 'noproject') return '#bbb';

        if (name.length) {
            const item = userData.projects[userData.projects.map(itm => itm.name).findIndex(itm => itm === name)]
            if (item) return '#' + item.color;
        }
        return 'white';
    }

    appendEntries = () => {
        const { userData, setDaysToShowLength, daysToShowLength } = this.props;
        const startAt = moment(userData.entries[userData.entries.length - 1].start).dayOfYear();

        this.setState({ isFetchingEntries: true });
        this.props.fetchEntries(userData._id, startAt)
            .then(() => setDaysToShowLength(daysToShowLength + 10));
    }

    render() {
        const { userData, isRunning, allEntriesFetched, mappedItems, daysToShowLength, createNewEntry } = this.props;
        const { isFetchingEntries } = this.state;

        if (!userData.entries) return (<p>Loading...</p>);

        return (<Container>
            <Topbar onRef={ref => this.topBarRef = ref} getWeekTime={this.getWeekTimeComposed} />
            <WeekCounter isRunning={isRunning} getProjectColor={this.getProjectColor} />
            <List>
                {userData.entries.length ?
                    <EntriesTable
                        setTopbarDescription={this.passRefToChild}
                        createNewEntry={createNewEntry}
                        updateEntry={this.props.updateEntry}
                        handleRemove={this.handleRemove}
                        getProjectColor={this.getProjectColor}
                        isFetching={isFetchingEntries} /> :
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

const mapStateToProps = ({ user, entry, global, timer }) => ({
    userData: user.userData,
    isRunning: global.isRunning,
    weekTimer: timer.weekTimer,
    daysToShowLength: global.daysToShowLength,
    allEntriesFetched: global.allEntriesFetched,
    mappedItems: getFilteredMappedItems({ global, user })
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