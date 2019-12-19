import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import ls from 'local-storage';

import Login from './Login';

export default class Logout extends Component {
  constructor(props){
    super(props);

    //if exists
    ls.remove("token");
    ls.remove("to");
  }

  render() {
    return(
      <Redirect to="/" />
    );
  }
}
