import React from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';

const Week_counter = styled.div`
    text-transform:uppercase;
    font-size:13px;
    margin-top:61px;
    padding:1.8rem;
`;

const WeekBar = styled.div`
    background-color:red;
    width:100%;
    height:3px;
    border-radius:1.5px;
    margin-top:3rem;
`;

class WeekTimer extends React.Component {
    shouldComponentUpdate(nextProps) {
        if (this.props.isRunning && !nextProps.isRunning) return false;
        return true;
    }

    render() {
        const { weekTimer } = this.props;

        return (
            <Week_counter>
                This week: <span>{weekTimer}</span>
                <WeekBar />
            </Week_counter>
        );
    }
}

const mapStateToProps = ({ timer }) => ({
    weekTimer: timer.weekTimer
});

export default connect(mapStateToProps, null)(WeekTimer);