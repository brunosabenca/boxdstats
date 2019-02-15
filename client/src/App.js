import React, { Component } from 'react';

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import UsernameForm from './components/UsernameForm';
import Avatar from './components/Avatar';
import MonthlyChart from './components/MonthlyChart';

import { ReactComponent as Logo } from './images/logo.svg';
import './css/App.css';

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      user : {
        id: null,
        username: null,
        name: null,
        avatar: null,
        bio: null,
        filmsInDiaryThisYear: null,
        filmLikes: null,
        ratings: null,
        watches: null,
        watchlist: null,
        followers: null,
        following: null,
      },
      retrievedUser: false
    }
  }

  handleUserData = (userData) => {
      this.setState(prevState => ({user: {...prevState.user, username: userData.username, id: userData.id}}));
  }

  async componentDidUpdate(prevProps, prevState) {
    if (this.state.user.id !== prevState.user.id) {
      try {
        const response = await fetch(`/api/v1/user/${this.state.user.id}`);
        const data = await response.json();
        console.log(data);

        this.setState(prevState => ({...prevState, user: data}));
        this.setState({retrievedUser: true});
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
              <Row className="center">
                <Col xs={9} md={6} lg={4}>
                  <UsernameForm onUserIdRetrieval={this.handleUserData} />
                </Col>
              </Row>
              {
                this.state.retrievedUser
                ? 
                <Container>
                  <Row>
                    <Col xs={12} className="section">
                      <h2 className="section-heading">User Statistics</h2>
                    </Col>
                  </Row>
                  <Row>
                    <Col xs={6} md={6} lg={2}>
                      <Avatar size="144" alt="User" name="User" imageUri={this.state.user.avatar} userId={this.state.user.id} />
                      <br/>
                      <h2>{this.state.user.name ? this.state.user.name : this.state.user.username}</h2>
                      {this.state.user.location ? <h6>{this.state.user.location}</h6> : ''}
                    </Col>
                    <Col xs={6} md={4} lg={2}>
                      <h6>Films: {this.state.user.watches}</h6>
                      <h6>This year: {this.state.user.filmsInDiaryThisYear}</h6>
                      <h6>Likes: {this.state.user.filmLikes}</h6>
                      <h6>Ratings: {this.state.user.ratings}</h6>
                    </Col>
                  <Col>
                    <MonthlyChart userId={this.state.user.id}/>
                  </Col>
                  </Row>
                </Container>
                :
                <Row></Row>
              }

            </Col>
          </Row>
        </Row>

      </Container>
    );
  }
}

export default App;
