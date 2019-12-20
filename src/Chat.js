import React, { Component } from 'react';
import { Redirect, Link } from 'react-router-dom';
import axios from 'axios';
import ls from 'local-storage';

import './Chat.css';

export default class Chat extends Component {

  constructor(props){
    super(props);

    const token = ls.get("token");
    const tousername = ls.get("to");

    let loggedIn = true;

    if(token == null){
      loggedIn = false;
    }

    this.state = {
      username: token,
      loggedIn: loggedIn,
      tousername: tousername,
      chats: []
    }
  }

  updateSeen(){
    axios.get("http://localhost:8081/ChatSystem/chatsystem/updateseen?from=" + this.state.tousername + "&to=" + this.state.username)
      .then(res => {
        console.log("updated seen!");
    })
  }

  refreshChat(){
    this.updateSeen();
    axios.get("http://localhost:8081/ChatSystem/chatsystem/getchats?username=" + this.state.username + "&user1=" + this.state.username + "&user2=" + this.state.tousername)
      .then(res => {
        this.setState({
          chats: res.data
        }, () => {
          console.log(this.state.chats);
        })
    })
    //this.updateSeen();
  }

  componentDidMount(){
    this.updateSeen();
    this.refreshChat();
  }

  sendChat = (e) => {
    e.preventDefault();
    axios.get("http://localhost:8081/ChatSystem/chatsystem/sendchat?username=" + this.state.username + "&tousername=" + this.state.tousername + "&message=" + this.refs.message.value)
      .then(res => {
        this.refs.message.value = "";
        this.refreshChat();
      })
  }

  render() {

    if(!this.state.loggedIn){
        return <Redirect to="/" />
    }

    if(!this.state.tousername){
      return <Redirect to="/home" />
    }

    return(
      <div className="container">

        <div className="nav-bar">
          <div className="back-arrow">
            <Link to="/home" style={{ textDecoration: 'none', color: 'white'}}><i className="fa fa-arrow-left"></i></Link>
          </div>
          <div className="to-user">{this.state.tousername}</div>
          <div className="user-logined">Hello, {this.state.username}</div>
          <div className="link">
            <Link to="/logout" style={{ textDecoration: 'none', color: 'white' }}>Logout</Link>
          </div>
        </div>

        <div className="chat-box">
            {
              this.state.chats.map((chat, i) => {
                if(chat[2] === "sentandseen"){
                  return (

                    <div key={i} className="sent-chat">
                        <span>{chat[1]}</span>
                        <span style={{ fontSize: "10px", marginTop: "10px", position: "absolute", marginLeft: "5px" }}><i className="fa fa-paper-plane"></i></span>
                    </div>

                  );
                }
                else if(chat[2] === "sentandunseen"){
                  return (

                    <div key={i} className="sent-chat">
                        <span>{chat[1]}</span>
                        <span style={{ fontSize: "10px", marginTop: "10px", position: "absolute", marginLeft: "5px" }}><i className="fa fa-paper-plane-o"></i></span>
                    </div>

                  );
                }
                else if(chat[2] === "receivedandseen"){
                  return (

                    <div key={i} className="received-chat">
                        <span style={{ fontSize: "10px", marginTop: "10px", position: "absolute", marginLeft: "-15px" }}><i className="fa fa-reply-all"></i> </span>
                        <span>{chat[1]}</span>
                    </div>

                  );
                }
                else{
                  return (

                    <div key={i} className="received-chat">
                        <span style={{ fontSize: "10px", marginTop: "10px", position: "absolute", marginLeft: "-15px" }}><i className="fa fa-mail-reply"></i> </span>
                        <span>{chat[1]}</span>
                    </div>

                  );
                }
              })
            }
        </div>

        <div className="send-chat">
          <input type="text" ref="message" placeholder="Type Your Message Here..."/>
          <input type="submit" value="Send" onClick={this.sendChat} />
        </div>

      </div>
    );
  }
}
