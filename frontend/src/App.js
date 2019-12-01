
import React, { Component } from 'react';
import './App.css';
import Main from './components/main';
import {BrowserRouter} from 'react-router-dom';
import axios from 'axios'

//App Component
class App extends Component {

  componentWillMount() {
    if(localStorage.getItem('twitterToken') != null) {
		axios.defaults.headers.common['Authorization'] = `Bearer ${localStorage.getItem('twitterToken')}` 
    }
  }

  render() {
    return (
      //Use Browser Router to route to different pages
      <BrowserRouter>
        <div>
          {/* App Component Has a Child Component called Main*/}
          <Main/>
        </div>
      </BrowserRouter>
    )
  }
}
//Export the App component so that it can be used in index.js
export default App
