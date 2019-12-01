import React, { Component } from 'react'
import '../../App.css'
import axios from 'axios'
import Navbar from '../navbar/navbar'
import constants from '../../utils/constants'
import { Modal, Button } from 'react-bootstrap';

class UserMessages extends Component {

    constructor(props) {
        super(props);
        this.state = {
            storedUserName: localStorage.getItem('userName'),
            senderID : localStorage.getItem('userId'),
            allMessages: "",
            messagesReceived: false,
            showModal : false,
            otherParticipant : true
        }
        this.getConversation = this.getConversation.bind(this);
        this.changeHandler = this.changeHandler.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.showModal = this.showModal.bind(this);
    }

    changeHandler = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        })
    }

    handleClose = () => {
        this.setState({
            showModal : false
        })
    };

    componentWillMount() {
        //console.log(constants.TOKEN);
        axios.get(constants.BACKEND_SERVER.URL + "/messages/inbox/" + localStorage.getItem('userName'))
            .then((response, reject) => {
                if (response.status === 200) {
                    console.log(response.data)
                    this.setState({
                        allMessages: response.data,
                        messagesReceived: true
                    })
                }
                else {
                    this.setState({
                        messagesReceived: false
                    })
                }
            })
            .catch(err => {
                console.log(err);
                this.setState({
                    messagesReceived: false
                })
            })
    }

    getConversation = (e) => {
        var userName2 = e.target.id;
        console.log(e.target.id);

        axios.get(constants.BACKEND_SERVER.URL + "/messages/conversation/" + localStorage.getItem('userName') + "/" + userName2)
        .then((response, reject) => {
            if (response.status === 200) {
                console.log(response.data)
                var singleConversation = response.data;

                var otherParticipantDetails = singleConversation.participants.filter(participant => {
                    return participant.userName !== this.state.storedUserName;
                })
                this.setState({
                    singleConversation: response.data,
                    conversationReceived: true,
                    otherParticipant: otherParticipantDetails[0]
                })
            } else {
                this.setState({
                    conversationReceived: false
                })
            }
        })
        .catch(err => {
            console.log(err);
            this.setState({
                conversationReceived: false
            })
        })
    }

    onSubmit = (e) => {
        e.preventDefault();
        document.getElementById('textmessage').value='';
        console.log(this.state.otherParticipant);

        if(!this.state.conversationReceived){
            alert("No receiver selected");
        }
        if(this.state.messageText === ""){
            alert("Please enter message");
        } else {

            const data = {
                senderID: this.state.senderID,
                senderUserName: this.state.storedUserName,
                senderImg: localStorage.getItem('imageURL'),
                receiverID: this.state.otherParticipant.userId,
                receiverUserName: this.state.otherParticipant.userName,
                receiverImg: this.state.otherParticipant.imageURL,
                text: this.state.messageText
            }

            axios.post(constants.BACKEND_SERVER.URL + "/messages/send", data)
                .then((response, reject) => {
                    if (response.status === 200) {
                        console.log("Message sent successfully")
                        //this.getConversation();
                        this.setState({
                            sendMessage: true
                        })

                        axios.get(constants.BACKEND_SERVER.URL + "/messages/conversation/" + localStorage.getItem('userName') + "/" + data.receiverUserName)
                            .then((response, reject) => {
                                if (response.status === 200) {
                                    console.log(response.data)
                                    var singleConversation = response.data;
                                    var otherParticipantDetails = singleConversation.participants.filter(participant => {
                                        return participant.userName !== this.state.storedUserName;
                                    })
                                    this.setState({
                                        singleConversation: response.data,
                                        conversationReceived: true,
                                        otherParticipant: otherParticipantDetails[0]
                                    })
                                } else {
                                    this.setState({
                                        conversationReceived: false
                                    })
                                }
                            })
                            .catch(err => {
                                console.log(err);
                                this.setState({
                                    conversationReceived: false
                                })
                            })

                    } else {
                        console.log("Message could not be sent");
                        this.setState({
                            sendMessage: false
                        })

                    }
                })
                .catch(err => {
                    console.log("Message could not be sent");
                    this.setState({
                        sendMessage: false
                    })
                })
        }
    }

    showModal = (e) => {
        e.preventDefault();
        this.setState({
            showModal : true
        })
    }

    newMessage = (e) => {
        

        const data = {
            senderID: this.state.senderID,
            senderUserName: this.state.storedUserName,
            senderImg: localStorage.getItem('imageURL'),
            receiverUserName : this.state.newUserName,
            text : this.state.newText
        }
        axios.post(constants.BACKEND_SERVER.URL + "/messages/newMessage", data)
        .then( (response, reject) => {
            if(response.status === 200){
                console.log(response.data)
                alert("Message Sent Successfully");
                this.setState({
                    newMessageSent : true,
                    showModal : false
                })
            } else if(response.status === 404){
                alert("Username is invalid! Please enter valid username");
                this.setState({
                    newMessageSent : false,
                    showModal : false
                })
            } else {
                alert("Error occurred, please try again!");
                this.setState({
                    newMessageSent : false,
                    showModal : false
                })
            }
        })
        .catch(err => {
            console.log("Message could not be sent");
            this.setState({
                newMessageSent: false
            })
        })

    }



    render() {

        if (this.state.messagesReceived) {
            var getParticipants = (participants) => {
                var conversationList = participants.filter(participant => {
                    return participant.userName !== this.state.storedUserName
                })
                return conversationList;
            }

            var mapParticipants = this.state.allMessages.map(result => {
                var allConversations = getParticipants(result.participants)
                return (
                    //allConversations = getParticipants(result.participants)
                    <a href={null} className="list-group-item">
                        <div className="row mt-3 mb-3">
                            <div className="col-md-4"><img src={allConversations[0].imageURL} alt="user-img" className="img-fluid" /></div>
                            <div className="col-md-4"><h6 className="font-weight-bolder" id={allConversations[0].userName} onClick={this.getConversation}>{allConversations[0].userName}</h6>
                            </div>
                        </div>
                    </a>
                )
            })
        }

        if (this.state.conversationReceived) {

            var participantImage = this.state.otherParticipant.imageURL;
            var participantUserName = this.state.otherParticipant.userName;
            console.log(this.state.otherParticipantDetails);
            var displayMessages = this.state.singleConversation.body.map(message => {
                if (message.senderUserName === this.state.storedUserName) {
                    return (
                        <div align="right">
                            <span className="text-primary">{message.text}</span>
                        </div>
                    )
                } else {
                    return (
                        <div align="left">
                            <span className="text-primary">{message.text}</span>
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
                <Navbar isActive="Messages" userName={localStorage.getItem('userName')} imageURL={localStorage.getItem('imageURL')} />

                {/* Do not modify this div properties */}
                <div className="col-md-9 shadow p-5">
                    {/* Insert UI here */}
                    <div className="row h-100">
                        <div className="col-sm-4">
                        <button className="btn-primary btn" type="button" onClick={this.showModal}>New Message</button>
                        <br></br><br></br>
                        
                        <Modal show={this.state.showModal} onHide={this.handleClose}>

                        <Modal.Header closeButton>
                            <Modal.Title>New Message</Modal.Title>
                        </Modal.Header>

                        <Modal.Body>
                        <form>
                            <div class="input-group mb-3"> 
                            <div class="input-group-prepend">
                                <span class="input-group-text" id="basic-addon1">Username</span>
                            </div>
                                <input type="text" class="form-control" placeholder="Username" aria-label="Username" aria-describedby="basic-addon1" name="newUserName" onChange={this.changeHandler} required/>
                            </div>

                            <div class="input-group">
                            <div class="input-group-prepend">
                                <span class="input-group-text">Message</span>
                            </div>
                                <textarea class="form-control" aria-label="With textarea" name="newText" onChange={this.changeHandler} required></textarea>
                            </div>

                            <br></br>

                            <button className="btn-primary btn" id="inputGroup-sizing-default" type="submit" onClick={this.newMessage}>Send</button>
                            <button className="btn-info btn" id="inputGroup-sizing-default" type="reset">Reset</button>
                        </form>
                        </Modal.Body>

                        <Modal.Footer>
                            <Button variant="secondary btn-info" onClick={this.handleClose}>Close</Button>
                        </Modal.Footer>
                        </Modal>






                            <div className="list-group">
                                {mapParticipants}
                            </div>
                        </div>
                        <div className="col-sm-8">
                            <div className="container-fluid border h-100 card bg-light mb-3">
                                <div className="card-header">
                                    <div className="row mt-3 mb-3">
                                        <div className="col-md-2"><img src={participantImage} alt="user-img" className="img-fluid" /></div>
                                        <div className="col-md-10"><h4 className="font-weight-bolder">{participantUserName}</h4></div>
                                    </div>
                                    
                                </div>

                                <div className="card-body">
                                    {displayMessages}
                                </div>

                                <div className="card-footer">
                                <form>
                                    <div>
                                    <div className="input-group mb-3">
                                        <textarea className="form-control" onChange={this.changeHandler} name="messageText" id="textmessage" aria-label="With textarea" required></textarea>
                                    </div>
                                    <div className="input-group-prepend">
                                        <button className="btn-primary" id="inputGroup-sizing-default" type="submit" onClick={this.onSubmit}>Send</button>
                                    </div>
                                    </div>
                                </form>
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