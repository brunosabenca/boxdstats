import React, { Component } from 'react';
import Input from '../components/Input';  
import {makeCancelable} from '../makeCancelable'

class UsernameForm extends Component {
    constructor(props) {
      super(props);
      this.state = {
        userName: '',
        cancelable: []
      }
  
      this.handleFormSubmit = this.handleFormSubmit.bind(this);

      this.handleInput = this.handleInput.bind(this);

      this.handleClearForm = this.handleClearForm.bind(this);
    }
  
    handleFormSubmit(e) {
      e.preventDefault();
      window.scrollTo(0,0);

      let newUserName = String(this.state.userName).toLowerCase()
      let prevUserName = String(this.props.userName).toLowerCase();

      if (newUserName !== prevUserName) {
        if (this.state.cancelable) {
            this.state.cancelable.forEach((item) => item.cancel())
        }
        this.setState({cancelable: []});

        this.props.onUserInvalidated();

        const promise = fetch('/api/v1/user/by-username/' + newUserName + '/id');
        const cancelable = makeCancelable(promise);

        this.setState(prevState => ({
            cancelable: [...prevState.cancelable, cancelable]
        }));

        cancelable
          .promise
          .then(res => {
            if (res.status === 404) {
              throw new Error("404")
            }
            return res.json();
          })
          .then(data => {
            this.props.onUserIdRetrieval(data)
          }).catch(({isCanceled, ...error}) => {
              if (isCanceled) {
                  console.log('Fetching user id was cancelled.')
              } else {
                this.props.onUserIdFailedRetrieval();
              }
          });
      }
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
        <form id="username-form" onSubmit={this.handleFormSubmit}>
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
