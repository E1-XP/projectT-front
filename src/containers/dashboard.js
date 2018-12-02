import React from 'react';
import { connect } from 'react-redux';

import moment from 'moment';
import momentDFPlugin from 'moment-duration-format';
momentDFPlugin(moment);

import * as actions from '../actions';

import DashboardComponent from '../components/dashboard';

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

        this.monthLabels = ['January', 'February', 'March', 'April', 'May', 'June', 'July',
            'August', 'September', 'October', 'November', 'December'];

        this.setStateBind = this.setState.bind(this);
    }

    setStateProxy = state => {
        this.setState({ tmpState: state });
    }

    getTotalDayCount = object => {
        const reduceInner = (acc, itm) => acc += moment.duration(itm.stop - itm.start).asSeconds();

        const toSeconds = Object.keys(object).reduce((acc, itm) => acc += object[itm].reduce(reduceInner, 0), 0);

        return moment.duration(toSeconds, 'seconds').format('h:mm', { stopTrim: "hh mm" });
    }

    getPeriodTimeArr = () => {
        const { mappedItems } = this.props;
        const { periodStart, periodStop } = this.state;

        const generateDayLabels = () => Array(periodStop.diff(periodStart, 'days') + 1).fill(null)
            .map((_, i) => ({
                unix: moment(periodStart).add(i, 'd').valueOf(),
                readable: moment(periodStart).add(i, 'd').format('ddd, Do MMM')
            }));

        const reduceInner = (acc, itm) => acc += itm.stop - itm.start;
        const getDayTimeSum = key => Object.keys(mappedItems[key])
            .reduce((acc, itm) => acc += mappedItems[key][itm].reduce(reduceInner, 0), 0);

        const getDayObj = (itm, dataFlag = false) => ({
            readable: itm.readable,
            duration: dataFlag ? this.getTotalDayCount(mappedItems[itm.readable]) : `0:00`,
            time: dataFlag ? getDayTimeSum(itm.readable) : 0,
            week: moment(itm.unix).isoWeek()
        });

        return generateDayLabels().map(itm => mappedItems[itm.readable] ? getDayObj(itm, true) : getDayObj(itm));
    }

    getYearMonthsArr = () => {
        const { entries } = this.props;
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

    appendEntries = () => {
        const { userData, entries, fetchEntries, setDaysToShowLength } = this.props;
        const { periodStart, periodStop } = this.state;

        if (!entries.length) return this.setIsLoading(false);

        const startAt = moment(entries[entries.length - 1].start).startOf('day').valueOf();
        const endAt = moment(periodStart).clone().startOf('day').valueOf();

        console.log(periodStart.valueOf(), 'periodstart');
        const shouldGetMoreData = startAt > endAt // if data not in store

        this.setState({ isLoading: true, shouldUpdate: false });
        setDaysToShowLength(false);

        console.log('start,end', startAt, endAt);
        return new Promise((res, rej) => {
            if (shouldGetMoreData) fetchEntries(userData._id, startAt, endAt)
                .then(() => {
                    this.setState({ isLoading: false, shouldUpdate: true });
                    res();
                });
            else {
                setTimeout(() => {
                    res();
                    this.setIsLoading(false);
                }, 300);
            }
        });
    }

    setIsLoading = bool => {
        this.setState({ shouldUpdate: false });
        setTimeout(() => this.setState({ isLoading: bool, shouldUpdate: true }), 300);
    }

    render() {
        const { userData, entries, projects, allEntriesFetched, mappedItems } = this.props;
        const { periodReadable, periodStart, periodStop, periodType, isCalendarOpen, customPeriodLength, isLoading,
            shouldUpdate } = this.state;

        return (<DashboardComponent periodReadable={periodReadable} periodType={periodType} state={this.state} setState={this.setStateBind}
            subtractPeriodState={this.subtractPeriodState} addPeriodState={this.addPeriodState} getTotalWeekTime={this.getTotalWeekTime}
            isCalendarOpen={isCalendarOpen} periodStart={periodStart} periodStop={periodStop} getYearMonthsArr={this.getYearMonthsArr}
            setReadableHeading={this.setReadableHeading} customPeriodLength={customPeriodLength} appendEntries={this.appendEntries}
            setStateProxy={this.setStateProxy} getPeriodTimeArr={this.getPeriodTimeArr} allEntriesFetched={allEntriesFetched} projects={projects}
            userData={userData} entries={entries} setIsLoading={this.setIsLoading} isLoading={isLoading} shouldUpdate={shouldUpdate} />);
    }
}

const mapStateToProps = ({ user, global }) => ({
    userData: user.userData,
    entries: user.entries,
    projects: user.projects,
    mappedItems: user.mappedItems,
    daysToShowLength: global.daysToShowLength,
    allEntriesFetched: global.allEntriesFetched
});

const mapDispatchToProps = dispatch => ({
    fetchEntries: (uid, begin, end) => dispatch(actions.user.fetchEntries(uid, begin, end)),
    setDaysToShowLength: num => dispatch(actions.global.setDaysToShowLength(num))
});

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);