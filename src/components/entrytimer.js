import React from 'react';
import styled from 'styled-components';

import moment from 'moment';
import momentDFPlugin from 'moment-duration-format';
momentDFPlugin(moment);

import EntryDropdown from './entrydropdown';
import Icon from './icon';

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

const Item_link = styled.a`
    color:#ccc;
    cursor:pointer;
`;


export default class EntryTimer extends React.Component {
    shouldComponentUpdate(nextProps, nextState) {
        const { currentItem } = this.props;

        if (nextProps.currentItem !== currentItem ||
            nextProps.currentItem.length !== nextProps.currentItem.length) return true;
        else return false;
    }

    startNewEntryProxy = currentItem => {
        this.props.startNewEntry(currentItem[0]);
    }

    shouldRemoveOneOrMultiple = currentItem => {
        return currentItem.length === 1 ? currentItem[0].id : currentItem.map(itm => itm.id);
    }

    getStopStartTime = items => {
        const startFormat = moment(items[items.length - 1].start).format('hh:mm A');
        const stopFormat = moment(items[0].stop).format('hh:mm A');

        return `${startFormat} - ${stopFormat} `;
    }

    setBillableMultiPropxy = () => {
        const { currentItem, setBillableMulti } = this.props;
        setBillableMulti(currentItem);
    }

    toggleEntriesProxy = () => {
        const { toggleEntries, idx, item } = this.props;
        toggleEntries(idx, item);
    }

    handleRemoveProxy = () => {
        const { currentItem } = this.props;
        handleRemove(this.shouldRemoveOneOrMultiple(currentItem));
    }

    proxiedStartNewEntry = () => {
        const { currentItem } = this.props;
        this.startNewEntryProxy(currentItem);
    }

    render() {
        const { setBillableMulti, currentItem, idx, item, handleRemove, getTotalDayCount,
            isEveryItemBillable, Item_toggle, Item_link_toggle, Item_link_relative } = this.props;

        console.log('rendering entimer');

        return (
            <Time_container_outer>
                <Item_link_toggle onClick={this.setBillableMultiPropxy}>
                    <Icon name="attach_money" fill={isEveryItemBillable(currentItem) ? 'green' : '#bbb'} />
                </Item_link_toggle>
                <Time_container_inner onClick={this.toggleEntriesProxy}>
                    <span> {getTotalDayCount(currentItem)}</span>
                    <Item_toggle>{this.getStopStartTime(currentItem)}</Item_toggle>
                </Time_container_inner>
                <Item_link_toggle onClick={this.proxiedStartNewEntry} >
                    <Icon name="play_arrow" fill="#ccc" />
                </Item_link_toggle>
                <EntryDropdown Item_link_relative={Item_link_relative}
                    handleRemove={this.handleRemoveProxy} />
            </Time_container_outer>
        );
    }
}