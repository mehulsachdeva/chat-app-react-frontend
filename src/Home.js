import React, { Component } from 'react';
import { Redirect, Link } from 'react-router-dom';
import axios from 'axios';
import ls from 'local-storage';

import './Home.css';

export default class Home extends Component {

  constructor(props){
    super(props);
    const token = ls.get("token");

    let loggedIn = true;

    if(token == null){
      loggedIn = false;
    }

    this.state = {
      loggedIn: loggedIn,
      username: token,
      istousernameexists: false,
      tousername: "",
      userlist: [],
      message: ""
    }
  }

  componentDidMount(){
    axios.get("http://localhost:8081/ChatSystem/chatsystem/userlist?for=" + this.state.username)
      .then(res => {
        let array = res.data.split(",");

        //remove localStorage with key "to"
        ls.remove("to");

        //remove empty element from end
        array.pop();

        // get each user and unseen messages if any
        for(let x in array){

          axios.get("http://localhost:8081/ChatSystem/chatsystem/unseenchats?from=" + this.state.username + "&to=" + array[x])
            .then(res => {
              let shortened_chat_box_info = res.data;

              let subarray = { "username": array[x],
                               "unseen": shortened_chat_box_info[0],
                               "lastmsg": shortened_chat_box_info[1],
                               "status": shortened_chat_box_info[2]
                             };
              this.setState({
                userlist: this.state.userlist.concat(subarray)
              })
          })
        }
      })
  }

  findUsername = (e) => {
    e.preventDefault();
    axios.get("http://localhost:8081/ChatSystem/chatsystem/findusername?username=" + this.refs.to_username.value)
      .then(res => {
        if(res.data === "success"){
          this.setState({
            istousernameexists: true,
            tousername: this.refs.to_username.value,
            message: ""
          })
        }else{
          this.setState({
            message: "No User In Database"
          })
        }
      })
  }

  viewChat = (e) => {
    e.preventDefault();
    this.setState({
      istousernameexists: true,
      tousername: e.target.id
    })
  }

  render() {

    if(!this.state.loggedIn){
      return <Redirect to="/" />
    }

    if(this.state.istousernameexists){
      ls.set("to", this.state.tousername);
      return <Redirect to="/chat" />
    }

    const status = (para1, para2) => {
      if(para1 === "sentandseen"){
        return(
            <i className="fa fa-paper-plane"></i>
        );
      }
      else if(para1 === "sentandunseen"){
        return(
            <i className="fa fa-paper-plane-o"></i>
        );
      }
      else{
        if(para2 !== "0"){
          return(
              <i className="fa fa-mail-reply"></i>
          );
        }else{
          return(
              <i className="fa fa-reply-all"></i>
          );
        }
      }
    }

    const checkUnseen = (para1, para2, para3) => {
      if(para1 !== "0"){
        return(
          <div className="lastmsg">
            <div className="unseen">{para1}</div>
            <div className="msg">{status(para2, para1)} {para3}</div>
          </div>
        );
      }else{
        return(
          <div className="lastmsg-seen">
            <div className="msg-seen">{status(para2, para1)} {para3}</div>
          </div>
        );
      }
    }

    return(
      <div className="container">

          <div className="nav-bar">
            <div className="user-logined">Hello, {this.state.username}</div>
            <div className="link">
              <Link to="/logout" style={{ textDecoration: 'none', color: 'white' }}>Logout</Link>
            </div>
          </div>

          <div className="find-user">
            <input type="text" ref="to_username" placeholder="Find User In Database"/>
            <input type="submit" value="Find" onClick={this.findUsername}/>
          </div>

          <div className="message">{this.state.message}</div>

          <div className="chat-lists">
            {
              this.state.userlist.map((user, i) => {
                return(

                  <div key={i} className="shortened-chat-box">
                    <div className="username">{user.username}</div>
                    {checkUnseen(user.unseen, user.status, user.lastmsg)}
                    <button id={user.username} onClick={this.viewChat}>Chat</button>
                  </div>

                );
              })
            }
          </div>

      </div>
    );
  }
}
