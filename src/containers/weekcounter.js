import React from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';

const Week_counter = styled.div`
    text-transform:uppercase;
    font-size:13px;
    margin-top:61px;
    padding:2rem;
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
            </Week_counter>
        );
    }
}

const mapStateToProps = ({ timer }) => ({
    weekTimer: timer.weekTimer
});

export default connect(mapStateToProps, null)(WeekTimer);