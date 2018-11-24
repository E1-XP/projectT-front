import React from 'react';
import { connect } from 'react-redux';
import shuffle from 'lodash.shuffle';
import styled from 'styled-components';

import * as actions from '../actions';

import Modal from 'react-modal';
Modal.setAppElement('#root');

import ColorPickerDropdown from '../components/colorpickerdropdown';
import ProjectsTable from '../components/projectstable';
import Icon from '../components/icon';

const Wrapper = styled.div`
    width:95%;
    max-width:1200px;
    margin:1rem auto;
`;

const Header = styled.header`
    width:100%;
    display:flex;   
    justify-content:space-between;
`;

const Heading = styled.h2`
    font-size:34px;
    font-weight:500;
`;

const Section_heading = styled.h3`
    display: flex;
    align-items: center;
`;

const Modal_Header = styled.header`
    display:flex;
    justify-content:space-between;
    border-bottom:2px solid #ddd;
    padding:1.5rem;
`;

const Modal_Section = styled.section`
    display:flex;
    justify-content:center;
    padding:1.5rem;
`;

const Modal_Footer = styled.footer`
    display:flex;
    padding:1.5rem;
    justify-content:flex-end;
`;

const Button = styled.button`
  cursor: pointer;
    border:none;
    padding:.8rem;
    font-weight:700;
    font-size:14px;
    transition:all .2s ease-in;        
    color:#fff;    
    min-width:8rem;
`;

const Button_Create = styled(Button)`
    background-color:#4bc800;
    &:hover{
        background-color:#3fa900;
    }
`;

const Button_Remove = styled(Button)`
    background-color:red;
    &:hover{
        background-color:#c20000;
    }
`;

const Color_Indicator = styled.div`
    padding:.5rem;
    width:1.5rem;
    background-color:${props => props.color};
`;

const Relative_container = styled.div`
    position:relative;
`;

const Icon_Link = styled.a`
    cursor:pointer;
    display:flex;
    padding:.3rem;
`;

const Icon_Link_Modal = styled(Icon_Link)`
    border:1px solid #ccc;
    position:relative;
    padding:.5rem;
`;

const Footer = styled.section`
    display:flex;
`;

const Input = styled.input`
    border: 1px solid #bbb;
    padding:.5rem;
    outline-color:transparent;
`;

const modalStyle = {
    overlay: {},
    content: { width: '550px', margin: '0 auto', height: '270px', padding: '0', boxShadow: `0 5px 15px rgba(128,128,128,0.5)` }
};

const modalConfirmStyle = {
    overlay: {},
    content: { width: '450px', margin: '50px auto', height: '200px', padding: '0', boxShadow: `0 5px 15px rgba(128,128,128,0.5)` }
};

const colors = [`#1abc9c`, `#3498db`, '#34495e', `#e74c3c`, `#d35400`, `#f1c40f`, `#95a5a6`, `#8e44ad`];

class Projects extends React.Component {
    constructor() {
        super();

        this.state = {
            isModalOpen: false,
            isConfirmDialogOpen: false,
            isColorSelectorOpen: false,
            projectInput: "",
            clientInput: "",
            checkedProjects: [],
            selectedColor: null,
            colors: shuffle(colors)
        }

        this.setStateBind = this.setState.bind(this);
    }

    componentDidMount() {
        const { colors } = this.state;
        const selectedColor = colors[Math.floor(Math.random() * (colors.length - 1))];

        this.setState({ selectedColor });
        console.log(selectedColor);
    }

    openModal = () => {
        const { colors } = this.state;
        const selectedColor = colors[Math.floor(Math.random() * (colors.length - 1))];

        this.setState({ isModalOpen: true, selectedColor });
    }

    closeModal = () => {
        this.setState({ isModalOpen: false });
    }

    openDialog = () => {

        this.setState({ isConfirmDialogOpen: true });
    }

    closeDialog = () => {
        this.setState({ isConfirmDialogOpen: false });
    }

    openColorSelector = () => {
        this.setState({ isColorSelectorOpen: true });
    }

    closeColorSelector = () => {
        this.setState({ isColorSelectorOpen: false });
    }

    handleProjectCreate = () => {
        const { projectInput, clientInput, selectedColor } = this.state;
        if (!projectInput) return null;

        this.props.createProject(this.props.userData._id, projectInput, selectedColor, clientInput);
        this.setState({ projectInput: '', clientInput: '', isModalOpen: false });
    }

    handleProjectRemove = () => {
        const { userData, removeProject } = this.props;
        const { checkedProjects } = this.state;
        const names = Object.keys(checkedProjects).filter(itm => checkedProjects[itm]);

        if (names.length) {
            removeProject(userData._id, names);
            this.closeDialog();
        }
    }

    render() {
        const { entries, projects } = this.props;
        const { checkedProjects } = this.state;
        const areSomeProjectsChecked = Object.keys(checkedProjects).some(key => checkedProjects[key]);

        return (<Wrapper>
            <Header>
                <Heading>Projects</Heading>
                <Button_Create onClick={this.openModal}>Create Project</Button_Create>
            </Header>
            <section>
                <ProjectsTable ref={node => this.refTable = node} setState={this.setStateBind} state={this.state}
                    entries={entries} projects={projects} />
            </section>
            <Footer>
                {!!projects.length && <Button_Remove onClick={this.openDialog} className={areSomeProjectsChecked ? null : 'btn-disabled'}
                    disabled={areSomeProjectsChecked ? false : true}>
                    Remove Selected
                    </Button_Remove>}
            </Footer>

            <Modal isOpen={this.state.isModalOpen} shouldCloseOnEsc={true} shouldCloseOnOverlayClick={true}
                overlayRef={node => this.overlayRef = node} onRequestClose={this.closeModal} closeTimeoutMS={200}
                style={modalStyle}>
                <Modal_Header>
                    <Section_heading>Create Project</Section_heading>
                    <Icon_Link onClick={this.closeModal}>
                        <Icon name="close" />
                    </Icon_Link>
                </Modal_Header>
                <Modal_Section>
                    <Relative_container>
                        <Icon_Link_Modal onClick={this.openColorSelector}>
                            <Color_Indicator color={this.state.selectedColor} />
                            <Icon name="arrow_drop_down" />
                        </Icon_Link_Modal>

                        <ColorPickerDropdown isOpen={this.state.isColorSelectorOpen}
                            state={this.state} setState={this.setStateBind} />

                    </Relative_container>
                    <Input value={this.state.projectInput}
                        onChange={e => this.setState({ projectInput: e.target.value })}
                        placeholder="Project name..." />
                    <Input value={this.state.clientInput}
                        onChange={e => this.setState({ clientInput: e.target.value })}
                        placeholder="Client..." />
                </Modal_Section>
                <Modal_Footer>
                    <Button_Create onClick={this.handleProjectCreate}>Create Project</Button_Create>
                </Modal_Footer>
            </Modal>

            <Modal isOpen={this.state.isConfirmDialogOpen} shouldCloseOnEsc={true} shouldCloseOnOverlayClick={true}
                overlayRef={node => this.overlayRef2 = node} onRequestClose={this.closeDialog} closeTimeoutMS={200}
                style={modalConfirmStyle} >
                <Modal_Header>
                    <Section_heading>Are your sure?</Section_heading>
                    <Icon_Link onClick={this.closeDialog}>
                        <Icon name="close" />
                    </Icon_Link>
                </Modal_Header>
                <Modal_Section>
                    <Button_Create onClick={this.handleProjectRemove}>Yes</Button_Create>
                    <Button_Remove onClick={this.closeDialog}>No</Button_Remove>
                </Modal_Section>
            </Modal>

        </Wrapper>);
    }
}

const mapStateToProps = ({ user }) => ({
    userData: user.userData,
    projects: user.projects,
    entries: user.entries
});

const mapDispatchToProps = dispatch => ({
    createProject: (userid, name, color, client) => dispatch(actions.entry.createProject(userid, name, color, client)),
    removeProject: (userid, name) => dispatch(actions.entry.removeProject(userid, name))
});

export default connect(mapStateToProps, mapDispatchToProps)(Projects);
