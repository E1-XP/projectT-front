import React from 'react';
import styled from 'styled-components';
import moment from 'moment';
import momentDFPlugin from 'moment-duration-format';
momentDFPlugin(moment);

import TimeEntry from './timentry';
import Icon from '../components/icon';

const Item_table = styled.table`
    width:100%;
`;

const Item_header = styled.header`
    display:flex;
    justify-content:space-between;
    align-items:center;    
    padding:1rem;
    margin:auto 2rem;    
`;

const Itembody_header = styled.header`
    display:flex;
    justify-content:space-between;
    padding:1rem;
    margin:auto 2rem;
    align-items:center;
`;

const Itembody_body = styled.ul`
`;

const List_item = styled.li`
`;

const Item_link = styled.a`
    color:#ccc;
    cursor:pointer;
`;

class EntriesTable extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            filteredItems: {}
        }
    }

    componentDidMount() {
        // if (this.props.userData) {
        const { filteredItems } = this.buildUIState();
        this.setState({ filteredItems });
    }

    toggleEntries(idx, item) {
        const { filteredItems } = this.state;

        filteredItems[idx][item] = !filteredItems[idx][item];
        this.setState({ filteredItems });
    }

    startNewEntry(description) {
        const { handleClick, setTopbarDescription } = this.props;

        handleClick('description', description);
        setTopbarDescription(description);
    }

    getTotalDayCount(array) {
        const toSeconds = array.reduce((acc, item) =>
            acc += moment.duration(Number(item.stop) - item.start).asSeconds(), 0);

        return moment.duration(toSeconds, 'seconds').format('h:mm:ss', { stopTrim: "hh mm ss" });
    }

    getDayField(item) {
        const today = moment().format('ddd, DD MMM');
        const yesterday = moment().add(-1, 'days').format('ddd, DD MMM');

        return (today === item) ? 'Today' : ((item === yesterday) ? 'Yesterday' : item);
    }

    changeDescriptionMultiple(desc, array, idx) {
        const { mappedItems, changeDescription } = this.props;
        const arrId = array.map(itm => itm.id);

        changeDescription(desc, JSON.stringify(arrId), null, true);

        const filteredItems = this.state.filteredItems.slice();
        filteredItems[idx][desc] = filteredItems[idx][array[0].description];
        this.setState({ filteredItems });
    }

    getStopStartTime(items) {
        const startFormat = moment(items[items.length - 1].start).format('hh:mm A');
        const stopFormat = moment(Number(items[0].stop)).format('hh:mm A');

        return `${startFormat} - ${stopFormat}`;
    }

    getTaskEntries(mappedTasks, idx) {
        const { handleRemove, changeDescription } = this.props;
        const { filteredItems } = this.state;

        //   console.log('TASKS', mappedTasks[idx]);
        return Object.keys(mappedTasks[idx]).map((item, i) =>
            (<section key={item}>
                <Itembody_header key={item}>
                    <span style={{ color: filteredItems[idx][item] ? 'green' : 'black' }}
                        onClick={() => this.toggleEntries(idx, item)} >
                        {mappedTasks[idx][item].length === 1 ? null : mappedTasks[idx][item].length}
                    </span>
                    <input type="text" placeholder="add description"
                        defaultValue={item === 'empty' ? '' : item}
                        onBlur={e => mappedTasks[idx][item].length === 1 ?
                            changeDescription(e.target.value, mappedTasks[idx][item][0].id) :
                            this.changeDescriptionMultiple(e.target.value, mappedTasks[idx][item], idx)} />
                    <span>no project</span>
                    <span>{this.getStopStartTime(mappedTasks[idx][item])}</span>
                    <span><Icon name="attach_money" /></span>
                    <span onClick={() => this.toggleEntries(idx, item)} >{this.getTotalDayCount(mappedTasks[idx][item])}</span>
                    <Item_link onClick={() => handleRemove(mappedTasks[idx][item].length === 1 ?
                        mappedTasks[idx][item][0].id : mappedTasks[idx][item].map(itm => itm.id))} >
                        <Icon name="delete" style={{ color: '#ccc' }} />
                    </Item_link>
                    <Item_link onClick={() => this.startNewEntry(mappedTasks[idx][item][0].description)} >
                        <Icon name="play_arrow" style={{ color: '#ccc' }} />
                    </Item_link>
                </Itembody_header>
                <Itembody_body>
                    {(filteredItems[idx][item] && mappedTasks[idx][item].length > 1) ?
                        this.getSingleEntries(mappedTasks[idx][item]) : null}
                </Itembody_body>
            </section>));
    }

    getSingleEntries(mappedTasks) {
        return Object.keys(mappedTasks).map((item, i) =>
            <TimeEntry key={item} item={mappedTasks[i]} userData={this.props.userData}
                setTopbarDescription={this.props.setTopbarDescription}
                startNewEntry={this.startNewEntry.bind(this)}
                changeDescription={this.props.changeDescription}
                handleRemove={this.props.handleRemove}
            />);
    }

    buildUIState() {
        const { mappedItems } = this.props;

        const mappedTasks = Object.keys(mappedItems).map(item =>
            mappedItems[item].reduce((acc, item) => {
                if (!acc[item.description || 'empty']) acc[item.description || 'empty'] = [];
                acc[item.description || 'empty'].push(item);
                return acc;
            }, {}));

        const filteredItems = Object.keys(mappedItems).map(item =>
            mappedItems[item].reduce((acc, item) => {
                if (!acc[item.description || 'empty']) acc[item.description || 'empty'] = false;
                return acc;
            }, {}));

        return { filteredItems, mappedTasks };
    }

    render() {
        const { mappedItems, toggleEntries, changeDescription } = this.props;
        const { filteredItems } = this.state;

        if (!Object.keys(filteredItems).length) return (<p>Loading...</p>);

        const { mappedTasks } = this.buildUIState();
        console.log('MTASKS', mappedTasks);
        return Object.keys(mappedItems).map((item, i) =>
            <List_item key={item}>
                <Item_header>
                    <span style={{ fontWeight: '700' }}>{this.getDayField(item)}</span>
                    <span>{this.getTotalDayCount(mappedItems[item])}</span>
                </Item_header>
                {this.getTaskEntries(mappedTasks, i)}
            </List_item >);
    }
}

export default EntriesTable;