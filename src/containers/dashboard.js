import React from 'react';
import { connect } from 'react-redux';

import styled from 'styled-components';
import moment from 'moment';
import momentDFPlugin from 'moment-duration-format';
momentDFPlugin(moment);

import * as actions from '../actions';
import getMappedItems from '../selectors/getmappeditems';

import Modal from 'react-modal';
import Icon from '../components/icon';
import ModalCalendar from '../components/modalcalendar';
import PeriodTimeChart from '../components/periodchart';
import ProjectChart from '../components/projectchart';
import ProjectsCounter from '../components/projectscounter';

const Wrapper = styled.div`
    width:100%;
    max-width:1200px;
    margin:1rem auto;
    display:flex;
    justify-content:space-between;
    padding:1rem;
    padding-top:0;
`;

const Header = styled.header`
    display:flex;
    justify-content:space-between;
`;

const Heading = styled.h2`
    font-size:34px;
    font-weight:500;
`;

const Heading_section = styled.h3`
    font-size:24px;
    font-weight:700;
    display:flex;
    position:relative;
`;

const Chart_Section = styled.section`
    flex-basis:72%;
    width:0;
    min-width:530px;
    margin-right:1rem;
`;

const Item_link = styled.a`
    color:#333;
    cursor:pointer;
    display:flex;
    align-items:center;
`;

const Item_link_border = styled(Item_link) `
    border-right:1px solid #ddd;
    & > span {
        width:1.5rem;
        color:#bbb;
    }
    &:hover > span {
        color:#333;
    }
`;

const Item_link_hover = styled(Item_link) `
    color:#bbb;
    &:hover{
     color:#333;  
    }
`;

const Period_selection = styled.div`
    display:flex;  
`;

const Screen_blocker = styled.div`
     display: block;
        position:fixed;
        top:0;
        left:0;
        background-color:transparent;
        width:100%;
        height:100%;
        z-index:50;
`;

const modalStyle = {
    overlay: { backgroundColor: 'transparent' },
    content: {
        width: '600px', margin: '0 auto', height: '398px', padding: '0', position: 'absolute',
        top: '50px', left: 'initial', right: '185px'
    }
};

class Dashboard extends React.Component {
    constructor() {
        super();

        this.state = {
            periodStart: moment().startOf('isoWeek'),
            periodStop: moment().endOf('isoWeek'),
            periodReadable: 'This Week',
            periodType: 'weeks',
            customPeriodLength: 0,
            isCalendarOpen: false,
            tmpState: {},
            isLoading: false,
            shouldUpdate: true
        }

        this.todayReadable = moment().format('DD MMMM');
        this.yesterdayReadable = moment().subtract(1, 'd').format('DD MMMM');

        this.thisWeekReadable = `${moment().startOf('isoWeek').format('Do MMM')} ` +
            `- ${moment().startOf('isoWeek').endOf('isoWeek').format('Do MMM')}`;
        this.lastWeekReadable = `${moment().startOf('isoWeek').subtract(1, 'w').format('Do MMM')} ` +
            `- ${moment().startOf('isoWeek').subtract(1, 'w').endOf('isoWeek').format('Do MMM')}`;

        this.thisMonthReadable = moment().format('MMMM YYYY');
        this.lastMonthReadable = moment().subtract(1, 'M').format('MMMM YYYY');

        this.thisYearReadable = `${moment().format('YYYY')}`;
        this.lastYearReadable = `${moment().subtract(1, 'years').format('YYYY')}`;

        this.monthLabels = ['January', 'February', 'March', 'April', 'May', 'Juni', 'July',
            'August', 'September', 'October', 'November', 'December'];
    }

    setStateProxy = state => {
        this.setState({ tmpState: state });
    }

    getTotalDayCount = array => {
        const toSeconds = array.reduce((acc, item) =>
            acc += moment.duration(Number(item.stop) - item.start).asSeconds(), 0);

        return moment.duration(toSeconds, 'seconds').format('h:mm', { stopTrim: "hh mm" });
    }

    getPeriodTimeArr = () => {
        const { mappedItems } = this.props;
        const { periodStart, periodStop } = this.state;

        const getReadable = itm => moment(itm.start).format('ddd, Do MMM');
        const getDuration = itm => moment(itm).format('h:mm:ss', { stopTrim: "hh mm ss" });

        const getUnix = itm => moment.duration(moment(itm.stop).diff(itm.start)).valueOf();

        const generateDayLabels = () => Array(periodStop.diff(periodStart, 'days') + 1).fill(null)
            .map((itm, i) => ({
                unix: moment(periodStart).add(i, 'd').valueOf(),
                readable: moment(periodStart).add(i, 'd').format('ddd, Do MMM')
            }));

        const getDayTimeSum = itm => mappedItems[itm].reduce((acc, itm) => acc += (itm.stop - itm.start), 0);

        const getDayObj = (itm, dataFlag = false) => ({
            readable: itm.readable,
            duration: dataFlag ? this.getTotalDayCount(mappedItems[itm.readable]) : `0:00`,
            time: dataFlag ? getDayTimeSum(itm.readable) : 0,
            week: moment(itm.unix).isoWeek()
        });

        return generateDayLabels().map(itm => mappedItems[itm.readable] ? getDayObj(itm, true) : getDayObj(itm));
    }

    getYearMonthsArr = () => {
        const { entries } = this.props.userData;
        const { periodStart, periodStop } = this.state;

        const baseObj = this.monthLabels.reduce((acc, itm) => {
            acc[itm] = [];
            return acc;
        }, {});

        const sortByMonth = (acc, itm) => {
            const itemMonth = moment(itm.start).format('MMMM');
            acc[itemMonth].push(itm);
            return acc;
        };

        const entriesByMonth = entries
            .filter(itm => itm.stop !== undefined && itm.start > periodStart.valueOf() &&
                itm.stop < moment(periodStop).valueOf())
            .reduce(sortByMonth, baseObj);

        const getMonthSum = arrOfEntries => arrOfEntries.reduce((acc, itm) => acc += (itm.stop - itm.start), 0);

        const getDuration = name => {
            return moment.duration(getMonthSum(entriesByMonth[name])).format('h:mm:ss', { stopTrim: "hh mm ss" });
        };

        //return array of month sums
        return Object.keys(entriesByMonth).map(itm => ({
            readable: itm,
            duration: getDuration(itm),
            time: getMonthSum(entriesByMonth[itm])
        }));
    }

    getTotalWeekTime = entries => {
        const { periodStart, periodStop } = this.state;

        const total = entries
            .filter(itm => itm.stop !== undefined && itm.start >= periodStart.valueOf() &&
                itm.stop <= moment(periodStop).valueOf())
            .reduce((acc, item) => acc + moment.duration(moment(Number(item.stop)).diff(item.start)).valueOf(), 0);

        return moment.duration(total).format("h[h]m[m]:s[s]", { largest: 1 });
    }

    addPeriodState = () => {
        const { periodStart, periodStop, periodType, customPeriodLength } = this.state;

        const periodTypeNew = periodType === 'weeks' ? 'isoWeek' : periodType.slice(0, periodType.length - 1);

        const periodStartNew = periodType !== 'custom' ? periodStart.clone().add(1, periodType) :
            periodStop.clone().add(1, 'days');

        const periodStopNew = periodType !== 'custom' ? periodStartNew.clone().endOf(periodTypeNew) :
            periodStartNew.clone().add(customPeriodLength, 'days');

        const periodReadable = this.setReadableHeading(periodType, periodStartNew, periodStopNew);

        this.setState({ periodStart: periodStartNew, periodReadable, periodStop: periodStopNew, isLoading: true });
    }

    subtractPeriodState = () => {
        const { periodStart, periodStop, periodType, customPeriodLength } = this.state;

        const periodTypeNew = periodType === 'weeks' ? 'isoWeek' : periodType.slice(0, periodType.length - 1);

        const periodStartNew = periodType !== 'custom' ? periodStart.clone().subtract(1, periodType) :
            periodStart.clone().subtract(customPeriodLength + 1, 'days');

        const periodStopNew = periodType !== 'custom' ? periodStartNew.clone().endOf(periodTypeNew) :
            periodStart.clone().subtract(1, 'days');

        const periodReadable = this.setReadableHeading(periodType, periodStartNew, periodStopNew);

        this.setState({ periodStart: periodStartNew, periodReadable, periodStop: periodStopNew, isLoading: true });
    }

    setReadableHeading = (periodType, periodStartNew, periodStopNew) => {
        let periodReadable;

        switch (periodType) {
            case 'days': {
                periodReadable = `${periodStartNew.format('DD MMMM')}`;

                //convert each weekday to day format
                const startOfWeek = moment().startOf('isoWeek');
                const endOfWeek = moment().endOf('isoWeek');
                const days = { Mon: null, Tue: null, Wed: null, Thu: null, Fri: null, Sat: null, Sun: null };
                const daysKeys = Object.keys(days);
                days.Mon = startOfWeek.format('DD MMMM');

                let i = 1;
                while (i < 7) {
                    days[daysKeys[i]] = startOfWeek.add(1, 'd').format('DD MMMM');
                    i += 1;
                }

                if (periodReadable === this.todayReadable) return periodReadable = 'Today';
                else if (periodReadable === this.yesterdayReadable) return periodReadable = 'Yesterday';

                Object.keys(days).map(itm => days[itm] === periodReadable ? periodReadable = itm : null);
            } break;

            case 'weeks': {
                periodReadable = `${periodStartNew.format('Do MMM')} - ${periodStopNew.format('Do MMM')}`;

                if (periodReadable === this.thisWeekReadable) periodReadable = 'This Week';
                else if (periodReadable === this.lastWeekReadable) periodReadable = 'Last Week';
            } break;

            case 'months': {
                periodReadable = periodStartNew.format('MMMM YYYY');

                if (periodReadable === this.thisMonthReadable) return periodReadable = 'This Month';
                else if (periodReadable === this.lastMonthReadable) return periodReadable = 'Last Month';

                if (periodReadable.split(' ')[1] === moment().format('YYYY')) periodReadable = periodReadable.split(' ')[0];

            } break;

            case 'years': {
                periodReadable = `${periodStartNew.format('YYYY')}`;

                if (periodReadable === this.thisYearReadable) periodReadable = 'This Year';
                else if (periodReadable === this.lastYearReadable) periodReadable = 'Last Year';
            } break;

            case 'custom': {
                periodReadable = `${periodStartNew.format('Do MMM')} - ${periodStopNew.format('Do MMM')}`;
            } break;
        }

        return periodReadable;
    }

    openCalendar = () => {
        this.setState({ isCalendarOpen: true }, () => document.addEventListener('click', this.closeCalendar));
    }

    closeCalendar = (e, stateObj = null) => {
        const tmpState = stateObj || this.state.tmpState;

        if (!e || !this.dropdown.contains(e.target)) {
            const state = { isCalendarOpen: false, ...tmpState, tmpState: {} };
            this.setState(state, () => document.removeEventListener('click', this.closeCalendar));
        }
    }

    appendEntries = () => {
        const { userData, setAllEntriesFetched, fetchEntries } = this.props;
        const { periodStart, periodStop } = this.state;

        const startAt = moment(userData.entries[userData.entries.length - 1].start).dayOfYear();
        const endAt = moment(periodStart).dayOfYear();

        this.setState({ isLoading: true, shouldUpdate: false });

        return new Promise((res, rej) => {
            if (startAt > endAt) fetchEntries(userData._id, startAt, endAt).then(() => {
                this.setState({ isLoading: false, shouldUpdate: true });
                res();
            });
            else res();
        });
    }

    setIsLoading = bool => {
        this.setState({ shouldUpdate: false });
        setTimeout(() => this.setState({ isLoading: bool, shouldUpdate: true }), 300);
    }

    render() {
        const { userData, allEntriesFetched } = this.props;
        const { mappedItems, periodReadable, periodStart, periodStop, periodType, isCalendarOpen,
            customPeriodLength, isLoading, shouldUpdate } = this.state;

        if (!Object.keys(userData).length && !Object.keys(mappedItems).length) return (<p>Loading...</p>);

        return (<Wrapper>
            <Chart_Section>
                <Header>
                    <Heading>Dashboard</Heading>
                    <Heading_section >
                        <Item_link_border onClick={this.openCalendar}>
                            {periodReadable}
                            <Icon name={isCalendarOpen ? 'close' : 'arrow_drop_down'}
                                fill={isCalendarOpen ? '#333' : '#bbb'}
                                size={isCalendarOpen ? '18px' : '24px'} />
                        </Item_link_border>
                        <Period_selection>
                            <Item_link_hover onClick={this.subtractPeriodState}>
                                <Icon name="keyboard_arrow_left" />
                            </Item_link_hover>
                            <Item_link_hover onClick={this.addPeriodState}>
                                <Icon name="keyboard_arrow_right" />
                            </Item_link_hover>
                        </Period_selection>

                        {isCalendarOpen && <Screen_blocker />}
                        <div ref={node => this.dropdown = node}>
                            <ModalCalendar periodStart={periodStart} periodStop={periodStop} closeModal={this.closeCalendar}
                                isOpen={isCalendarOpen} setReadableHeading={this.setReadableHeading} setState={this.setStateProxy} />
                        </div>

                    </Heading_section>
                </Header>
                <PeriodTimeChart data={this.getPeriodTimeArr()} getYearData={this.getYearMonthsArr} isLoading={isLoading}
                    customPeriodLength={customPeriodLength} periodType={periodType} isOpen={isCalendarOpen} shouldUpdate={shouldUpdate}
                    getMoreEntries={this.appendEntries} allEntriesFetched={allEntriesFetched} setIsLoading={this.setIsLoading} />
                <ProjectChart userData={userData} totalWeekTime={this.getTotalWeekTime} isLoading={isLoading}
                    periodStart={periodStart} periodStop={periodStop} isOpen={isCalendarOpen} />
            </Chart_Section>
            <ProjectsCounter userData={userData} />
        </Wrapper>);
    }
}

const mapStateToProps = ({ user, global }) => ({
    userData: user.userData,
    mappedItems: getMappedItems(user.userData),
    allEntriesFetched: global.allEntriesFetched
});

const mapDispatchToProps = dispatch => ({
    fetchEntries: (uid, begin, end) => dispatch(actions.user.fetchEntries(uid, begin, end))
});

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);