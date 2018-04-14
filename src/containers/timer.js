import React from 'react';
import { connect } from 'react-redux';
import * as actions from '../actions';

import styled from 'styled-components';
import moment from 'moment';
import momentDFPlugin from 'moment-duration-format';
momentDFPlugin(moment);

import Topbar from '../containers/topbar';
import EntriesTable from '../components/entriestable';
import Icon from '../components/icon';

const Navigation_list = styled.ul`
`;

const List_item = styled.li`
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

const Week_counter = styled.div`
    border:1px solid blue;
    margin-top:61px;
    padding:1rem;
`;

class Timer extends React.Component {
    constructor() {
        super();

        // this.state = {
        //     weekTime: 0,
        //     weekTimeNum: 0
        // }
    }

    componentDidMount() {
        const { userData, setWeekTimer } = this.props;
        if (userData.entries.length) {
            setWeekTimer(this.getWeekTimeComposed(userData.entries));
        }
    }
    // const { userData, isRunning } = this.props;
    // if (userData.entries.length) {
    //     const weekTime = this.getWeekTimeFormatted(this.getWeekTime(userData.entries));
    //     this.setState({ weekTime });
    // }
    // if (isRunning) this.

    componentWillReceiveProps(nextProps) {
        const { userData, setWeekTimer, isRunning } = this.props;
        const condition = nextProps.userData.entries.length !== userData.entries.length;

        if (!isRunning) setWeekTimer(this.getWeekTimeComposed(userData.entries));//this.setState({ weekTime: this.getWeekTime(nextProps.userData.entries) });
        // if (nextProps.isRunning) {
        //     window.weekInterval = setInterval(this.runWeekTimer, 400);}
        // if (nextProps.isRunning === false && window.weekInterval) clearInterval(window.weekInterval);
    }

    setMappedItems = () => {
        const { userData } = this.props;

        const getReadable = item => moment(item.start).format('ddd, DD MMM');
        const getDuration = item => moment.duration(moment(Number(item.stop)).diff(item.start)).format('h:mm:ss', { stopTrim: "hh mm ss" });
        const reduceItems = (acc, item) => {
            acc[item.readable] ? acc[item.readable].push(item) : acc[item.readable] = [item];
            return acc;
        }

        return userData.entries
            .filter(item => item.stop !== undefined)
            .sort((a, b) => b.start - a.start)
            .map((item, i) => ({
                start: item.start,
                stop: item.stop,
                description: item.description ? item.description : '',
                project: item.project ? item.project : '',
                billable: item.billable,
                userId: item.userId,
                id: item._id,
                readable: getReadable(item),
                duration: getDuration(item),
                visible: false
            })).reduce(reduceItems, {});
    }

    handleRemove = id => {
        const { removeEntry } = this.props;
        const { userData } = this.props;
        console.log(id);
        removeEntry(userData._id, id);
    }

    changeDescription = (description, runningEntry, previousDescription, enabLeEmptyInput = false) => {
        const { userData, updateEntry } = this.props;
        if (!runningEntry) runningEntry = this.props.runningEntry;
        console.log('change desc', description);

        if (((description.trim() !== previousDescription) && runningEntry) || (enabLeEmptyInput && runningEntry)) {
            updateEntry(userData._id, runningEntry, { description: description.trim() });
        }
    }

    getWeekTime = entries => {
        const thisWeekStart = moment().startOf('isoWeek');

        const total = entries.filter(item => item.stop !== undefined)
            .filter(item => item.start > thisWeekStart.valueOf())
            .reduce((acc, item) => acc + moment.duration(moment(Number(item.stop)).diff(item.start)).valueOf(), 0);

        return total;
    }

    getWeekTimeFormatted = time => {
        return moment.duration(time).format('h:mm:ss', { stopTrim: "hh mm ss" });
    }

    getWeekTimeComposed = entries => {
        return this.getWeekTimeFormatted(this.getWeekTime(entries));
    }

    // getWeekTimeIfIsRunning = () => {
    //     //return moment.duration(this.state.WeekTime;
    //     //const timeCalculation = () =>;
    //     // window.weekInterval = setInterval(timeCalculation, 500);
    // }

    runWeekTimer = () => {
        this.setState(prevState => ({ weekTime: this.getWeekTimeFormatted(moment.duration(prevState.weekTime).add(1, 's')) }));
    }

    handleClick = (param, pval) => {
        const { userData, createNewEntry, toggleTimer, setRunningEntryDescription } = this.props;

        createNewEntry(userData._id, param, pval);
        setRunningEntryDescription(pval);
        toggleTimer(true);
    }

    passRefToChild = str => {
        this.topBarRef.setStateWithRef(str);
    }

    render() {
        const { userData, isRunning, weekTimer } = this.props;

        if (!userData.entries) return (<p>Loading...</p>);

        const mappedItems = this.setMappedItems();

        return (
            <div>
                <Topbar onRef={ref => this.topBarRef = ref} getWeekTime={this.getWeekTimeComposed} />
                <Week_counter>
                    This week:<span>{weekTimer}</span>
                </Week_counter>
                <Navigation_list>
                    {(userData.entries && userData.entries.length) ?
                        <EntriesTable mappedItems={mappedItems} userData={userData}
                            setTopbarDescription={this.passRefToChild}
                            handleClick={this.handleClick}
                            handleRemove={this.handleRemove}
                            changeDescription={this.changeDescription} /> :
                        <List_item>Add you first task to begin</List_item>}
                </Navigation_list>
            </div>
        );
    };
}

const mapStateToProps = ({ userData, runningEntry, runningEntryDescription, isRunning, weekTimer }) => ({
    userData,
    runningEntry,
    runningEntryDescription,
    isRunning,
    weekTimer
});

const mapDispatchToProps = dispatch => ({
    setUserData: v => dispatch(actions.setUserData(v)),
    setRunningEntryDescription: v => dispatch(actions.setRunningEntryDescription(v)),
    createNewEntry: (userid, param, pval) => dispatch(actions.createNewEntry(userid, param, pval)),
    removeEntry: (v, v2) => dispatch(actions.removeEntry(v, v2)),
    updateEntry: (userid, runningEntry, obj) => dispatch(actions.updateEntry(userid, runningEntry, obj)),
    toggleTimer: bool => dispatch(actions.toggleTimer(bool)),
    setWeekTimer: str => dispatch(actions.setWeekTimer(str))
});

export default connect(mapStateToProps, mapDispatchToProps)(Timer); 