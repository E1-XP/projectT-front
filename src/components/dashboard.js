import React from 'react';
import styled from 'styled-components';

import Modal from 'react-modal';
import Icon from './icon';
import ModalCalendar from './modalcalendar';
import PeriodTimeChart from './periodchart';
import ProjectChart from './projectchart';
import ProjectsCounter from './projectscounter';

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
    & span {
        width:1.5rem;
        color:#bbb;
    }
    &:hover span {
        color:#333 !important;
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

class DashboardComponent extends React.Component {
    openCalendar = () => {
        this.props.setState({ isCalendarOpen: true }, () => document.addEventListener('click', this.closeCalendar));
    }

    closeCalendar = (e, stateObj = null) => {
        const tmpState = stateObj || this.props.state.tmpState;

        if (!e || !this.dropdown.contains(e.target)) {
            const state = { isCalendarOpen: false, isLoading: true, ...tmpState, tmpState: {} };
            this.props.setState(state, () => document.removeEventListener('click', this.closeCalendar));
        }
    }

    render() {
        const { periodReadable, subtractPeriodState, addPeriodState, isCalendarOpen, periodStart, periodStop, setReadableHeading,
            periodType, setStateProxy, getPeriodTimeArr, appendEntries, customPeriodLength, getTotalWeekTime,
            allEntriesFetched, userData, getYearMonthsArr, isLoading, setIsLoading, shouldUpdate } = this.props;

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
                            <Item_link_hover onClick={subtractPeriodState}>
                                <Icon name="keyboard_arrow_left" />
                            </Item_link_hover>
                            <Item_link_hover onClick={addPeriodState}>
                                <Icon name="keyboard_arrow_right" />
                            </Item_link_hover>
                        </Period_selection>

                        {isCalendarOpen && <Screen_blocker />}
                        <div ref={node => this.dropdown = node}>
                            <ModalCalendar periodStart={periodStart} periodStop={periodStop} closeModal={this.closeCalendar}
                                isOpen={isCalendarOpen} setReadableHeading={setReadableHeading} setState={setStateProxy} />
                        </div>

                    </Heading_section>
                </Header>
                <PeriodTimeChart data={getPeriodTimeArr()} getYearData={getYearMonthsArr} isLoading={isLoading}
                    customPeriodLength={customPeriodLength} periodType={periodType} isOpen={isCalendarOpen} shouldUpdate={shouldUpdate}
                    getMoreEntries={appendEntries} allEntriesFetched={allEntriesFetched} setIsLoading={setIsLoading} />
                <ProjectChart userData={userData} totalWeekTime={getTotalWeekTime} isLoading={isLoading}
                    periodStart={periodStart} periodStop={periodStop} isOpen={isCalendarOpen} />
            </Chart_Section>
            <ProjectsCounter userData={userData} />
        </Wrapper>);
    }
}
export default DashboardComponent;