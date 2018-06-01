import React from 'react';
import styled, { keyframes } from 'styled-components';

import ProfileModal from './profilemodal';
import Icon from './icon';

const Wrapper = styled.div`
    width:100%;
    max-width:1200px;
    margin:1rem auto;
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


const Main_content = styled.section`
    display:flex;
    margin-top:4rem;
`;

const Button_bar = styled.div`
    display:flex;    
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

const Button_password = styled(Button) `
    background-color:#323232;
    margin-right:.7rem;
    &:hover{
        background-color:#2a2a2a;
    }
`;

const Side = styled.div`
    display:flex;
    flex-direction:column;
    align-items:center;
`;

const Settings_section = styled.section`
    flex:1 1 50%;
`;

const Avatar_settings = styled.label`
    cursor:pointer;
    background-color:#ddd;
    width:55px;
    display:flex;
    justify-content:center;
    color:#333;
    position:absolute;
    top:0;
    right:0;
    padding:.7rem;
    &:hover{
        background-color:#eee;
    }
`;

const Avatar_section = styled.figure`
    position:relative;
`;

const Avatar_img = styled.img`
    max-width:180px;
    padding:3px;
    border:1px solid #ddd;    
    position:relative;
`;

const rotateAnim = keyframes`
    from{
        transform:rotate(0deg);
    }
    to{
        transform:rotate(360deg);
    }
`;

const Avatar_inProgress = styled.div`
    position: absolute;
    top:0;
    left:0;
    width:100%;
    height:100%;
    background-color:rgba(150,150,150,.3);
    display:flex;
    justify-content:center;
    align-items:center;
    > span {
        width:60px;
        height:60px;
        border:2px solid transparent;        
        border-top:2px solid #fff;
        border-bottom:2px solid #fff;
        display:flex;
        justify-content:center;
        align-items:center;
        border-radius:50%;
        animation:${rotateAnim} .7s linear infinite;
        &:after {
            content:"";
            display:block;
            width:45px;
            height:45px;
            border:2px solid transparent;
            border-left:2px solid #fff;
            border-right:2px solid #fff;
            border-radius:50%;          
            animation:${rotateAnim} .9s linear infinite;            
        }
    }
`;

const Avatar_remove = styled.a`
    cursor:pointer;
    transition:all .2s ease-in;    
    &:hover{
        color:red;
    }
`;

const Input = styled.input`
    padding:1rem;
    border:none;
    font-size:20px;
    box-shadow:0 1px 3px rgba(128,128,128,0.2);
    outline-color:#ddd;
    margin-bottom:1.5rem;
`;

const Form_wrapper = styled.div`
    display: flex;
    flex-direction: column;
`;

const Label = styled.label`
    padding-bottom:.5rem;
    font-weight:500;
`;

const Input_group = styled.div`
    display:flex;
    padding:.3rem;
`;

const Label_check = styled.label`
    float:left;
    margin-left:1rem;
`;

const placeholderImg = 'https://lh6.googleusercontent.com/-ph4JkGJ7wdY/AAAAAAAAAAI/AAAAAAAAAYw/g2wqnP4pMhM/photo.jpg';

const Profile = props => {
    const { userData, state, data, isPasswordFormInvalid, modalPassword, isUploading, setState,
        sendFile, openModal, closeModal, setUserInfo, resetAvatar, setUsernameInputState,
        setEmailInputState, setShouldShowTimerOnTitle, validatePasswordForm, Icon_button } = props;

    return (<Wrapper>
        <Header>
            <Heading>My Profile</Heading>
            <Button_bar>
                <Button_password onClick={openModal}>
                    <Icon_button name="settings" /> Change password
                    </Button_password>
                <Button_done onClick={setUserInfo}>
                    <Icon_button name="done" /> Done
                        </Button_done>
            </Button_bar>
        </Header>
        <Main_content>
            <Side>
                <Avatar_section>
                    <Avatar_img src={userData.avatar || placeholderImg} />
                    {isUploading && <Avatar_inProgress><span></span></Avatar_inProgress>}
                    <Avatar_settings>
                        <Icon name="settings" />
                        <form encType="multipart/form-data" name="formAv" id="formAvatar">
                            <input className="inputfile-hidden" type="file" name="avatar"
                                onChange={sendFile} id="avInput" />
                        </form>
                    </Avatar_settings>
                </Avatar_section>
                {userData.avatar && <Avatar_remove onClick={resetAvatar} ><Icon name="close" /></Avatar_remove>}
            </Side>
            <Settings_section>
                <Form_wrapper>
                    <Label htmlFor="username">Your name</Label>
                    <Input name="username" value={state.data.username} onChange={setUsernameInputState} />
                    <Label htmlFor="email">Email</Label>
                    <Input name="email" value={state.data.email} onChange={setEmailInputState} />
                    <Input_group>
                        <Input type="checkbox" name="showtitletimer" value={state.data.settings.shouldShowTimerOnTitle}
                            checked={state.data.settings.shouldShowTimerOnTitle}
                            onChange={setShouldShowTimerOnTitle} />
                        <Label_check htmlFor="showtitletimer"><span></span>Show running time on the title bar</Label_check>
                    </Input_group>
                </Form_wrapper>
            </Settings_section>
        </Main_content>

        <ProfileModal isOpen={state.isModalOpen} onRequestClose={closeModal}
            state={state} modalPassword={state.modalPassword} setState={setState}
            validatePasswordForm={validatePasswordForm} />

    </Wrapper>);
}

export default Profile;