import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import '../../App.css';
import axios from 'axios';
import { Redirect } from 'react-router';
import constants from '../../utils/constants';


class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loginId: '',
      password: '',
      errMsg: '',
    };
  }

    IsValueEmpty = (Value) => {
      if (''.localeCompare(Value.replace(/\s/g, '')) === 0) return true;
      return false;
    }

    loginIdChangeHandler = (e) => {
      this.setState({
        loginId: e.target.value,
      });
    }

    passwordChangeHandler = (e) => {
      this.setState({
        password: e.target.value,
      });
    }

    submitLogin = (e) => {
      e.preventDefault();
      const data = {
        loginId: this.state.loginId,
        password: this.state.password,
      };

      // All validations
      if (this.IsValueEmpty(data.loginId) || this.IsValueEmpty(data.password)) {
        this.setState({
          errMsg: 'Fiels cannot be empty',
        });
      } else {
        axios.post(`${constants.BACKEND_SERVER.URL}/users/login`, data)
          .then((response) => {
            if (response.status === 200) {
              localStorage.setItem('twitterToken', response.data.token);
              localStorage.setItem('userId', response.data._id);
              localStorage.setItem('userName', response.data.userName);
              localStorage.setItem('name', response.data.name);
              if (response.data.imageURL) {
                localStorage.setItem('imageURL', response.data.imageURL);
              } else {
                localStorage.setItem('imageURL', 'https://cdn2.iconfinder.com/data/icons/user-icon-2-1/100/user_5-15-512.png');
              }
            }
            this.setState({
              loginId: '',
              password: '',
            });
          })
          .catch(() => {
            this.setState({
              errMsg: 'Failed to login',
            });
          });
      }
    }

    render() {
      let redirectVar = null;
      if (localStorage.getItem('twitterToken')) {
        redirectVar = <Redirect to="/user/home" />;
      }

      return (
        <div>
          {redirectVar}
          <div className="container-fluid">
            <div className="row">
              <div className="col-md-4 offset-md-4 mt-5 p-5 shadow">
                <h1 className="text-center text-primary"><i className="fab fa-twitter" /></h1>
                <h5 className="text-center font-weight-bolder">Login to Twitter</h5>
                <div className="mt-3">
                  <div className="form-group">
                    <label htmlFor="userLoginID">Phone, email, or username</label>
                    <input type="text" id="userLoginID" onChange={this.loginIdChangeHandler} value={this.state.loginId} className="form-control" required />
                  </div>
                  <div className="form-group">
                    <label htmlFor="userPassword">Password</label>
                    <input type="password" id="userPassword" onChange={this.passwordChangeHandler} value={this.state.password} className="form-control" required />
                  </div>
                  <div className="text-center">
                    <p className="text-danger">
                      {' '}
                      {this.state.errMsg}
                      {' '}
                    </p>
                  </div>
                  <div className="form-group">
                    <input type="submit" id="userLogin" onClick={this.submitLogin} className="form-control bg-primary text-white" value="Login" />
                  </div>
                  <div className="panel text-center">
                    <p>or</p>
                    <p><Link to="/create-account">Create account</Link></p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }
}
// export Login Component
export default Login;
