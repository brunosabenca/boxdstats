import React, { Component } from 'react';
import Input from '../components/Input';  
import {makeCancelable} from '../makeCancelable'

class UsernameForm extends Component {
    constructor(props) {
      super(props);
      this.state = {
        userName: '',
        submittedUserName: '',
        cancelable: []
      }
  
      this.handleFormSubmit = this.handleFormSubmit.bind(this);

      this.handleInput = this.handleInput.bind(this);

      this.handleClearForm = this.handleClearForm.bind(this);
    }
  
    componentDidUpdate(prevProps) {
      if (prevProps.userName !== this.props.userName) {
        if (this.props.userName) {
          this.setState({ userName: '', submittedUserName: this.props.userName });
        } else {
          this.setState({ userName: '', submittedUserName: '' });
        }
      }
    }
  
    handleFormSubmit(e) {
      e.preventDefault();
      window.scrollTo(0,0);

      if (this.state.userName.toLowerCase() !== this.state.submittedUserName.toLowerCase()) {
        this.setState({submittedUserName: this.state.userName});

        if (this.state.cancelable) {
            this.state.cancelable.forEach((item) => item.cancel())
        }
        this.setState({cancelable: []});

        this.props.onUserInvalidated();

        const promise = fetch('/api/v1/user/by-username/' + this.state.userName.toLowerCase()  + '/id');
        const cancelable = makeCancelable(promise);

        this.setState(prevState => ({
            cancelable: [...prevState.cancelable, cancelable]
        }));

        cancelable
          .promise
          .then(res => {
            return res.json();
          })
          .then(data => {
            if (data.error) {
              throw new Error(data.error.message);
            }
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
      this.setState({ userName: '' });
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
