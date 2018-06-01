import React from 'react';
import styled from 'styled-components';

import Modal from 'react-modal';
import Icon from '../components/icon';

const Input = styled.input`
    padding:1rem;
    border:none;
    font-size:20px;
    box-shadow:0 1px 3px rgba(128,128,128,0.2);
    outline-color:#ddd;
    margin-bottom:1.5rem;
`;

const Section_Heading = styled.h3`
    font-weight:500;
    display:flex;
    align-items:center;
`;

const Icon_Link = styled.a`
    cursor:pointer;
    display:flex;
    padding:.3rem;
`;

const Button = styled.button`
    border:none;
    padding:.6rem;
    font-size:14px;
    font-weight:700;
    color:#fff;
    display:flex;
    align-items:center;
    cursor:pointer;
    transition:all .2s ease-in;
    height: 42px;
    min-width: 108px;
    > span {
        margin-right:.3rem;
    }
`;

const Button_done = styled(Button) `
    background-color:#47be00;
    margin-left: auto;
    display: flex;
    justify-content: center;
    &:hover{
        background-color:#3fa900;
    }
`;

const Modal_header = styled.header`
    padding:1.5rem;
    padding-left:2rem;
    display:flex;
    justify-content:space-between;
    font-weight:500;
    border-bottom:1px solid #ddd;
`;

const Modal_content = styled.section`
    display:flex;
    flex-direction:column;
    padding:1rem;
`;

const Modal_error = styled.div`
    padding:1rem;
    background-color:red;
    color:white;
    font-weight:700;
    display:${props => props.visible ? 'block' : 'none'};
`;

const ProfileModal = props => {
    const { isOpen, style, onRequestClose, errorMessage, modalPassword, state,
        validatePasswordForm, setState } = props;

    const modalStyle = {
        overlay: {},
        content: { width: '550px', margin: '0 auto', height: state.isPasswordFormInvalid ? '446px' : '400px', padding: '0', boxShadow: `0 5px 15px rgba(128,128,128,0.5)` }
    };

    return (
        <Modal isOpen={isOpen} shouldCloseOnEsc={true} style={modalStyle}
            shouldCloseOnOverlayClick={true} onRequestClose={onRequestClose} closeTimeoutMS={200}>
            <div>
                <Modal_header>
                    <Section_Heading>Change Password</Section_Heading>
                    <Icon_Link onClick={onRequestClose}>
                        <Icon name="close" />
                    </Icon_Link>
                </Modal_header>
                <Modal_error visible={state.isPasswordFormInvalid}>
                    {state.errorMessage}
                </Modal_error>
                <Modal_content>
                    <Input value={modalPassword.current} placeholder="Current password" type="password"
                        onChange={e => setState({ modalPassword: { ...state.modalPassword, current: e.target.value } })} />
                    <Input value={modalPassword.newpass} placeholder="New password" type="password"
                        onChange={e => setState({ modalPassword: { ...state.modalPassword, newpass: e.target.value } })} />
                    <Input value={modalPassword.newpass2} placeholder="New password again" type="password"
                        onChange={e => setState({ modalPassword: { ...state.modalPassword, newpass2: e.target.value } })} />
                    <Button_done onClick={validatePasswordForm}> Save </Button_done>
                </Modal_content>
            </div>
        </Modal>
    )
}

export default ProfileModal;