import React from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import moment from 'moment';
import momentDFPlugin from 'moment-duration-format';
momentDFPlugin(moment);

import getMappedItems from '../selectors/getmappeditems';

import TimeEntry from '../components/timentry';
import ProjectDropdown from '../components/projectdropdown';
import EntryDropdown from '../components/entrydropdown';
import Icon from '../components/icon';

const Item_table = styled.table`
    width:100%;
`;

const Itembody_body = styled.ul`
`;

const List_item = styled.li`
    background-color:white;
    border-bottom:1px solid #ddd;
    border-top:1px solid #eee;
    margin-bottom:2rem;
`;

const Item_link = styled.a`
    color:#ccc;
    cursor:pointer;
`;

const Item_link_relative = styled.span`
    cursor:pointer;
    position:relative;
    opacity:0;
    pointer-events:none;
`;

const Item_link_toggle = styled(Item_link) `
    opacity:0;
    pointer-events:none;
`;

const Item_toggle = styled.span`
    display:none;
`;

const Item_project = styled.span`
    color:${({ color }) => color === 'white' ? 'black' : color};
`;

const Item_header = styled.header`
    display:flex;
    justify-content:space-between;
    align-items:center;    
    padding:1rem;
    margin:auto .3rem;
    margin-right:2.2rem;
`;

const Itembody_header = styled.header`
    display:flex;
    justify-content:space-between;
    padding:1rem 0;
    margin:auto .3rem;
    margin-left:1.5rem;
    height:4rem;
    align-items:center;
    &:hover ${Item_link_toggle} {
        opacity:1;
        pointer-events:all;
    }
    &:hover ${Item_link_relative} {
        opacity:1;
        pointer-events:all;    
    }
    &:hover ${Item_toggle} {
        display:block;
    }
`;

const Time_container_inner = styled.div`
    display:flex;
    flex-direction:column;
    align-items:flex-end;
    justify-content:center;
    width:12rem;
`;

const Time_container_outer = styled.div`
    display:flex;
    align-items:center;
`;

const Color_indicator = styled.span`
    display: inline-block;
    width:.6rem;
    height:.6rem;
    background-color: ${props => props.color};
    border-radius: 50%;
    margin-right: .5rem;
`;

const GroupEntries_length = styled.span`
    cursor:pointer;
    margin-right: .5rem;
    color: ${({ color }) => color};
`;

const Input_task = styled.input`
    border: none;
    outline-color: transparent;
`;

class EntriesTable extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            filteredItems: {},
            mappedTasks: {}
            // taskEntries:
        }

        this.today = moment().format('ddd, Do MMM');
        this.yesterday = moment().add(-1, 'days').format('ddd, Do MMM');
    }

    componentDidMount() {
        // if (this.props.userData) {
        const { mappedItems } = this.props;
        const filteredItems = this.getFilteredItems(mappedItems);
        const mappedTasks = this.getMappedTasks(mappedItems);
        this.setState({ filteredItems, mappedTasks });
    }

    componentWillReceiveProps(nextProps) {
        if (JSON.stringify(nextProps.mappedItems) !== JSON.stringify(this.props.mappedItems)) {
            const filteredItems = Object.assign({},
                this.getFilteredItems(nextProps.mappedItems), this.state.filteredItems);
            const mappedTasks = this.getMappedTasks(nextProps.mappedItems);
            this.setState({ filteredItems, mappedTasks });
        }
    }

    toggleEntries = (idx, item) => {
        const { filteredItems } = this.state;

        filteredItems[idx][item] = !filteredItems[idx][item];
        this.setState({ filteredItems });
    }

    startNewEntry = description => {
        const { handleClick, setTopbarDescription } = this.props;

        handleClick('description', description);
        setTopbarDescription(description);
    }

    getTotalDayCount = array => {
        const total = array.reduce((acc, item) =>
            acc + moment.duration(item.stop - item.start), 0);

        return moment.duration(total).format('h:mm:ss', { stopTrim: "hh mm ss" });
    }

    getDayField = item => {
        return (this.today === item) ? 'Today' :
            ((item === this.yesterday) ? 'Yesterday' : item.slice(0, 7) + item.slice(9));
    }

    changeDescriptionMultiple = (desc, array, idx) => {
        const { mappedItems, changeDescription } = this.props;
        const arrId = array.map(itm => itm.id);

        changeDescription(desc, JSON.stringify(arrId), null, true);

        const filteredItems = this.state.filteredItems.slice();
        filteredItems[idx][desc] = filteredItems[idx][array[0].description];
        this.setState({ filteredItems });
    }

    getStopStartTime = items => {
        const startFormat = moment(items[items.length - 1].start).format('hh:mm A');
        const stopFormat = moment(items[0].stop).format('hh:mm A');

        return `${startFormat} - ${stopFormat} `;
    }

    getProjectColor = name => {
        const { userData } = this.props;

        return name.length ?
            '#' + userData.projects[userData.projects.map(itm => itm.name)
                .findIndex(itm => itm === name)].color :
            'white';
    }

    getTaskEntries = (idx) => {
        const { handleRemove, changeDescription } = this.props;
        const { filteredItems, mappedTasks } = this.state;

        const startNewEntryProxy = currentItem => this.startNewEntry(currentItem[0].description);

        const removeCondition = currentItem => currentItem.length === 1 ?
            currentItem[0].id : currentItem.map(itm => itm.id);

        const onBlurCondition = (e, currentItem) => currentItem.length === 1 ?
            changeDescription(e.target.value, currentItem[0].id) :
            this.changeDescriptionMultiple(e.target.value, currentItem, idx);

        return Object.keys(mappedTasks[idx]).map((item, i) => {
            const projectName = item.split('\n')[0].trim();
            const projectDescription = item.split('\n')[1].trim();
            const currentItem = mappedTasks[idx][item];

            return (<section key={item}>
                <Itembody_header key={item}>
                    <div>
                        {currentItem.length > 1 &&
                            <GroupEntries_length color={filteredItems[idx][item] ? 'green' : 'black'}
                                onClick={() => this.toggleEntries(idx, item)} >
                                {currentItem.length}
                            </GroupEntries_length>}
                        <Input_task type="text" placeholder="Add description"
                            defaultValue={projectDescription === '$empty#' ? '' : projectDescription}
                            onBlur={e => onBlurCondition(e, currentItem)} />
                        {projectName &&
                            <Item_link onClick={() => alert('ok')}>
                                <Color_indicator color={this.getProjectColor(projectName)} />
                                <Item_project color={this.getProjectColor(projectName)}>
                                    {projectName}
                                </Item_project>
                            </Item_link>}
                        {!projectName && <Item_link_toggle onClick={() => alert('ok')}>
                            <Icon name="folder" />
                        </Item_link_toggle>}
                    </div>
                    <Time_container_outer>
                        <Item_toggle><Icon name="attach_money" /></Item_toggle>
                        <Time_container_inner onClick={() => this.toggleEntries(idx, item)}>
                            <span> {this.getTotalDayCount(currentItem)}</span>
                            <Item_toggle>{this.getStopStartTime(currentItem)}</Item_toggle>
                        </Time_container_inner>
                        <Item_link_toggle onClick={() => startNewEntryProxy(currentItem)} >
                            <Icon name="play_arrow" fill="#ccc" />
                        </Item_link_toggle>
                        <EntryDropdown Item_link_relative={Item_link_relative}
                            handleRemove={() => handleRemove(removeCondition(currentItem))} />
                    </Time_container_outer>
                </Itembody_header>
                <Itembody_body>
                    {(filteredItems[idx][item] && currentItem.length > 1) &&
                        this.getSingleEntries(currentItem)}
                </Itembody_body>
            </section>)
        });
    }

    getSingleEntries = entries => {
        return Object.keys(entries).map((item, i) =>
            <TimeEntry key={item} item={entries[i]} projects={this.props.userData.projects}
                setTopbarDescription={this.props.setTopbarDescription}
                startNewEntry={this.startNewEntry}
                changeDescription={this.props.changeDescription}
                handleRemove={this.props.handleRemove}
            />);
    }

    getMappedTasks = mappedItems => {
        const reduceFn = (acc, itm) => {
            const keyStr = `${itm.project} \n${itm.description || '$empty#'} `;

            if (!acc[keyStr]) acc[keyStr] = [];
            acc[keyStr].push(itm);
            return acc;
        }
        return Object.keys(mappedItems)
            .map(itm =>
                mappedItems[itm].reduce(reduceFn, {})
            );
    }

    getFilteredItems = mappedItems => {
        return Object.keys(mappedItems)
            .map(itm => mappedItems[itm]
                .reduce((acc, itm) => {
                    const keyStr = `${itm.project} \n${itm.description || '$empty#'} `;

                    if (!acc[keyStr]) acc[keyStr] = false;
                    return acc;
                }, {}));
    }

    render() {
        const { mappedItems, toggleEntries, changeDescription } = this.props;
        const { filteredItems } = this.state;
        console.log('RENDERING ENTRIES TABLE');

        if (!Object.keys(filteredItems).length) return (<p>Loading...</p>);

        return Object.keys(mappedItems).map((itm, idx) =>
            <List_item key={itm}>
                <Item_header>
                    <span style={{ fontWeight: '700' }}>{this.getDayField(itm)}</span>
                    <span>{this.getTotalDayCount(mappedItems[itm])}</span>
                </Item_header>
                {this.getTaskEntries(idx)}
            </List_item >);
    }
}

const mapStateToProps = ({ userData }) => ({
    userData,
    mappedItems: getMappedItems(userData)
});

export default connect(mapStateToProps, null)(EntriesTable);