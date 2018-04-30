import React from 'react';
import { connect } from 'react-redux';
import * as actions from '../actions';

import styled from 'styled-components';
import moment from 'moment';
import momentDFPlugin from 'moment-duration-format';
momentDFPlugin(moment);

import getMappedItems from '../selectors/getmappeditems';

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
    background-color:red;
    border:none;
    color:white;        
    padding:1rem;
    cursor:pointer;
`;

class Timer extends React.Component {
    componentDidMount() {
        const { userData, setWeekTimer } = this.props;
        if (userData.entries.length) {
            setWeekTimer(this.getWeekTimeComposed(userData.entries));
        }
    }

    componentWillReceiveProps(nextProps) {
        const { userData, setWeekTimer, isRunning } = this.props;
        if (!isRunning) setWeekTimer(this.getWeekTimeComposed(userData.entries));
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

    render() {
        const { userData, isRunning, mappedItems } = this.props;
        console.log('RENDERING TIMER PAGE');
        if (!userData.entries) return (<p>Loading...</p>);

        return (<Container>
            <Topbar onRef={ref => this.topBarRef = ref} getWeekTime={this.getWeekTimeComposed} />
            <WeekCounter isRunning={isRunning} />
            <List>
                {userData.entries.length ?
                    <EntriesTable
                        setTopbarDescription={this.passRefToChild}
                        handleRemove={this.handleRemove}
                        updateEntry={this.props.updateEntry} /> :
                    <List_item>Add you first task to begin</List_item>}
            </List>
            {userData.entries.length > 9 && <Container_center>
                <Button_load>Load more entries</Button_load>
            </Container_center>}
        </Container>);
    };
}

const mapStateToProps = ({ user, entry, global }) => ({
    userData: user.userData,
    mappedItems: getMappedItems(user.userData),
    runningEntry: entry.runningEntry,
    runningEntryDescription: entry.runningEntryDescription,
    isRunning: global.isRunning
});

const mapDispatchToProps = dispatch => ({
    removeEntry: (v, v2) => dispatch(actions.entry.removeEntry(v, v2)),
    updateEntry: (userid, runningEntry, obj) => dispatch(actions.entry.updateEntry(userid, runningEntry, obj)),
    setWeekTimer: str => dispatch(actions.timer.setWeekTimer(str))
});

export default connect(mapStateToProps, mapDispatchToProps)(Timer); 