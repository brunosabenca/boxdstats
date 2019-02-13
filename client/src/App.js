import React, { Component } from 'react';

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import UsernameForm from './components/UsernameForm';
import Avatar from './components/Avatar';

import { ReactComponent as Logo } from './images/logo.svg';
import './css/App.css';

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      user : {
        username: '',
        id: '',
        avatar: '',
      }
    }
  }

  handleUserData = (userData) => {
      this.setState(prevState => ({user: {...this.state.user, username: userData.username, id: userData.id}}));
  }

  async componentDidUpdate(prevProps, prevState) {
    if (this.state.user.id !== prevState.user.id) {
      //Fetch avatar image URI
      try {
        const response = await fetch(`/api/v1/user/${this.state.user.id}/avatar`);
        const imageUri = await response.json();
        this.setState(prevState => ({user: {...prevState.user, avatar: imageUri}}));
      } catch(e) {
        console.log(e);
      }
    }
  }

  render() {
    return (
      <Container fluid={true} className="App">

        <Row className="App-header">

          <Col xs={12}>
            <Logo className="App-logo"/>
          </Col>

          <Col xs={12}>
            BoxdStats
          </Col>

        </Row>

        <Row className="App-body">
          <Row className="App-body-wrapper">
            <Col xs={12}>

              <Row>
                <Col xs={12} className="section">
                  <h2 className="section-heading">Year in review</h2>
                </Col>
              </Row>

              <Row className="center">
                <Col xs={9} md={6} lg={4}>
                  <Avatar size="60" alt="User" name="User" imageUri={this.state.user.avatar} userId={this.state.user.id} />
                </Col>
              </Row>

              <Row className="center">
                <Col xs={9} md={6} lg={4}>
                  <UsernameForm onUserIdRetrieval={this.handleUserData} />
                </Col>
              </Row>

            </Col>
          </Row>
        </Row>

      </Container>
    );
  }
}

export default App;
