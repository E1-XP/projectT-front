import React from 'react';
import { connect } from 'react-redux';
import * as actions from '../actions';

import styled from 'styled-components';
import moment from 'moment';
import momentDFPlugin from 'moment-duration-format';
momentDFPlugin(moment);

import Topbar from '../components/topbar';
import Icon from '../components/icon';

const Navigation_list = styled.ul`
    margin-top:61px;
`;

const Navigation_item = styled.li`
   
`;

const Item_table = styled.table`
    width:100%;
`;

const Item_header = styled.th`
    text-align: center;
    color: #555;
    padding:1rem;
    border:1px solid #eee;
    display:flex;
    justify-content:space-around;
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

class Timer extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            filteredItems: {}
        }
    }
    // componentDidUpdate() {
    //     if (Object.keys(this.state.mappedItems).length) this.setMappedItems();
    // }
    componentDidMount() {
        if (this.props.userData) {
            const filteredItems = Object.keys(this.setMappedItems()).map(item => false);
        }
    }
    // componentWillUpdate() {
    //    
    // }
    // componentWillReceiveProps() {
    //     if (Object.keys(this.state.mappedItems).length) this.setMappedItems();
    // }
    setMappedItems() {
        const { userData } = this.props;

        const getReadable = item => moment(item.start).format('ddd, DD MMM');
        const getDuration = item => moment.duration(moment(Number(item.stop)).diff(item.start)).format('h:mm:ss', { stopTrim: "hh mm ss" });
        const reduceItems = (acc, item) => {
            acc[item.readable] ? acc[item.readable].push(item) : acc[item.readable] = [item];
            return acc;
        }

        const mappedItems = userData.entries.filter(item => item.stop !== undefined)
            .sort((a, b) => b.start - a.start)
            .map((item, i) => ({
                start: item.start,
                stop: item.stop,
                userId: item.userId,
                id: item._id,
                readable: getReadable(item),
                duration: getDuration(item),
                visible: false
            })).reduce(reduceItems, {});

        //this.setState({ mappedItems });
        return mappedItems;
    }

    toggleEntries(item) {
        const { filteredItems } = this.state;

        filteredItems[item] = !filteredItems[item];
        this.setState({ filteredItems });
        // const mappedItems = Object.assign({}, this.state.mappedItems);
        // mappedItems[item].map(item => item.visible = !item.visible);
        // this.setState({ mappedItems });
    }

    handleClick() {
        const { isRunning, setIsRunning, setUserData, createNewEntry, setTimer, userData } = this.props;
        const start = moment().format();

        if (!isRunning) {
            setIsRunning(true);

            createNewEntry(userData._id);

            window.interval = setInterval(() => setTimer(moment.duration(moment().diff(start)).format('h:mm:ss', { stopTrim: "hh mm ss" }))
                , 500);
        }
        else this.stopTimer();
        //make a post request with starting/stopping timestamp
    }

    stopTimer() {
        const { userData, runningEntry, setTimer, setIsRunning, updateEntryStopField } = this.props;
        const now = moment().valueOf();

        clearInterval(window.interval);
        setIsRunning(false);
        setTimer('0:00:00');

        updateEntryStopField(userData._id, runningEntry, now);

        //REFRESH HERE      
    }

    handleRemove(id) {
        const { removeEntry } = this.props;
        const { userData } = this.props;

        removeEntry(userData._id, id);
    }

    setPreviouslyRunningTimer(dataSrc) {
        const { setRunningEntry, setTimer, setIsRunning } = this.props;

        if (dataSrc.entries.filter(item => item.stop === undefined).length) {
            const runEntry = dataSrc.entries.filter(item => item.stop === undefined)[0];
            setRunningEntry(runEntry._id);

            const start = moment(runEntry.start).format();

            clearInterval(window.interval);
            window.interval = setInterval(() => {
                setIsRunning(true);
                setTimer(moment.duration(moment().diff(start)).format('h:mm:ss', { stopTrim: "hh mm ss" }))
            }, 500);
        }
    }

    getEntries(item, mappedItems) {

        return mappedItems[item].map((item2, i) =>
            (<tr key={i}><Item_row key={item2.id}>
                <input type="text" placeholder="add description" />
                <span>no project</span>
                <span>{item2.duration}</span>
                <Item_link onClick={() => this.handleRemove(item2.id)} >
                    <Icon name="delete" style={{ color: '#ccc' }} />
                </Item_link>
            </Item_row>
            </tr>));
    }

    render() {
        const { stopTimer, timer, isRunning, userData } = this.props;
        const { filteredItems } = this.state;

        if (!userData.entries) return (<p>Loading...</p>);

        const mappedItems = this.setMappedItems();

        const getTotalDayCount = item => {
            const toSeconds = mappedItems[item].reduce((acc, item) => acc += moment.duration(item.duration).asSeconds(), 0);
            return moment.duration(toSeconds, 'seconds').format();
        }

        const DOMItems = () => Object.keys(mappedItems).map((item, i) =>
            <Navigation_item key={i}>
                <Item_table>
                    <tbody>
                        <tr>
                            <Item_header>
                                <span onClick={() => this.toggleEntries(item)}> {mappedItems[item].length}</span>
                                <input type="text" placeholder="add description" />
                                <span>no project</span>
                                <span style={{ fontWeight: '700' }}>{item}</span>
                                <span>{getTotalDayCount(item)}</span>
                            </Item_header>
                        </tr>
                        {filteredItems[item] ? this.getEntries(item, mappedItems) : null}
                    </tbody>
                </Item_table>
            </Navigation_item >);

        return (
            <div>
                <Topbar timer={timer} isRunning={isRunning} handleClick={this.handleClick.bind(this)} stopTimer={stopTimer} />
                <Navigation_list>
                    {(userData.entries && userData.entries.length) ? DOMItems() :
                        <Navigation_item >Add you first task to begin</Navigation_item>}
                </Navigation_list>
            </div>
        );
    };
}

const mapStateToProps = ({ userData, isRunning, timer, runningEntry }) => ({
    userData,
    isRunning,
    timer,
    runningEntry
});

const mapDispatchToProps = dispatch => ({
    setIsRunning: v => dispatch(actions.setIsRunning(v)),
    setRunningEntry: v => dispatch(actions.setRunningEntry(v)),
    setUserData: v => dispatch(actions.setUserData(v)),
    setTimer: v => dispatch(actions.setTimer(v)),
    createNewEntry: v => dispatch(actions.createNewEntry(v)),
    removeEntry: (v, v2) => dispatch(actions.removeEntry(v, v2)),
    updateEntryStopField: (userid, runningEntry, stopTime) => dispatch(actions.updateEntryStopField(userid, runningEntry, stopTime))
});

export default connect(mapStateToProps, mapDispatchToProps)(Timer); 