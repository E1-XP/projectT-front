import React from 'react';
import styled from 'styled-components';

import moment from 'moment';
import momentDFPlugin from 'moment-duration-format';
momentDFPlugin(moment);

import { DateRange } from 'react-date-range';

const Period_selector = styled.nav`
    width:100%;
    display:flex;
    flex-wrap:wrap;
    background-color:#bbb;
    padding:.8rem;
`;

const Period_item = styled.a`
    flex:1 1 25%;
    cursor: pointer;
    text-align:center;
    padding:.5rem;
    &:hover{
     color:red;
    }
`;

export default class ModalCalendar extends React.Component {
    handleSelect = range => {
        console.log(range);
        const periodStart = moment(range.startDate).startOf('day');
        const periodStop = moment(range.endDate).endOf('day');
        const periodType = this.getPeriodType(periodStart, periodStop);
        const periodReadable = this.props.setReadableHeading(periodType, periodStart, periodStop);

        const state = {
            periodStart,
            periodStop,
            periodReadable,
            periodType
        }
        if (periodType === 'custom') state.customPeriodLength = periodStop.clone().diff(periodStart, 'days');

        this.props.setState(state);
    }

    getPeriodType = (periodStart, periodStop) => {
        const length = periodStop.diff(periodStart, 'days');

        const isValidMonth = () => periodStart.clone().format('D') === '1' &&
            periodStop.clone().format('D') === periodStart.clone().endOf('month').format('D');

        console.log(length);
        if (!length) return 'days';
        else if (length === 6) return 'weeks';
        else if (length < 7) return 'custom';
        else if (isValidMonth()) return 'months';
        else return 'custom';
        //console.log(periodStart.clone().format('D'),
        // periodStop.clone().format('D'), periodStart.clone().startOf('month').format('D'), 'BIGTEST');
        //1 30 1
    }

    setToday = () => {
        const { setState, closeModal } = this.props;

        setState({
            periodStart: moment().startOf('day'),
            periodStop: moment().endOf('day'),
            periodReadable: 'Today',
            periodType: 'days'
        });
        closeModal();
    }

    setYesterday = () => {
        const { setState, closeModal } = this.props;

        setState({
            periodStart: moment().startOf('day').subtract(1, 'd'),
            periodStop: moment().endOf('day').subtract(1, 'd'),
            periodReadable: 'Yesterday',
            periodType: 'days'
        });
        closeModal();
    }

    setThisWeek = () => {
        const { setState, closeModal } = this.props;

        setState({
            periodStart: moment().startOf('isoWeek'),
            periodStop: moment().startOf('isoWeek').add(6, 'd'),
            periodReadable: 'This Week',
            periodType: 'weeks'
        });
        closeModal();
    }

    setLastWeek = () => {
        const { setState, closeModal } = this.props;

        setState({
            periodStart: moment().startOf('isoWeek').subtract(7, 'd'),
            periodStop: moment().startOf('isoWeek').subtract(1, 'd'),
            periodReadable: 'Last Week',
            periodType: 'weeks'
        });
        closeModal();
    }

    setThisMonth = () => {
        const { setState, closeModal } = this.props;

        setState({
            periodStart: moment().startOf('month'),
            periodStop: moment().endOf('month'),
            periodReadable: 'This Month',
            periodType: 'months'
        });
        closeModal();
    }

    setLastMonth = () => {
        const { setState, closeModal } = this.props;

        setState({
            periodStart: moment().startOf('month').subtract(1, 'M'),
            periodStop: moment().endOf('month').subtract(1, 'M'),
            periodReadable: 'Last Month',
            periodType: 'months'
        });
        closeModal();
    }

    setThisYear = () => {
        const { setState, closeModal } = this.props;

        setState({
            periodStart: moment().startOf('year'),
            periodStop: moment().endOf('year'),
            periodReadable: 'This Year',
            periodType: 'years'
        });
        closeModal();
    }

    setLastYear = () => {
        const { setState, closeModal } = this.props;

        setState({
            periodStart: moment().startOf('year').subtract(1, 'y'),
            periodStop: moment().endOf('year').subtract(1, 'y'),
            periodReadable: 'Last Year',
            periodType: 'years'
        });
        closeModal();
    }

    render() {
        const { closeModal, periodStart, periodStop } = this.props;

        const dateRangeTheme = {
            Calendar: {
                background: 'transparent',
                color: '#95a5a6',
            },
            MonthAndYear: {
                background: '#ddd'
            },
            MonthButton: {
                background: 'transparent'
            },
            MonthArrowPrev: {
                color: '#333',
                fontSize: '26px',
                cursor: 'pointer'
            },
            MonthArrowNext: {
                color: '#333',
                fontSize: '26px',
                cursor: 'pointer'
            },
            Weekday: {
                backgroundColor: '#ddd'
            },
            DaySelected: {
                background: 'green'
            },
            DayActive: {
                background: '#4bc800',
                boxShadow: 'none'
            },
            DayInRange: {
                background: '#4bc800',
                color: '#fff'
            },
            DayHover: {
                background: '#ddd',
                color: '#7f8c8d'
            }
        };

        return (
            <div>
                <DateRange
                    startDate={periodStart} endDate={periodStop}
                    firstDayOfWeek={1} onInit={this.handleSelect}
                    onChange={this.handleSelect} theme={dateRangeTheme} />
                <Period_selector>
                    <Period_item onClick={this.setToday}>Today</Period_item>
                    <Period_item onClick={this.setThisWeek}>This Week</Period_item>
                    <Period_item onClick={this.setThisMonth}>This Month</Period_item>
                    <Period_item onClick={this.setThisYear}>This Year</Period_item>
                    <Period_item onClick={this.setYesterday}>Yesterday</Period_item>
                    <Period_item onClick={this.setLastWeek}>Last Week</Period_item>
                    <Period_item onClick={this.setLastMonth}>Last Month</Period_item>
                    <Period_item onClick={this.setLastYear}>Last Year</Period_item>
                </Period_selector>
            </div>
        );
    }
}