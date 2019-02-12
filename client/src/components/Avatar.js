import React, { Component } from 'react';


class Avatar extends Component {
    constructor(props) {
      super(props);
      this.state = {
          imageUrl: '',
      };
    }

    componentDidMount() {
    }

    componentDidUpdate(prevProps) {
        if (prevProps.userId !== this.props.userId) {
            fetch(`/api/v1/user/${this.props.userId}/avatar`,{
                method: "GET",
            }).then(res => {
                res.json().then( imagePath => {
                    this.setState({imageUrl: imagePath})
                }
                )
            }).catch(err => console.log(err));
        }
    }

    static getDerivedStateFromProps(props, current_state) {
        if (current_state.userId) {
        if (current_state.userId !== props.userId) {
            return {
                userId: props.userId,
                imageUrl: Avatar.getImageUrl(props.userId)
            }
        }
        }
        return null;
    }

    render() {
        return(
            this.state.imageUrl ? <div>
                <img name={this.props.name} src={this.state.imageUrl} alt={this.props.alt}/>
            </div> : <div>
                {/* <img name={this.props.name} src={this.state.imageUrl} alt={this.props.alt}/> */}
            </div>
        )
    }
}

export default Avatar;



