import React, { Component } from 'react';
import axios from 'axios';
import { Redirect } from 'react-router-dom';
import ls from 'local-storage'

import './Login.css';

import Home from './Home';

export default class Login extends Component {

  constructor(props){
    super(props);
    this.state = {
      username: '',
      loggedIn: false,
      message_register: '',
      message_login: ''
    }
  }

  clearLocalStorage(){
    ls.remove("token");
    ls.remove("to");
  }

  registerUser = (e) => {
    e.preventDefault();
    axios.get("http://localhost:8081/ChatSystem/chatsystem/register?username=" + this.refs.register_username.value)
    .then(res => {
      if(res.data === "success"){
        this.setState({
          message_register: "Successfully Registered",
        })
      }else{
        this.setState({
          message_register: "Error In Registration",
        })
      }
    })
  }

  authenticateUser = (e) => {
    e.preventDefault();
    axios.get("http://localhost:8081/ChatSystem/chatsystem/login?username=" + this.refs.login_username.value)
    .then(res => {
      console.log(res.data === "success");
      if(res.data === "success"){
        //set localStorage before updating state
        ls.set("token", this.refs.login_username.value);

        this.setState({
          username: this.refs.login_username.value,
          loggedIn: true,
          message_login: ''
        })

      }else{
        //if any exists
        this.clearLocalStorage();

        this.setState({
          loggedIn: false,
          message_login: "Invalid Credentials",
        })
      }
    })
  }

  render() {

    if(this.state.loggedIn){
      return <Redirect to="/home" />
    }

    return(
      <div className="container">

        <div className="register">
          <div className="header">REGISTER</div>
          <form method="post" name="register-form">
            <input type="text" ref="register_username" />
            <input type="submit" value="Register" onClick={this.registerUser} />
          </form>
          <div className="message">{this.state.message_register}</div>
        </div>

        <div className="login">
          <div className="header">LOGIN</div>
          <form method="post" name="login-form">
              <input type="text" ref="login_username" />
              <input type="submit" value="Login" onClick={this.authenticateUser} />
          </form>
          <div className="message">{this.state.message_login}</div>
        </div>
      </div>
    );
  }
}
