import React, { Component } from 'react';
import { Redirect, Link } from 'react-router-dom';
import axios from 'axios';
import ls from 'local-storage';

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

    return(
      <div className="container">

          <div className="user-logined">{this.state.username}</div>

          <div>
            <Link to="/logout">Logout</Link>
          </div>

          <div>
            <input type="text" ref="to_username" />
            <input type="submit" value="Find" onClick={this.findUsername}/>
          </div>

          <div className="message">{this.state.message}</div>

          <div className="chat-lists">
            {
              this.state.userlist.map((user, i) => {
                return(

                  <div key={i} className="shortened-chat-box">
                    <div>{user.username}</div>
                    <div>Unseen: {user.unseen}</div>
                    <div>Last Message: {user.lastmsg} ({user.status})</div>
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
