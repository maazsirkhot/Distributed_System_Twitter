import React, { Component } from 'react';
import '../../App.css';
import { Redirect } from 'react-router';
import axios from 'axios';
import constants from '../../utils/constants';

class Logout extends Component {
  componentDidMount() {
    console.log(constants.TOKEN);
    axios.put(`${constants.BACKEND_SERVER.URL}/users/logout`, constants.TOKEN);
  }

  render() {
    const RedirectVar = <Redirect to="/welcome" />;
    localStorage.removeItem('imageURL');
    localStorage.removeItem('twitterToken');
    localStorage.removeItem('userName');
    localStorage.removeItem('userId');
    localStorage.removeItem('name');
    return (
      <div>
        {RedirectVar}
      </div>
    );
  }
}
// export Logout Component
export default Logout;
