import React from 'react';
import { connect } from 'react-redux';

import * as actions from '../actions';

import ProfileComponent from '../components/profile';
import Icon from '../components/icon';

const Icon_button = props => (<Icon fill="#ddd" size="22px" {...props} />);

class Profile extends React.Component {
    constructor() {
        super();

        this.state = {
            isModalOpen: false,
            isDropdownOpen: false,
            isUploading: false,
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

        this.setStateBind = this.setState.bind(this);
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
        const data = new FormData(document.querySelector('#formAvatar'));

        this.setState({ isUploading: true });

        this.props.sendFile(userData._id, data).then(() => {
            document.getElementById('avInput').value = null;
            this.setState({ isUploading: false });
        });
    }

    resetAvatar = () => {
        const { userData, setUserInfo } = this.props;

        setUserInfo(userData._id, { avatar: '' });
    }

    validatePasswordForm = () => {
        const { userData, setPassword } = this.props;
        const { modalPassword } = this.state;
        const passwordRegExp = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/;

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

        else if (!new RegExp(passwordRegExp).test(modalPassword.newpass)) this.setState({
            isPasswordFormInvalid: true,
            errorMessage: 'you must use: 8+ characters, number and upper/lowercase letters'
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
        const { data, isPasswordFormInvalid, modalPassword, isUploading } = this.state;

        return (<ProfileComponent state={this.state} setState={this.setStateBind} userData={userData}
            sendFile={this.sendFile} openModal={this.openModal} setUserInfo={this.setUserInfo}
            resetAvatar={this.resetAvatar} setUsernameInputState={this.setUsernameInputState} closeModal={this.closeModal}
            setEmailInputState={this.setEmailInputState} setShouldShowTimerOnTitle={this.setShouldShowTimerOnTitle}
            Icon_button={Icon_button} validatePasswordForm={this.validatePasswordForm} />);
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