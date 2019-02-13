import React, { Component } from 'react';
import Input from '../components/Input';  

class UsernameForm extends Component {
    constructor(props) {
      super(props);
      this.state = {
        userName: ''
      }
  
      this.handleFormSubmit = this.handleFormSubmit.bind(this);

      this.handleInput = this.handleInput.bind(this);

      this.handleClearForm = this.handleClearForm.bind(this);
    }
  
    handleFormSubmit(e) {
      e.preventDefault();
      fetch('/api/v1/user/by-username/' + this.state.userName + '/id')
        .then(res => res.json())
        .then(data => {
          this.props.onUserIdRetrieval(data)
        });
    }

    handleClearForm(e) {
      e.preventDefault();
      this.setState({ 
        userName: '',
      });
    }

    handleInput(e) {
      let value = e.target.value;
      let name = e.target.name;
      this.setState({[name]: value});
    }

    render() {
      return (
        <form onSubmit={this.handleFormSubmit}>
          <Input type={'text'}
            name='userName'
            value={this.state.userName} 
            placeholder='Enter your username'
            handleChange={this.handleInput}
          /> {/* Username of the user */}
        </form>

      );
    }
}

export default UsernameForm;
