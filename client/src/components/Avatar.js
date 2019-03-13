import React, { Component } from 'react';
import ReactTooltip from 'react-tooltip'
import placeholderAvatar from '../images/avatar.png';

class Avatar extends Component {
    render() { 
        return(
        <div className="profile-avatar">
            <span className="avatar -a110 -large">

                { this.props.imageUri ? <img src={this.props.imageUri} alt={this.props.alt}/> : <img src={placeholderAvatar} alt={this.props.alt}/> }

                <a href={this.props.href}
                    data-tip={this.props.tooltip}
                    target="_blank"
                    rel="noopener noreferrer">
                </a> 

            </span> 
            <ReactTooltip place="top" effect="solid" type="light"/>
        </div>
        )
  }
}

export default Avatar;