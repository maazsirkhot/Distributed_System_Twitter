import React, {Component} from 'react'
import '../../App.css'
import {Redirect} from 'react-router'

class Logout extends Component {
    
    render(){
        
        var RedirectVar = <Redirect to= "/welcome"/>
        localStorage.removeItem('imageURL')
        localStorage.removeItem('twitterToken')
        localStorage.removeItem('userName')
        localStorage.removeItem('userId')
        return(
            <div>
                { RedirectVar }
            </div>
        )
    }
}
//export Logout Component
export default Logout