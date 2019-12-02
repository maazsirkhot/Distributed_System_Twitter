import React, { Component } from 'react';
import '../../App.css';
import { Redirect } from 'react-router';

class Root extends Component {
  render() {
    let RedirectVar = '';
    // console.log('URL', this.props.location.pathname);
    if (this.props.location.pathname === '/') {
      RedirectVar = <Redirect to="/welcome" />;
    }
    return (
      <div>
        {RedirectVar}
      </div>
    );
  }
}
// export Root Component
export default Root;
