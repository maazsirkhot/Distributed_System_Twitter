import React, { Component } from 'react'
import '../../App.css'

class Member extends Component {

    render() {
        return (
            <div className="listContainer border-bottom pt-2 pb-1">

                {/* Owner name and image */}
                <div className="row">
                    <div className="col-md-1">
                        <img src={this.props.value.imageURL ? this.props.value.imageURL : "https://cdn2.iconfinder.com/data/icons/user-icon-2-1/100/user_5-15-512.png"} alt="user-img" className="img-fluid" />
                    </div>
                    <div className="col-md-11">
                        <h6 className="font-weight-bolder">
                            <a href={"/view/profile/" + this.props.value._id} className="text-dark">{this.props.value.name} </a>
                        </h6>
                        <h6 className="font-weight-lighter text-secondary">
                            <a href={"/view/profile/" + this.props.value._id} className="text-secondary">@{this.props.value.userName}</a>
                        </h6>
                        <h6 className="font-weight-lighter text-dark"> {this.props.value.description}</h6>
                    </div>
                </div>

            </div>
        )
    }
}
//export Member Component
export default Member