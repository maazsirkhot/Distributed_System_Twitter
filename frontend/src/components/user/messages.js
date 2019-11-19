import React, { Component } from 'react'
import '../../App.css'
import axios from 'axios'
import Navbar from '../navbar/navbar'
import constants from '../../utils/constants'
import {Launcher} from 'react-chat-window'
import picture from './pexels-photo-556416.jpeg';

class UserMessages extends Component {

    constructor(props){
        super(props);
        this.state = {
            storedUserName: localStorage.getItem('userName'),
            allMessages : "",
            messagesReceived : false,
        }
        this.getConversation = this.getConversation.bind(this);
    }

    changeHandler = (e) => {
        this.setState({
            [e.target.name] : e.target.value
        })
    }

    componentWillMount(){
        console.log(constants.TOKEN);
        axios.get(constants.BACKEND_SERVER.URL + "/messages/inbox/" + localStorage.getItem('userName'), constants.TOKEN)
        .then((response, reject) => {
            if(response.status === 200){
                console.log(response.data)
                this.setState({
                    allMessages : response.data,
                    messagesReceived : true
                })
            }
            else{
                this.setState({
                    messagesReceived : false
                })
            }
        })
        .catch(err => {
            console.log(err);
            this.setState({
                messagesReceived : false
            })
        })
    }

    getConversation = (e) => {
        var userName2 = e.target.id;
        console.log(e.target.id);

        axios.get(constants.BACKEND_SERVER.URL + "/messages/conversation/" + localStorage.getItem('userName') + "/" + userName2, constants.TOKEN)
        .then((response, reject) => {
            if(response.status === 200){
                console.log(response.data)
                var singleConversation = response.data;

                var otherParticipantDetails = singleConversation.participants.filter(participant => {
                    return participant.userName != this.state.storedUserName; 
                })
                this.setState({
                    singleConversation : response.data,
                    conversationReceived : true,
                    otherParticipant : otherParticipantDetails[0]
                })
            } else {
                this.setState({
                    conversationReceived : false
                })
            }
        })
        .catch(err => {
            console.log(err);
            this.setState({
                conversationReceived : false
            })
        })

    }

    onSubmit = (e) => {
        e.preventDefault();
        const data = {
            senderID: localStorage.getItem('userId'),
            senderUserName: this.state.storedUserName,
            senderImg: localStorage.getItem('imageURL'),
            receiverID: this.state.otherParticipant.userId,
            receiverUserName: this.state.otherParticipant.userName,
            receiverImg: this.state.otherParticipant.imageURL,
            text: this.state.messageText
        }

        axios.post(constants.BACKEND_SERVER.URL + "/messages/send", data, constants.TOKEN)
        .then((response, reject) => {
            if(response.status === 200){
                console.log("Message sent successfully")

                this.setState({
                    sendMessage : true
                })
            } else {
                console.log("Message could not be sent");
                this.setState({
                    sendMessage : false
                })
            }
        })
        .catch(err => {
            console.log("Message could not be sent");
            this.setState({
                sendMessage : false
            })
        })
    }


    render() {

        if(this.state.messagesReceived){
            var getParticipants = (participants) => {
                var conversationList = participants.filter(participant => {
                    return participant.userName != this.state.storedUserName 
                })
                return conversationList;
            }
            
            var mapParticipants = this.state.allMessages.map(result => {
                var allConversations = getParticipants(result.participants)
                return(
                    //allConversations = getParticipants(result.participants)
                    <a href="#" className="list-group-item">
                        <div className="row mt-3 mb-3">
                            <div className="col-md-4"><img src={allConversations[0].imageURL} className="img-fluid"/></div>
                            <div className="col-md-4"><h6 className="font-weight-bolder" id={allConversations[0].userName} onClick={this.getConversation}>{allConversations[0].userName}</h6>
                            </div>
                        </div>
                    </a>
                )
            })
        }

        if(this.state.conversationReceived){
            console.log(this.state.otherParticipantDetails);
            var displayMessages = this.state.singleConversation.body.map(message => {
                if(message.senderUserName == this.state.storedUserName){
                    return(
                        <div  align="right">
                            <span className = "text-primary">{message.text}</span>
                        </div>
                    ) 
                } else {
                    return(
                        <div align="left">
                            <span className = "text-primary">{message.text}</span>
                        </div>
                    ) 
                } 
            })
        }


        return (
            // Do not modify this div properties
            <div className="row" style={{ minHeight: 100 + "vh", maxWidth: 100 + "vw" }}>
                {/* 
                    Do not remove navbar. isActive will indicate which is the active page.
                    It can be one of the following values.
                    1. Home
                    2. Explore
                    3. Messages
                    4. Bookmarks
                    5. Lists
                    6. Profile
                    7. Analytics
                */}
                <Navbar isActive="Messages" userName={localStorage.getItem('userName')} imageURL={localStorage.getItem('imageURL')}/>

                {/* Do not modify this div properties */}
                <div className="col-md-8 shadow p-5">
                    {/* Insert UI here */}
                    <div className="row h-100">
                        <div className="col-sm-4">
                        <div className="list-group">
                            {mapParticipants}
                        </div>
                        </div>
                        <div className="col-sm-8">
                        <div className="container-fluid border h-100 card bg-light mb-3">        
                            <div className="card-header">
                            
                            <div className="row mt-3 mb-3">
                                <div className="col-md-2"><img src={this.state.otherParticipant.imageURL} className="img-fluid"/></div>
                                <div className="col-md-10"><h4 className="font-weight-bolder">{this.state.otherParticipant.userName}</h4>
                                </div>
                            </div>
                            </div>
                            
                            <div className="card-body">
                                {displayMessages}
                            </div>

                            <div className="card-footer">
                                <div className="input-group mb-3">
                                    
                                    <textarea className="form-control" onChange={this.changeHandler} name="messageText" aria-label="With textarea"></textarea>
                                    </div>
                                    <div className="input-group-prepend">
                                        <button className="btn-primary" id="inputGroup-sizing-default" type="submit" onClick={this.onSubmit}>Send</button>
                                    </div>
                            </div>

                        </div>
                        </div>
                    </div>
                </div>

            </div>
        )
    }
}

//export UserProfile Component
export default UserMessages;