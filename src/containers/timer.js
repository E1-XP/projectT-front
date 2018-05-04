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

const Container = styled.div`
    background-color:rgb(250,250,250);
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
        const { userData, setWeekTimer } = this.props;

        if (userData.entries.length) {
            setWeekTimer(this.getWeekTimeComposed(userData.entries));
        }
    }

    componentWillReceiveProps(nextProps) {
        const { userData, setWeekTimer, isRunning } = this.props;
        const { isFetchingEntries } = this.state;

        if (!isRunning) setWeekTimer(this.getWeekTimeComposed(userData.entries));
        if (nextProps.allEntriesFetched && isFetchingEntries) this.setState({ isFetchingEntries: false });
        if (nextProps.userData.entries.length !== userData.entries.length && isFetchingEntries) this.setState({ isFetchingEntries: false });
    }

    handleRemove = id => {
        const { removeEntry } = this.props;
        const { userData } = this.props;
        console.log(id);
        removeEntry(userData._id, id);
    }

    getWeekTime = entries => {
        const thisWeekStart = moment().startOf('isoWeek');

        const total = entries
            .reduce((acc, itm) => {
                return (itm.stop !== undefined && itm.start > thisWeekStart.valueOf()) ?
                    acc + moment.duration(moment(itm.stop).diff(itm.start)).valueOf() :
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

    appendEntries = () => {
        const { userData } = this.props;
        const startAt = moment(userData.entries[userData.entries.length - 1].start).dayOfYear();

        this.setState({ isFetchingEntries: true });
        this.props.fetchEntries(userData._id, startAt);
    }

    render() {
        const { userData, isRunning, allEntriesFetched } = this.props;

        if (!userData.entries) return (<p>Loading...</p>);

        return (<Container>
            <Topbar onRef={ref => this.topBarRef = ref} getWeekTime={this.getWeekTimeComposed} />
            <WeekCounter isRunning={isRunning} userData={userData} />
            <List>
                {userData.entries.length ?
                    <EntriesTable
                        setTopbarDescription={this.passRefToChild}
                        handleRemove={this.handleRemove}
                        updateEntry={this.props.updateEntry} /> :
                    <List_item>Add you first task to begin</List_item>}
            </List>
            {userData.entries.length > 9 &&
                <Container_center>
                    {allEntriesFetched && <p>No data available for this period</p>}
                    {!this.state.isFetchingEntries && !allEntriesFetched && <Button_load onClick={this.appendEntries}>
                        Load more entries
                    </Button_load>}
                    {this.state.isFetchingEntries && <Spinner />}
                </Container_center>}
        </Container>);
    }
}

const mapStateToProps = ({ user, entry, global }) => ({
    userData: user.userData,
    runningEntry: entry.runningEntry,
    runningEntryDescription: entry.runningEntryDescription,
    isRunning: global.isRunning,
    allEntriesFetched: global.allEntriesFetched
});

const mapDispatchToProps = dispatch => ({
    fetchEntries: (uid, begin, end) => dispatch(actions.user.fetchEntries(uid, begin, end)),
    removeEntry: (v, v2) => dispatch(actions.entry.removeEntry(v, v2)),
    updateEntry: (userid, runningEntry, obj) => dispatch(actions.entry.updateEntry(userid, runningEntry, obj)),
    setWeekTimer: str => dispatch(actions.timer.setWeekTimer(str))
});

export default connect(mapStateToProps, mapDispatchToProps)(Timer); 