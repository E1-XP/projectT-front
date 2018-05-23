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
`;

const Button_Create = styled(Button) `
    background-color:#4bc800;
    &:hover{
        background-color:#3fa900;
    }
`;

const Button_Remove = styled(Button) `
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

const Icon_Link_Modal = styled(Icon_Link) `
    border:1px solid #ccc;
`;

const Footer = styled.section`
    display:flex;
`;

const modalStyle = {
    overlay: {},
    content: { width: '550px', margin: '0 auto', height: '270px', padding: '0', boxShadow: `0 5px 15px rgba(128,128,128,0.5)` }
};

const colors = [`#1abc9c`, `#3498db`, '#34495e', `#e74c3c`, `#d35400`, `#f1c40f`, `#95a5a6`, `#8e44ad`];

class Projects extends React.Component {
    constructor() {
        super();

        this.state = {
            isModalOpen: false,
            isColorSelectorOpen: false,
            projectInput: "",
            clientInput: "",
            selectedColor: null,
            colors: shuffle(colors)
        }
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

    openColorSelector = () => {
        this.setState({ isColorSelectorOpen: true });
    }

    closeColorSelector = () => {
        this.setState({ isColorSelectorOpen: false });
    }

    handleProjectCreate = () => {
        const { projectInput, clientInput, selectedColor } = this.state;
        if (!projectInput || !clientInput) return null;

        this.props.createProject(this.props.userData._id, projectInput, selectedColor, clientInput);
        this.setState({ projectInput: '', clientInput: '', isModalOpen: false });
    }

    handleProjectRemove = () => {
        const { userData, removeProject } = this.props;
        const { checkedProjects } = this.refTable.state;

        const names = Object.keys(checkedProjects).filter(itm => checkedProjects[itm]);

        if (names.length) removeProject(userData._id, names);
    }

    render() {
        const { userData, removeProject } = this.props;

        return (<Wrapper>
            <Header>
                <Heading>Projects</Heading>
                <Button_Create onClick={this.openModal}>Create Project</Button_Create>
            </Header>
            <section>
                <ProjectsTable ref={node => this.refTable = node} data={userData} />
            </section>
            <Footer>
                <Button_Remove onClick={this.handleProjectRemove}>
                    Remove Selected
                    </Button_Remove>
            </Footer>

            {/* <---modal---> */}
            <Modal isOpen={this.state.isModalOpen} shouldCloseOnEsc={true} shouldCloseOnOverlayClick={true}
                overlayRef={node => this.overlayRef = node} onRequestClose={this.closeModal} closeTimeoutMS={200}
                style={modalStyle}>
                <Modal_Header>
                    <h3>Create Project</h3>
                    <Icon_Link onClick={this.closeModal}>
                        <Icon name="close" />
                    </Icon_Link>
                </Modal_Header>
                <Modal_Section>
                    <Relative_container>
                        <Icon_Link_Modal style={{ position: 'relative' }} onClick={this.openColorSelector}>
                            <Color_Indicator color={this.state.selectedColor} />
                            <Icon name="arrow_drop_down" />
                        </Icon_Link_Modal>

                        <ColorPickerDropdown isOpen={this.state.isColorSelectorOpen}
                            state={this.state} setState={this.setState.bind(this)} />

                    </Relative_container>
                    <input value={this.state.projectInput}
                        onChange={e => this.setState({ projectInput: e.target.value })}
                        placeholder="Project name..." />
                    <input value={this.state.clientInput}
                        onChange={e => this.setState({ clientInput: e.target.value })}
                        placeholder="Client..." />
                </Modal_Section>
                <Modal_Footer>
                    <Button_Create onClick={this.handleProjectCreate}>Create Project</Button_Create>
                </Modal_Footer>
            </Modal>

        </Wrapper>);
    }
}

const mapStateToProps = ({ user }) => ({ userData: user.userData });

const mapDispatchToProps = dispatch => ({
    createProject: (userid, name, color, client) => dispatch(actions.entry.createProject(userid, name, color, client)),
    removeProject: (userid, name) => dispatch(actions.entry.removeProject(userid, name))
});

export default connect(mapStateToProps, mapDispatchToProps)(Projects);
