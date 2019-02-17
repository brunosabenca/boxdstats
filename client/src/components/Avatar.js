import React, { Component } from 'react';
import placeholderAvatar from '../images/avatar.png';

class Avatar extends Component {
    render() { 
        return(
        <div className="profile-avatar">
            <span className="avatar -a110 -large">
                {this.props.imageUri ? <img name={this.props.name} src={this.props.imageUri} alt={this.props.alt}/> : <img name={this.props.name} src={placeholderAvatar} alt={this.props.alt}/>}
            </span> 
        </div>
        )
  }
}

export default Avatar;