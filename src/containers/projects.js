import React from 'react';
import { connect } from 'react-redux';
import * as actions from '../actions';

import styled from 'styled-components';
import Modal from 'react-modal';

Modal.setAppElement('#root');

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

const Button_Create = styled.button`
    border:none;
    padding:.8rem;
    background-color:#4cd137;
    color:#fff;
`;

const Button_Remove = styled(Button_Create) `
    background-color:red;
`;

const Button_Create_Modal = styled(Button_Create) `
    width:50%;
`;
const Color_Indicator = styled.div`
    padding:.5rem;
    width:1.5rem;
    background-color:${props => props.color};
`;

const Color_Indicator_Multi = styled(Color_Indicator) `
    margin:.2rem;
    height:1.5rem;
    position:relative;
`;

const Color_Indicator_Inner = styled.span`
    width:1.5rem;
    height:1.5rem;
    display:flex;
    border-radius:50%;
    position:absolute;
    top:0;
    left:0;
    justify-content:center;
    align-items:center;

    &:hover{
        background-color:rgba(0,0,0,.3);
    }
`;

const Color_Container = styled.div`
    display:flex;
    flex-wrap:wrap;
`;

const Icon_Link = styled.a`
    cursor:pointer;
    display:flex;
    padding:.3rem;
`;

const Icon_Link_Modal = styled(Icon_Link) `
    border:1px solid #ccc;
`;

const Footer = styled.footer`
    display:flex;
`;

class Projects extends React.Component {
    constructor() {
        super();

        this.state = {
            isModalOpen: false,
            isColorSelectorOpen: false,
            projectInput: "",
            clientInput: "",
            selectedColor: null,
            colors: [`#1abc9c`, `#3498db`, '#34495e',
                `#e74c3c`, `#d35400`, `#f1c40f`, `#95a5a6`, `#8e44ad`]
        }
    }

    componentDidMount() {
        const { colors } = this.state;
        const selectedColor = colors[Math.floor(Math.random() * (colors.length - 1))];

        this.setState({ selectedColor });
        console.log(selectedColor);
    }

    openModal = () => {
        this.setState({ isModalOpen: true });
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

        this.props.createProject(this.props.userData._id, projectInput, selectedColor, clientInput);
        this.setState({ projectInput: '', clientInput: '' });
    }

    handleProjectRemove = () => {
        const { userData, removeProject } = this.props;
        const { checkedProjects } = this.refTable.state;

        const names = Object.keys(checkedProjects).filter(itm => checkedProjects[itm]);

        if (names.length) removeProject(userData._id, names);
    }

    getSeletectorColors = () => {
        const { colors, selectedColor } = this.state;
        const setActive = (itm) => this.setState({ selectedColor: itm });

        return colors.map(itm =>
            (<Color_Indicator_Multi key={itm} color={itm} onClick={() => setActive(itm)}>
                <Color_Indicator_Inner>
                    {itm === selectedColor && <Icon name="done" fill='#fff' size="16px" />}
                </Color_Indicator_Inner>
            </Color_Indicator_Multi>));
    }

    render() {
        const { userData, removeProject } = this.props;

        const modalStyle = {
            overlay: { backgroundColor: 'rgba(0,0,0,.2)' },
            content: { width: '550px', margin: '0 auto', height: '270px', padding: '0', boxShadow: `0 5px 15px rgba(128,128,128,0.5)` }
        };
        const colorSelectorStyle = {
            overlay: { backgroundColor: 'transparent' },
            content: {
                width: '200px', margin: '0 auto', height: '150px', padding: '1rem', position: 'absolute',
                top: '200px', right: '263px'
            }
        };

        return (
            <Wrapper>
                <Header>
                    <h2>Projects</h2>
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
                    overlayRef={node => this.overlayRef = node} onRequestClose={this.closeModal}
                    style={modalStyle}>
                    <Modal_Header>
                        <h2>Create Project</h2>
                        <Icon_Link onClick={this.closeModal}>
                            <Icon name="close" />
                        </Icon_Link>
                    </Modal_Header>
                    <Modal_Section>
                        <Icon_Link_Modal style={{ position: 'relative' }} onClick={this.openColorSelector}>
                            <Color_Indicator color={this.state.selectedColor} />
                            <Icon name="arrow_drop_down" />
                        </Icon_Link_Modal>
                        <input value={this.state.projectInput}
                            onChange={e => this.setState({ projectInput: e.target.value })}
                            placeholder="Project name..." />
                        <input value={this.state.clientInput}
                            onChange={e => this.setState({ clientInput: e.target.value })}
                            placeholder="Client..." />

                        {/* <---color-modal---> */}
                        <Modal isOpen={this.state.isColorSelectorOpen} shouldCloseOnEsc={true} style={colorSelectorStyle}
                            shouldCloseOnOverlayClick={true} onRequestClose={this.closeColorSelector}>
                            <Color_Container>
                                {this.getSeletectorColors()}
                            </Color_Container></Modal>
                    </Modal_Section>
                    <Modal_Footer>
                        <Button_Create_Modal onClick={this.handleProjectCreate}>Create Project</Button_Create_Modal>
                    </Modal_Footer>
                </Modal>
            </Wrapper >
        );
    }
}

const mapStateToProps = ({ userData }) => ({ userData });

const mapDispatchToProps = dispatch => ({
    createProject: (userid, name, color, client) => dispatch(actions.createProject(userid, name, color, client)),
    removeProject: (userid, name) => dispatch(actions.removeProject(userid, name))

});

export default connect(mapStateToProps, mapDispatchToProps)(Projects);
