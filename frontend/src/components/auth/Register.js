import React from "react";
import axios from "axios";

class Register extends React.Component {
    state = {
        email: '',
        password: '',
        repeatpassword: '',
        firstName: '',
        lastName: '',
        error: null,
        tooltip1: false,
        tooltip2: false,
    }

    onChange = e => {
        this.setState({ [e.target.name]: e.target.value });
    }

    handleSubmit = e => {
        const { email, password, repeatpassword } = this.state;
        e.preventDefault();
        if (!email.includes('@' && '.') || email.length < 6) {
            this.setState({ error: 'Please provide a valid email address.'});
        } else if (password.length < 8 || repeatpassword.length < 8) {
            this.setState({ error: `Passwords must be at least 8 characters long.`});
        } else if (password !== repeatpassword) {
            this.setState({ error: `Passwords must match.` });
        } else {
            axios.post(`${process.env.REACT_APP_REGISTER_API}`, this.state)
                .then(response => {
                    // #TODO: how Djoser handles registration tokens/confirmation emails
                    // localStorage.setItem('token', response.data.token);
                    
                    // BELOW: axios post for dev purposes
                    axios.post(`${process.env.REACT_APP_LOGIN_API}`, { email, password })
                        .then(response => {
                            this.setState({ error: `Success`});
                            localStorage.setItem('token', response.data.token);
                            // this.props.history.push('/jobs'); 
                            // once jobs component is built, need to incorporate withRouter() from react-router-dom to access history object
                        })
                        .catch(err => {
                            console.log(err);
                        })
                })
                .catch(err => {
                    this.setState({ error: `Error processing your request. Please try again.`})
                });
        }
    }

    showTooltip1 = () => {
        this.setState({ tooltip1: true });
    }

    hideTooltip1 = () => {
        this.setState({ tooltip1: false });
    }

    passwordChange1 = e => {
        this.setState({ [e.target.name]: e.target.value });
        if (e.target.value.length >= 8) this.setState({ tooltip1: false });
        else this.setState({ tooltip1: true });
    }

    showTooltip2 = () => {
        this.setState({ tooltip2: true });
    }

    hideTooltip2 = () => {
        this.setState({ tooltip2: false });
    }

    passwordChange2 = e => {
        this.setState({ [e.target.name]: e.target.value });
        if (e.target.value.length >= 8) this.setState({ tooltip2: false });
        else this.setState({ tooltip2: true });
    }

    render() {
        const { email, password, repeatpassword, firstName, lastName, error, tooltip1, tooltip2 } = this.state;
        return (
            <form className="form">
                <div className="message">
                    <p className="error">{error}</p>
                </div>
                <h3>Register</h3>
                <input type="email" name="email" autoComplete="email" value={email} placeholder="email" onChange={this.onChange} required/>
                <div>
                    {tooltip1 ? (
                        <div className="message tooltip">
                            <p>8 characters minimum</p>
                        </div>
                    ) : (null)}
                    <input type="password" name="password" autoComplete="off" value={password} placeholder="password" onChange={this.passwordChange1} onFocus={this.showTooltip1} onBlur={this.hideTooltip1} required/>
                </div>
                <div>
                    {tooltip2 ? (
                        <div className="message tooltip">
                            <p>8 characters minimum</p>
                        </div>
                    ) : (null)}
                    <input type="password" name="repeatpassword" autoComplete="off" value={repeatpassword} placeholder="repeat password" onChange={this.passwordChange2} onFocus={this.showTooltip2} onBlur={this.hideTooltip2} required/>
                </div>
                <input type="text" name="firstName" autoComplete="given-name" value={firstName} placeholder="First Name" onChange={this.onChange}/>
                <input type="text" name="lastName" autoComplete="family-name" value={lastName} placeholder="Last Name" onChange={this.onChange}/>
                <button onClick={this.handleSubmit}>Sign Up</button>
            </form>
        );
    }
}

export default Register;