import React from 'react';
import { connect } from 'react-redux';
import * as actions from '../actions';

import styled from 'styled-components';
import moment from 'moment';
import momentDFPlugin from 'moment-duration-format';
momentDFPlugin(moment);

import Modal from 'react-modal';
// Modal.setAppElement('.sc-gZMcBi llCEqF');
import Icon from '../components/icon';

const Task_controller = styled.section`
    border:2px solid #ccc;
    border-width:0 0 2px 0;
    display:flex;
    padding:1rem;
    justify-content:space-between;
    align-items:center;
    position:fixed;
    background-color:#fff;
    width:95%;
    height:75px;
@media only screen and (min-width:1200px){
    width:91%;
}
`;

const Task_timing = styled.div`
    min-width:15rem;
    display:flex;
    justify-content:space-between;
    align-items:center;
`;

const Task_description = styled.input`
`;

const Task_timer = styled.span`
`;

const Settings_section = styled.nav`
    display:flex;
    flex-direction:column;
`;

const Task_button = styled.a`
    cursor:pointer;
    color:white;
    background-color:${props => props.isRunning ? 'red' : 'green'};
    border-radius:50%;
    padding:.3rem;
    display:flex;
    justify-content:center;
    align-items:center;
`;

const Color_indicator = styled.span`
    display:inline-block;
    width:.6rem;
    height:.6rem;
    background-color:${props => '#' + props.color};
    border-radius:50%;
    margin-right:.5rem;
`;

const Item_link = styled.a`
    cursor:pointer;
    display:flex;
    align-items:center;
`;

class TopBar extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            description: '',
            project: null,
            billable: false,
            isModalOpen: false,
            isTimerModeManual: false
        }
    }

    componentDidMount() {
        this.props.onRef(this);

        this.setPreviouslyRunningTimer(this.props.userData);
        console.log('TOPBAR JUST MOUNTED');
    }

    componentWillUnmount() {
        //if (window.interval) clearInterval(window.interval);
        this.props.onRef(null);
    }

    setPreviouslyRunningTimer(userData) {
        const { setRunningEntry, isRunning, setIsRunning, setTimer, setRunningEntryDescription } = this.props;

        //await this.props.fetchEntries(this.props.userData._id);

        console.log('mounted', userData.entries.filter(item => item.stop === undefined).length);

        if (userData.entries.filter(item => item.stop === undefined).length) {
            const runEntry = userData.entries.filter(item => item.stop === undefined)[0];
            setRunningEntry(runEntry._id);
            console.log('mounted2');

            const start = moment(runEntry.start).format();

            setIsRunning(true);
            clearInterval(window.interval);
            window.interval = setInterval(() => {
                const time = moment.duration(moment().diff(start)).format('h:mm:ss', { stopTrim: "hh mm ss" });
                setTimer(time);
            }, 500);

            setRunningEntryDescription(runEntry.description || '');
            this.setState({ description: runEntry.description || '' });
        }
    }

    setStateWithRef(val) {
        this.setState({ description: val });
    }

    handleClick() {
        const { isRunning, createNewEntry, userData, toggleTimer, runningEntryDescription } = this.props;

        if (!isRunning) {
            toggleTimer(true);
            createNewEntry(userData._id, 'description', runningEntryDescription);
        }
        else this.stopTimer();
    }

    stopTimer() {
        const { userData, toggleTimer, runningEntry, updateEntry, runningEntryDescription,
            setRunningEntryDescription, getWeekTime, setWeekTimer } = this.props;
        const { project, billable } = this.state;

        const now = moment().valueOf();
        const payload = {
            stop: now,
            description: runningEntryDescription,
            project: (project && project.name) ? project.name : '',
            billable
        };

        toggleTimer(false);
        updateEntry(userData._id, runningEntry, payload);
        setWeekTimer(getWeekTime(userData.entries));
        setRunningEntryDescription('');
        this.setState({ description: '' });
    }

    changeDescription(description, runningEntry, previousDescription, enableEmptyInput = false) {
        const { userData, updateEntry } = this.props;
        if (!runningEntry) runningEntry = this.props.runningEntry;
        console.log('change desc', description);

        if (((description.trim() !== previousDescription) && runningEntry) || (enableEmptyInput && runningEntry)) {
            updateEntry(userData._id, runningEntry, { description: description.trim() });
        }
    }

    setProjectState = obj => {
        this.setState({ project: obj, isModalOpen: false });
    }

    setBillable = () => {
        this.setState(prevState => ({ billable: !prevState.billable }))
    }

    openModal = () => {
        this.setState({ isModalOpen: true });
    }

    closeModal = () => {
        this.setState({ isModalOpen: false });
    }

    render() {
        const { isRunning, timer, setRunningEntryDescription, userData } = this.props;
        const { project, description, billable, isTimerModeManual } = this.state;

        const modalStyle = {
            overlay: { backgroundColor: 'transparent' },
            content: {
                width: '200px', margin: '0 auto', height: '120px', padding: '1rem', position: 'absolute',
                top: '50px', left: 'initial', right: '80px'
            }
        };

        const timerModeCondition = isTimerModeManual ? '#bbb' : 'green';

        const CurrentProjectJSX = () => project ?
            (<Item_link>
                <Color_indicator color={project.color} />
                <span>{project.name}</span>
            </Item_link>) :
            (<Item_link>
                <Icon name="folder" fill="#bbb" />
            </Item_link>);

        return (
            <Task_controller>
                <Task_description
                    type="text"
                    placeholder={isRunning ? '(no description)' : 'What are you working on?'}
                    // defaultValue={runningEntryDescription}
                    value={description}
                    onChange={e => this.setState({ description: e.target.value })}
                    onBlur={e => setRunningEntryDescription(e.target.value)} />
                <Task_timing>
                    <span onClick={this.openModal}>{<CurrentProjectJSX />}</span>
                    <Item_link onClick={this.setBillable}>
                        <Icon name="attach_money" size={'24px'} fill={billable ? 'green' : '#bbb'} />
                    </Item_link>
                    <Task_timer>{timer}</Task_timer>
                    <Task_button isRunning={isRunning} onClick={() => this.handleClick()}>
                        <Icon name={isRunning ? "stop" : "play_arrow"} />
                    </Task_button>
                    {isRunning ?
                        <Item_link>
                            <Icon name="delete" fill="#bbb" />
                        </Item_link> :
                        <Settings_section>
                            <Item_link>
                                <Icon name="access_time" fill={timerModeCondition} size="20px" />
                            </Item_link>
                            <Item_link>
                                <Icon name="menu" fill={!timerModeCondition} size="20px" />
                            </Item_link>
                        </Settings_section>}
                </Task_timing>

                {/* <-- modal --> */}
                <Modal isOpen={this.state.isModalOpen} shouldCloseOnEsc={true} shouldCloseOnOverlayClick={true}
                    overlayRef={node => this.overlayRef = node} onRequestClose={this.closeModal}
                    style={modalStyle}>
                    <ul>
                        <li key={'no project'} onClick={() => this.setProjectState(null)}>
                            <Item_link> <Color_indicator color={'bbb'} />no project</Item_link>
                        </li>
                        {userData.projects.map(itm =>
                            (<li key={itm.name} onClick={() => this.setProjectState(itm)}>
                                <Item_link>
                                    <Color_indicator color={itm.color} />{itm.name}
                                </Item_link>
                            </li>))}
                        <li key={'add project'} onClick={() => 'ok'}>
                            <Item_link><Icon name="add" fill="green" />add Project</Item_link>
                        </li>
                    </ul>
                </Modal>
            </Task_controller >
        );
    }
}

const mapStateToProps = ({ isRunning, timer, userData, runningEntry, runningEntryDescription }) => ({
    isRunning,
    userData,
    runningEntry,
    timer,
    runningEntryDescription
});

const mapDispatchToProps = dispatch => ({
    setIsRunning: bool => dispatch(actions.setIsRunning(bool)),
    setTimer: str => dispatch(actions.setTimer(str)),
    toggleTimer: bool => dispatch(actions.toggleTimer(bool)),
    setWeekTimer: str => dispatch(actions.setWeekTimer(str)),
    fetchEntries: id => dispatch(actions.fetchEntries(id)),
    setRunningEntry: v => dispatch(actions.setRunningEntry(v)),
    setRunningEntryDescription: v => dispatch(actions.setRunningEntryDescription(v)),
    createNewEntry: (userid, param, pval) => dispatch(actions.createNewEntry(userid, param, pval)),
    updateEntry: (userid, runningEntry, obj) => dispatch(actions.updateEntry(userid, runningEntry, obj))
});

export default connect(mapStateToProps, mapDispatchToProps)(TopBar);