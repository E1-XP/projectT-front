import React from 'react';
import { connect } from 'react-redux';

import styled from 'styled-components';
import moment from 'moment';
import momentDFPlugin from 'moment-duration-format';
momentDFPlugin(moment);

import WeekTimeChart from '../components/weekchart';
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
    justify-content:space-around;
`;

const Chart_Section = styled.section`

`;

class Dashboard extends React.Component {
    constructor() {
        super();

        this.state = {
            mappedItems: {}
        }
    }

    componentDidMount() {
        if (this.props.userData) this.setState({ mappedItems: this.getMappedItems() });
    }

    getTotalDayCount = array => {
        const toSeconds = array.reduce((acc, item) =>
            acc += moment.duration(Number(item.stop) - item.start).asSeconds(), 0);

        return moment.duration(toSeconds, 'seconds').format('h:mm', { stopTrim: "hh mm" });
    }

    getThisWeekTimeArr = () => {
        const { entries } = this.props.userData;
        const { mappedItems } = this.state;

        const thisWeekStart = moment().startOf('isoWeek');
        const getReadable = item => moment(item.start).format('ddd, Do MMM');
        const getDuration = item => moment(item).format('h:mm:ss', { stopTrim: "hh mm ss" });

        const getUnix = item => moment.duration(moment(Number(item.stop)).diff(item.start)).valueOf();

        const generateDayLabels = () => Array(7).fill(null).map((itm, i) => moment(thisWeekStart).add(i, 'd').format('ddd, Do MMM'));

        const getDayTimeSum = item => mappedItems[item].reduce((acc, itm) => acc += (Number(itm.stop - itm.start)), 0);

        const getDayObj = (itm, dataFlag) => ({
            readable: itm,
            duration: dataFlag ? this.getTotalDayCount(mappedItems[itm]) : `0:00`,
            time: dataFlag ? getDayTimeSum(itm) : 0
        });

        return generateDayLabels().map(itm => mappedItems[itm] ? getDayObj(itm, true) : getDayObj(itm));
    }

    getMappedItems = () => {
        const { userData } = this.props;

        const getReadable = item => moment(item.start).format('ddd, Do MMM');

        const reduceItems = (acc, item) => {
            acc[item.readable] ? acc[item.readable].push(item) : acc[item.readable] = [item];
            return acc;
        }

        return userData.entries
            .filter(item => item.stop !== undefined)
            .sort((a, b) => b.start - a.start)
            .map((item, i) => ({
                start: item.start,
                stop: item.stop,
                readable: getReadable(item)
            })).reduce(reduceItems, {});
    }

    getTotalWeekTime = entries => {
        const now = moment();
        const total = entries.filter(item => item.stop !== undefined)
            .filter(item => now.diff(item.start, 'days') < 7)
            .reduce((acc, item) => acc + moment.duration(moment(Number(item.stop)).diff(item.start)).valueOf(), 0);

        return moment(total).format('h:mm:ss', { stopTrim: "hh mm ss" });
    }

    render() {
        const { userData } = this.props;

        return (
            <Wrapper>
                <Chart_Section>
                    <Header>
                        <h2 style={{ textAlign: 'center', color: '#555' }}>Dashboard</h2>
                        <h3 style={{ textAlign: 'center', color: '#555' }}>This Week</h3>
                    </Header>
                    <WeekTimeChart data={this.getThisWeekTimeArr()} />
                    <ProjectChart totalWeekTime={this.getTotalWeekTime(userData.entries)} />
                </Chart_Section>
                <ProjectsCounter />
            </Wrapper>
        );
    }
}

const mapStateToProps = ({ userData }) => ({ userData });

export default connect(mapStateToProps, null)(Dashboard);