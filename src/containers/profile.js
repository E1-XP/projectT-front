import React from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';

import * as actions from '../actions';
import Modal from 'react-modal';
import Icon from '../components/icon';

const Wrapper = styled.div`
    width:100%;
    max-width:1200px;
    margin:1rem auto;
    padding:1rem;
`;

const Header = styled.header`
    display:flex;
    justify-content:space-between;
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
    &:hover{
        
    }
`;

const Button_done = styled(Button) `
    background-color:#47be00;
    margin-left: auto;
    display: flex;
    justify-content: center;
`;

const Button_password = styled(Button) `
    background-color:rgb(50,50,50);
    margin-right:.7rem;
`;

const Side = styled.div`

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
    border:1px solid #ddd;
    position:relative;
`;

const Avatar_img = styled.img`
    max-width:170px;
    position:relative;
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

const Label_check = styled.label`
    float:left;
    margin-left:1rem;
`;

const Checkbox = styled.input`
   /* -moz-appearance:none;
   -webkit-appearance:none; */
   /* background-color: #fafafa;
	border: 1px solid #ccc;
	padding:initial;
	display: inline-block;
    &:checked{
        color:#47be00;
    } */
    &:checked, &:not(:checked) { 
        display:none;
    }
 + label::before {
    content: "";  
    display: inline-block;  
    width: 15px;  
    height: 15px;  
    vertical-align:middle;
    margin-right: 8px;  
    border:1px solid #aaa;    
    border-radius: 1px;  
}
&:checked + label::before {
    content:"\\2714"; 
    color:white;
    background-color: #666; 
    text-align:center;
    line-height:15px;
    text-shadow:0px 0px 3px #eee;
} 
`;

const Icon_button = props => (<Icon fill="#ddd" size="22px" {...props} />);

const placeholderImg = 'https://lh6.googleusercontent.com/-ph4JkGJ7wdY/AAAAAAAAAAI/AAAAAAAAAYw/g2wqnP4pMhM/photo.jpg';

class Profile extends React.Component {
    constructor() {
        super();

        this.state = {
            isModalOpen: false,
            isDropdownOpen: false,
            isPasswordFormInvalid: false,
            errorMessage: '',
            data: {
                email: "",
                username: "",
                settings: {
                    shouldShowTimerOnTitle: true
                }
            },
            modalPassword: {
                current: '',
                newpass: '',
                newpass2: ''
            }
        }
    }

    componentDidMount() {
        this.setState({
            data: {
                email: this.props.userData.email,
                username: this.props.userData.username,
                settings: { shouldShowTimerOnTitle: this.props.settings.shouldShowTimerOnTitle }
            }
        });
    }

    setUsernameInputState = e => {
        this.setState({
            data: {
                ...this.state.data,
                username: e.target.value
            }
        });
    }

    setEmailInputState = e => {
        this.setState({
            data: {
                ...this.state.data,
                email: e.target.value
            }
        });
    }

    setShouldShowTimerOnTitle = e => {
        this.setState({
            data: {
                ...this.state.data,
                settings: { shouldShowTimerOnTitle: e.target.checked }
            }
        });
    }

    openModal = () => {
        this.setState({ isModalOpen: true });
    }

    closeModal = () => {
        this.setState({
            isModalOpen: false,
            isPasswordFormInvalid: false,
            errorMessage: '',
            userInfo: {},
            modalPassword: {
                current: '',
                newpass: '',
                newpass2: ''
            }
        });
    }

    sendFile = e => {
        const { userData } = this.props;
        const file = e.target.files[0];

        this.props.sendFile(userData._id, file);
    }

    validatePasswordForm = () => {
        const { userData, setPassword } = this.props;
        const { modalPassword } = this.state;

        this.setState({
            isPasswordFormInvalid: false,
            errorMessage: ``
        });

        if (!modalPassword.current || !modalPassword.newpass || !modalPassword.newpass2) this.setState({
            isPasswordFormInvalid: true,
            errorMessage: `Passwords can't be empty`
        });

        else if (modalPassword.newpass !== modalPassword.newpass2) this.setState({
            isPasswordFormInvalid: true,
            errorMessage: 'New passwords are not equal'
        });

        else {
            setPassword(userData._id, modalPassword).then(res => {
                const isCorrect = res;
                console.log(isCorrect);

                if (!isCorrect) {
                    this.setState({
                        isPasswordFormInvalid: true,
                        errorMessage: `Incorrect current password`
                    });
                }
                else this.closeModal();
            });
        }
    }

    setUserInfo = () => {
        const { setUserInfo, userData } = this.props;
        const { data } = this.state;
        console.log(data);
        setUserInfo(userData._id, data);
    }

    render() {
        const { userData } = this.props;
        const { data, isPasswordFormInvalid, modalPassword } = this.state;

        const modalStyle = {
            overlay: { backgroundColor: 'rgba(0,0,0,.2)' },
            content: { width: '550px', margin: '0 auto', height: isPasswordFormInvalid ? '440px' : '400px', padding: '0', boxShadow: `0 5px 15px rgba(128,128,128,0.5)` }
        };
        return (<Wrapper>
            <Header>
                <h2>My Profile</h2>
                <Button_bar>
                    <Button_password onClick={this.openModal}>
                        <Icon_button name="settings" /> Change password
                    </Button_password>
                    <Button_done onClick={this.setUserInfo}>
                        <Icon_button name="done" /> Done
                        </Button_done>
                </Button_bar>
            </Header>
            <Main_content>
                <Side>
                    <Avatar_section>
                        <Avatar_img src={userData.avatar || placeholderImg} />
                        <Avatar_settings>
                            <Icon name="settings" />
                            <input className="inputfile-hidden" type="file" name="upload"
                                onChange={this.sendFile} />
                        </Avatar_settings>
                    </Avatar_section>
                </Side>
                <Settings_section>
                    <Form_wrapper>
                        <Label htmlFor="username">Your name</Label>
                        <Input name="username" value={data.username} onChange={this.setUsernameInputState} />
                        <Label htmlFor="email">Email</Label>
                        <Input name="email" value={data.email} onChange={this.setEmailInputState} />
                        <Input_group>
                            <Checkbox type="checkbox" name="showtitletimer" value={data.settings.shouldShowTimerOnTitle}
                                checked={data.settings.shouldShowTimerOnTitle}
                                onChange={this.setShouldShowTimerOnTitle} />
                            <Label_check htmlFor="showtitletimer"> Show running time on the title bar</Label_check>
                        </Input_group>
                    </Form_wrapper>
                </Settings_section>
            </Main_content>

            {/* <!--modal--> */}
            <Modal isOpen={this.state.isModalOpen} shouldCloseOnEsc={true} style={modalStyle}
                shouldCloseOnOverlayClick={true} onRequestClose={this.closeModal} >
                <div>
                    <Modal_header>
                        Change Password
                    </Modal_header>
                    <Modal_error visible={this.state.isPasswordFormInvalid}>
                        {this.state.errorMessage}
                    </Modal_error>
                    <Modal_content>
                        <Input value={modalPassword.current} placeholder="Current password" type="password"
                            onChange={e => this.setState({ modalPassword: { ...this.state.modalPassword, current: e.target.value } })} />
                        <Input value={modalPassword.newpass} placeholder="New password" type="password"
                            onChange={e => this.setState({ modalPassword: { ...this.state.modalPassword, newpass: e.target.value } })} />
                        <Input value={modalPassword.newpass2} placeholder="New password again" type="password"
                            onChange={e => this.setState({ modalPassword: { ...this.state.modalPassword, newpass2: e.target.value } })} />
                        <Button_done onClick={this.validatePasswordForm}> Save </Button_done>
                    </Modal_content>
                </div>
            </Modal>

        </Wrapper>);
    }
}

const mapStateToProps = ({ user }) => ({
    userData: user.userData,
    settings: user.settings
});

const mapDispatchToProps = dispatch => ({
    sendFile: (uid, file) => dispatch(actions.user.sendAvatar(uid, file)),
    setPassword: (uid, data) => dispatch(actions.user.setPassword(uid, data)),
    setUserInfo: (uid, data) => dispatch(actions.user.setUserInfo(uid, data))
});

export default connect(mapStateToProps, mapDispatchToProps)(Profile);