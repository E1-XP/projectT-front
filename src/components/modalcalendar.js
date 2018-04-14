import React from 'react';
import styled from 'styled-components';

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

const ModalCalendar = props => {
    const { setToday, setThisWeek, setThisMonth, setThisYear, setYesterday, setLastWeek, setLastMonth, setLastYear,
        handleSelect, periodStart, periodStop } = props;

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
                firstDayOfWeek={1} onInit={handleSelect}
                onChange={handleSelect} theme={dateRangeTheme} />
            <Period_selector>
                <Period_item onClick={setToday}>Today</Period_item>
                <Period_item onClick={setThisWeek}>This Week</Period_item>
                <Period_item onClick={setThisMonth}>This Month</Period_item>
                <Period_item onClick={setThisYear}>This Year</Period_item>
                <Period_item onClick={setYesterday}>Yesterday</Period_item>
                <Period_item onClick={setLastWeek}>Last Week</Period_item>
                <Period_item onClick={setLastMonth}>Last Month</Period_item>
                <Period_item onClick={setLastYear}>Last Year</Period_item>
            </Period_selector>
        </div>
    );
}

export default ModalCalendar;