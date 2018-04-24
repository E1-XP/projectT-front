import React from 'react';
import { connect } from 'react-redux';
import * as actions from '../actions';

import styled from 'styled-components';
import moment from 'moment';
import momentDFPlugin from 'moment-duration-format';
momentDFPlugin(moment);

import Modal from 'react-modal';
import ProjectDropdown from '../components/projectdropdown';
import Icon from '../components/icon';

const Task_controller = styled.section`
    border:2px solid #ccc;
    border-width:0 0 2px 0;
    display:flex;
    padding:1rem;
    justify-content:space-between;
    align-items:center;
    position:fixed;
    z-index:50;
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
    outline-color:transparent;
    width:100%;
    padding:.3rem;
    border:none;
    font-size:18px;
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
            billable: false,
            isModalOpen: false,
            isTimerModeManual: false
        }
    }

    componentDidMount() {
        this.props.onRef(this);
        this.setPreviouslyRunningTimer(this.props.userData);
    }

    componentWillUnmount() {
        this.props.onRef(null);
    }

    setPreviouslyRunningTimer(userData) {
        const { setRunningEntry, setIsRunning, setTimer, setRunningEntryDescription,
            setProject, toggleTimer } = this.props;

        let runEntry = userData.entries.filter(item => item.stop === undefined);
        if (runEntry.length) {
            runEntry = runEntry[0];
            const start = moment(runEntry.start).format();

            setRunningEntry(runEntry._id);
            setProject(userData.projects.filter(itm => itm.name === runEntry.project)[0]);
            toggleTimer(true, start);

            setRunningEntryDescription(runEntry.description || '');
            this.setState({ description: runEntry.description || '' });
        }
    }

    setStateWithRef(val) {
        this.setState({ description: val });
    }

    handleClick() {
        const { isRunning, createNewEntry, userData, toggleTimer, runningEntryDescription,
            currentProject } = this.props;

        if (!isRunning) {
            toggleTimer(true);

            const params = { description: runningEntryDescription };
            if (currentProject) params.project = currentProject.name;

            createNewEntry(userData._id, params);
        }
        else this.stopTimer();
    }

    stopTimer() {
        const { userData, toggleTimer, runningEntry, updateEntry, runningEntryDescription,
            setRunningEntryDescription, getWeekTime, setWeekTimer, currentProject,
            setProject } = this.props;
        const { billable } = this.state;

        const now = moment().valueOf();
        const payload = {
            stop: now,
            description: runningEntryDescription,
            project: (currentProject && currentProject.name) ? currentProject.name : '',
            billable
        };

        toggleTimer(false);
        updateEntry(userData._id, runningEntry, payload);
        setWeekTimer(getWeekTime(userData.entries));
        setRunningEntryDescription('');
        setProject(null);
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
        const { updateEntry, setProject, userData, runningEntry } = this.props;

        if (runningEntry) updateEntry(userData._id, runningEntry, { project: obj.name });
        setProject(obj);
        this.setState({ isModalOpen: false });
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
        const { isRunning, timer, setRunningEntryDescription, userData, currentProject } = this.props;
        const { description, billable, isTimerModeManual } = this.state;

        const modalStyle = {
            overlay: { backgroundColor: 'transparent', zIndex: 55 },
            content: {
                width: '200px', margin: '0 auto', height: '120px', padding: '1rem', position: 'absolute',
                top: '50px', left: 'initial', right: '80px'
            }
        };

        const timerModeCondition = isTimerModeManual ? '#bbb' : 'green';

        const CurrentProjectJSX = () => currentProject ?
            (<Item_link>
                <Color_indicator color={currentProject.color} />
                <span>{currentProject.name}</span>
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
                <Modal isOpen={this.state.isModalOpen} shouldCloseOnEsc={true}
                    shouldCloseOnOverlayClick={true} overlayRef={node => this.overlayRef = node}
                    onRequestClose={this.closeModal} style={modalStyle}>
                    <ProjectDropdown setProjectState={this.setProjectState} userData={userData} />
                </Modal>
            </Task_controller >
        );
    }
}

const mapStateToProps = ({ isRunning, timer, weekTimer, userData, runningEntry,
    runningEntryDescription, currentProject }) => ({
        isRunning,
        userData,
        runningEntry,
        timer,
        weekTimer,
        currentProject,
        runningEntryDescription
    });

const mapDispatchToProps = dispatch => ({
    setIsRunning: bool => dispatch(actions.setIsRunning(bool)),
    setTimer: str => dispatch(actions.setTimer(str)),
    toggleTimer: (bool, val) => dispatch(actions.toggleTimer(bool, val)),
    setWeekTimer: str => dispatch(actions.setWeekTimer(str)),
    fetchEntries: id => dispatch(actions.fetchEntries(id)),
    setProject: obj => dispatch(actions.setProject(obj)),
    setRunningEntry: v => dispatch(actions.setRunningEntry(v)),
    setRunningEntryDescription: v => dispatch(actions.setRunningEntryDescription(v)),
    createNewEntry: (userid, obj) => dispatch(actions.createNewEntry(userid, obj)),
    updateEntry: (userid, runningEntry, obj) => dispatch(actions.updateEntry(userid, runningEntry, obj))
});

export default connect(mapStateToProps, mapDispatchToProps)(TopBar);