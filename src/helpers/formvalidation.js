const handleValidation = (state, setState) => {
    const { email, username, password, password2 } = state;
    const isSignUp = location.pathname.toLowerCase().slice(1) === 'signup';

    const emailRegExp = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    const usernameRegExp = /^([a-zA-Z0-9_-]){2,32}$/;
    const passwordRegExp = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/;
    const newAccountValidation = {
        email: true,
        usern: true,
        pass: true,
        pass2: true
    };
    let validationMessage = [];

    ///reset state
    setState({
        validationMessage: ""
    });

    if (!isSignUp && email.length && password.length) return true;
    else if (!isSignUp) return setState({ validationMessage: "fields can't be empty" });

    if (!new RegExp(emailRegExp).test(email)) {
        validationMessage.push("email adress is not valid");
        newAccountValidation.email = false;
    }
    if (!new RegExp(usernameRegExp).test(username)) {
        validationMessage.push("username must be between 2 and 32 alphanumeric or '_' and '-' characters long");
        newAccountValidation.usern = false;
    }

    if (!new RegExp(passwordRegExp).test(password) || password !== password2) {
        validationMessage.push("password must contain at least 8 characters, one upper and lowercase letters and one number");
        newAccountValidation.pass = false;
        newAccountValidation.pass2 = false;
    }

    setState({
        validationMessage: validationMessage.join(", "),
        newAccountValidation: { ...newAccountValidation }
    });

    return validationMessage.length ? false : true;
}

export default handleValidation;