import React, { Component } from 'react';
import Input from '../components/Input';  

class UsernameForm extends Component {
    constructor(props) {
      super(props);
      this.state = {
        user : {
          username: '',
          id: ''
        }
      }
  
      this.handleFormSubmit = this.handleFormSubmit.bind(this);
      this.handleInput = this.handleInput.bind(this);
      this.handleClearForm = this.handleClearForm.bind(this);
    }
  
    handleFormSubmit(e) {
      e.preventDefault();
      let userData = this.state.user;
      fetch('/api/v1/username/' + userData.username + '/id')
        .then(res => res.json())
        .then(value => {
          this.setState({
            user: {
              username: value['username'],
              id: value['id']
            }
          })
          this.props.onUserChange(value)
        });
    }

    handleUserChange() {

    }

    handleClearForm(e) {
      e.preventDefault();
      this.setState({ 
        user: {
          username: '',
          id: ''
        }
      });
    }

    handleInput(e) {
      let value = e.target.value;
      let name = e.target.name;
      this.setState( prevState => {
        return { 
          user : {
            ...prevState.user, [name]: value
          }
        }
      }, () => console.log(this.state.user)
      )
    }
  
    render() {
      return (
        <form onSubmit={this.handleFormSubmit}>
          <Input type={'text'}
            title='Username'
            name='username'
            value={this.state.user.username} 
            placeholder = 'Your username'
            handleChange = {this.handleInput}
          /> {/* Username of the user */}

        </form>

      );
    }
}

export default UsernameForm;
