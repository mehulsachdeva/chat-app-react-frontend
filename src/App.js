import React, { Component } from 'react';
import { BrowserRouter, Route } from 'react-router-dom';

import Login from './Login';
import Home from './Home';
import Chat from './Chat';
import Logout from './Logout';

export default class App extends Component {

  render() {
    return(

      <BrowserRouter>
        <div>
          <Route exact path="/" component={Login} />
          <Route path="/home" component={Home} />
          <Route path="/chat" component={Chat} />
          <Route path="/logout" component={Logout} />
        </div>
      </BrowserRouter>

    );
  }
}
