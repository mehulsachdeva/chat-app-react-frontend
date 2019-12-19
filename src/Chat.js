import React, { Component } from 'react';
import { Redirect, Link } from 'react-router-dom';
import axios from 'axios';
import ls from 'local-storage';

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

  refreshChat(){
    axios.get("http://localhost:8081/ChatSystem/chatsystem/getchats?username=" + this.state.username + "&user1=" + this.state.username + "&user2=" + this.state.tousername)
      .then(res => {
        this.setState({
          chats: res.data
        })
    })
    axios.get("http://localhost:8081/ChatSystem/chatsystem/updateseen?from=" + this.state.tousername + "&to=" + this.state.username)
      .then(res => {
        console.log("updated seen!");
    })
  }

  componentDidMount(){
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

        <div>
          <Link to="/home">Go Back</Link>
        </div>

        <div>
          <span>{this.state.tousername}</span>
        </div>

        <div className="chat-box">
        {
          this.state.chats.map((chat, i) => {
            if(chat[2] === "sent"){
              return (

                <div key={i} className="sent-chat">
                    <span>{chat[1]} - {chat[2]} </span>
                </div>

              );
            }else{
              return (

                <div key={i} className="received-chat">
                    <span>{chat[1]} - {chat[2]} </span>
                </div>

              );
            }
          })
        }
        </div>

        <div className="send-chat">
          <input type="text" ref="message" />
          <input type="submit" value="Send" onClick={this.sendChat} />
        </div>

      </div>
    );
  }
}
