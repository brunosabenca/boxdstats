import React, { Component } from 'react';
import Avatar from './Avatar';

class ExampleUserAvatar extends Component {
    constructor(props) {
      super(props);
      
      this.handleClick = this.handleClick.bind(this);
    }

    handleClick(e) {
      e.preventDefault();
      this.props.onUserIdRetrieval(this.props.user);
    }
  
    render() { 
        return(
            <div onClick={this.handleClick} className="">
                <Avatar size="110"
                        href="#"
                        alt={`${this.props.user.name}`}
                        name={`${this.props.user.name ? this.props.user.name : this.props.user.username}`}
                        tooltip={`View ${this.props.user.name ? this.props.user.name : this.props.user.username}'s stats`}
                        imageUri={this.props.user.avatar}
                        userId={this.props.user.id} />
                <div style={{textAlign: 'center', marginTop: '5px'}}>
                <h6>{this.props.user.name ? this.props.user.name : this.props.user.username}</h6>
                </div>
            </div>
        )
  }
}

export default ExampleUserAvatar;