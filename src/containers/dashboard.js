import React from 'react';
import { connect } from 'react-redux';

import styled from 'styled-components';
import moment from 'moment';
import momentDFPlugin from 'moment-duration-format';
momentDFPlugin(moment);

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
    border:1px solid rebeccapurple;
    display:flex;
`;

const Header = styled.header`
    display:flex;
    justify-content:space-between;
    margin:auto 2rem;
`;

const Heading = styled.h2`
    
;`

const Chart_Section = styled.section`
    flex:1 1 65%;
`;

const Item_link = styled.a`
    color:#333;
    cursor:pointer;
    display:flex;
    align-items:center;
`;

const Period_selection = styled.div`
    display:flex;  
`;

class Dashboard extends React.Component {
    constructor() {
        super();

        this.state = {
            mappedItems: {},
            periodStart: moment().startOf('isoWeek'),
            periodStop: moment().startOf('isoWeek').add(6, 'days'),
            periodReadable: 'This Week',
            periodType: 'weeks',
            isModalOpen: false
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
    }

    componentDidMount() {
        if (this.props.userData) this.setState({ mappedItems: this.getMappedItems() });
    }

    getTotalDayCount = array => {
        const toSeconds = array.reduce((acc, item) =>
            acc += moment.duration(Number(item.stop) - item.start).asSeconds(), 0);

        return moment.duration(toSeconds, 'seconds').format('h:mm', { stopTrim: "hh mm" });
    }

    getPeriodTimeArr = () => {
        const { entries } = this.props.userData;
        const { mappedItems, periodStart, periodStop } = this.state;

        const getReadable = itm => moment(itm.start).format('ddd, Do MMM');
        const getDuration = itm => moment(itm).format('h:mm:ss', { stopTrim: "hh mm ss" });

        const getUnix = itm => moment.duration(moment(itm.stop).diff(itm.start)).valueOf();

        const generateDayLabels = () => Array(periodStop.diff(periodStart, 'days') + 1).fill(null)
            .map((itm, i) => moment(periodStart).add(i, 'd').format('ddd, Do MMM'));

        const getDayTimeSum = itm => mappedItems[itm].reduce((acc, itm) => acc += (itm.stop - itm.start), 0);

        const getDayObj = (itm, dataFlag) => ({
            readable: itm,
            duration: dataFlag ? this.getTotalDayCount(mappedItems[itm]) : `0:00`,
            time: dataFlag ? getDayTimeSum(itm) : 0
        });

        return generateDayLabels().map(itm => mappedItems[itm] ? getDayObj(itm, true) : getDayObj(itm));
    }

    getYearMonthsArr = () => {
        const { entries } = this.props.userData;
        const { periodStart, periodStop } = this.state;

        const monthLabels = ['January', 'February', 'March', 'April', 'May', 'Juni', 'July',
            'August', 'September', 'October', 'November', 'December'];

        const baseObj = monthLabels.reduce((acc, itm) => {
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

    getMappedItems = () => {
        const { userData } = this.props;

        const getReadable = itm => moment(itm.start).format('ddd, Do MMM');

        const reduceItems = (acc, itm) => {
            acc[itm.readable] ? acc[itm.readable].push(itm) : acc[itm.readable] = [itm];
            return acc;
        }

        return userData.entries
            .filter(itm => itm.stop !== undefined)
            .sort((a, b) => b.start - a.start)
            .map((itm, i) => ({
                start: itm.start,
                stop: itm.stop,
                readable: getReadable(itm)
            })).reduce(reduceItems, {});
    }

    getTotalWeekTime = entries => {
        const { periodStart, periodStop } = this.state;

        const total = entries
            .filter(itm => itm.stop !== undefined && itm.start > periodStart.valueOf() &&
                itm.stop < moment(periodStop).valueOf())
            .reduce((acc, item) => acc + moment.duration(moment(Number(item.stop)).diff(item.start)).valueOf(), 0);

        return moment.duration(total).format("h[h]m[m]:s[s]", { largest: 1 });
    }

    addPeriodState = () => {
        const { periodStart, periodStop, periodType } = this.state;

        const periodTypeNew = periodType === 'weeks' ? 'isoWeek' : periodType.slice(0, periodType.length - 1);
        const periodStartNew = periodStart.clone().add(1, periodType);
        const periodStopNew = periodStartNew.clone().endOf(periodTypeNew);

        const periodReadable = this.setReadableHeading(periodType, periodStartNew, periodStopNew);

        this.setState({ periodStart: periodStartNew, periodReadable, periodStop: periodStopNew });
    }

    subtractPeriodState = () => {
        const { periodStart, periodStop, periodType } = this.state;

        const periodTypeNew = periodType === 'weeks' ? 'isoWeek' : periodType.slice(0, periodType.length - 1);
        const periodStartNew = periodStart.clone().subtract(1, periodType);
        const periodStopNew = periodStartNew.clone().endOf(periodTypeNew);

        const periodReadable = this.setReadableHeading(periodType, periodStartNew, periodStopNew);

        this.setState({ periodStart: periodStartNew, periodReadable, periodStop: periodStopNew });
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
        }

        return periodReadable;
    }

    setToday = () => {
        this.setState({
            periodStart: moment().startOf('day'),
            periodStop: moment().endOf('day'),
            periodReadable: 'Today',
            periodType: 'days'
        });
        this.closeModal();
    }

    setYesterday = () => {
        this.setState({
            periodStart: moment().startOf('day').subtract(1, 'd'),
            periodStop: moment().endOf('day').subtract(1, 'd'),
            periodReadable: 'Yesterday',
            periodType: 'days'
        });
        this.closeModal();
    }

    setThisWeek = () => {
        this.setState({
            periodStart: moment().startOf('isoWeek'),
            periodStop: moment().startOf('isoWeek').add(6, 'd'),
            periodReadable: 'This Week',
            periodType: 'weeks'
        });
        this.closeModal();
    }

    setLastWeek = () => {
        this.setState({
            periodStart: moment().startOf('isoWeek').subtract(7, 'd'),
            periodStop: moment().startOf('isoWeek').subtract(1, 'd'),
            periodReadable: 'Last Week',
            periodType: 'weeks'
        });
        this.closeModal();
    }

    setThisMonth = () => {
        this.setState({
            periodStart: moment().startOf('month'),
            periodStop: moment().endOf('month'),
            periodReadable: 'This Month',
            periodType: 'months'
        });
        this.closeModal();
    }

    setLastMonth = () => {
        this.setState({
            periodStart: moment().startOf('month').subtract(1, 'M'),
            periodStop: moment().endOf('month').subtract(1, 'M'),
            periodReadable: 'Last Month',
            periodType: 'months'
        });
        this.closeModal();
    }

    setThisYear = () => {
        this.setState({
            periodStart: moment().startOf('year'),
            periodStop: moment().endOf('year'),
            periodReadable: 'This Year',
            periodType: 'years'
        });
        this.closeModal();
    }

    setLastYear = () => {
        this.setState({
            periodStart: moment().startOf('year').subtract(1, 'y'),
            periodStop: moment().endOf('year').subtract(1, 'y'),
            periodReadable: 'Last Year',
            periodType: 'years'
        });
        this.closeModal();
    }

    openModal = () => {
        this.setState({ isModalOpen: true });
    }

    closeModal = () => {
        this.setState({ isModalOpen: false });
    }

    getPeriodType = (periodStart, periodStop) => {
        const length = periodStop.diff(periodStart, 'days');
        //calculate length of period -day
        const getMonthArg = () => periodStart.clone().format('D') === '1' &&
            periodStop.clone().format('D') === periodStart.clone().endOf('month').format('D');

        console.log(length);
        if (!length) return 'days';
        else if (length === 6) return 'weeks';
        else if (length < 7) return 'weeks';
        else if (getMonthArg()) return 'months';
        else if (length > 7) return 'months';

        //console.log(periodStart.clone().format('D'),
        // periodStop.clone().format('D'), periodStart.clone().startOf('month').format('D'), 'BIGTEST');
        //1 30 1
    }

    handleSelect = (range) => {
        console.log(range);
        const periodStart = moment(range.startDate).startOf('day');
        const periodStop = moment(range.endDate).endOf('day');
        const periodType = this.getPeriodType(periodStart, periodStop);
        const periodReadable = this.setReadableHeading(periodType, periodStart, periodStop);

        this.setState({
            periodStart,
            periodStop,
            periodReadable,
            periodType
        });
    }

    render() {
        const { userData } = this.props;
        const { periodReadable, periodStart, periodStop, periodType, isModalOpen } = this.state;

        const modalStyle = {
            overlay: { backgroundColor: 'transparent' },
            content: {
                width: '600px', margin: '0 auto', height: '398px', padding: '0', position: 'absolute',
                top: '50px', left: 'initial', right: '185px'
            }
        };

        return (
            <Wrapper>
                <Chart_Section>
                    <Header>
                        <h2 style={{ textAlign: 'center', color: '#555' }}>Dashboard</h2>
                        <h3 style={{ textAlign: 'center', color: '#555', display: 'flex' }}>
                            <Item_link onClick={this.openModal}>
                                {periodReadable}<span>
                                    <Icon name={isModalOpen ? 'close' : 'arrow_drop_down'}
                                        size={isModalOpen ? '20px' : '24px'} /></span>
                            </Item_link>
                            <Period_selection>
                                <Item_link onClick={this.subtractPeriodState}>
                                    <Icon name="keyboard_arrow_left" />
                                </Item_link>
                                <Item_link onClick={this.addPeriodState}>
                                    <Icon name="keyboard_arrow_right" />
                                </Item_link>
                            </Period_selection>
                        </h3>
                    </Header>
                    <PeriodTimeChart data={this.getPeriodTimeArr()} yearData={this.getYearMonthsArr} periodType={periodType} />
                    <ProjectChart userData={userData} totalWeekTime={this.getTotalWeekTime}
                        periodStart={periodStart} periodStop={periodStop} />

                    {/* <--modal--> */}
                    <Modal isOpen={isModalOpen} shouldCloseOnEsc={true} shouldCloseOnOverlayClick={true}
                        onRequestClose={this.closeModal} style={modalStyle}>
                        <ModalCalendar periodStart={periodStart} periodStop={periodStop} handleSelect={this.handleSelect}
                            setToday={this.setToday} setYesterday={this.setYesterday} setThisMonth={this.setThisMonth}
                            setThisWeek={this.setThisWeek} setThisYear={this.setThisYear} setLastMonth={this.setLastMonth}
                            setLastWeek={this.setLastWeek} setLastYear={this.setLastYear} />
                    </Modal>
                </Chart_Section>
                <ProjectsCounter userData={userData} />
            </Wrapper>
        );
    }
}

const mapStateToProps = ({ userData }) => ({ userData });

export default connect(mapStateToProps, null)(Dashboard);