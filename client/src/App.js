import React, { Component } from 'react';

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import { BarLoader } from 'react-spinners';
import UsernameForm from './components/UsernameForm';
import Avatar from './components/Avatar';
import MonthlyChart from './components/MonthlyChart';
import TopFilms from './components/TopFilms';

import { ReactComponent as Logo } from './images/logo.svg';
import './css/App.css';
import {makeCancelable} from './makeCancelable'

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
      retrievedUser: false,
      failedUserIdRetrieval: false,
      cancelable: [],
      loading: false
    }
  }

  handleUserInvalidated = (userName) => {
    this.setState({
      failedUserIdRetrieval: false,
      retrievedUser: false,
      loading: true
    });
  }

  handleUserData = (userData) => {
    this.setState(prevState => ({
      user: {...prevState.user, username: userData.username, id: userData.id},
      failedUserIdRetrieval: false,
    }));
  }

  handleUserIdRetrievalFailure = () => {
    this.setState(prevState => ({
      user: {},
      failedUserIdRetrieval: true,
      loading: false
    }));
  }

  async componentWillUnmount() {
      if (this.state.cancelable) {
          this.state.cancelable.forEach((item) => item.cancel())
      }
  }

  async componentDidUpdate(prevProps, prevState) {
    if (this.state.user.id !== prevState.user.id) {
        if (this.state.cancelable) {
            this.state.cancelable.forEach((item) => item.cancel())
        }
        this.setState({cancelable: []});

        const promise = fetch(`/api/v1/user/${this.state.user.id}`);
        const cancelable = makeCancelable(promise);

        this.setState(prevState => ({
            cancelable: [...prevState.cancelable, cancelable]
        }));

        cancelable
        .promise
        .then((res) => {
          return res.json();
        }).then((data) => {
          this.setState(prevState => ({...prevState, user: data}));
          this.setState({retrievedUser: true, loading: false});
        }).catch(({isCanceled, ...error}) => {
            if (isCanceled) {
                console.log('Fetching user data was cancelled.')
            }
        });
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

        <Row className="App-loading">
          <BarLoader
            widthUnit="%"
            width={100}
            color={'#24303c'}
            loading={this.state.loading}
          />
        </Row>

        <Row className="App-body">
          <Row className="App-body-wrapper">
            <Col xs={12}>
              <Row className="center">
                <Col xs={9} md={6} lg={4}>
                  <UsernameForm 
                    onUserInvalidated={this.handleUserInvalidated}
                    onUserIdRetrieval={this.handleUserData}
                    onUserIdFailedRetrieval={this.handleUserIdRetrievalFailure}/>
                </Col>
              </Row>
              {
                this.state.retrievedUser
                ? 
                <Container>
                  <section className="section" id="profile-header">
                    <div className="profile-summary">
                      <div className="profile-avatar">
                        <Avatar size="110" alt="User" name="User" imageUri={this.state.user.avatar} userId={this.state.user.id} />
                      </div>
                      <div className="profile-person-info">
                        <h1 className="title-1">{this.state.user.name ? this.state.user.name : this.state.user.username}</h1>
                        <ul className="person-metadata">
                          <li>{this.state.user.location ? this.state.user.location : ''}</li>
                        </ul>
                      </div>
                      <ul className="stats">
                        <li>
                          <p className="stat">
                            <strong>{this.state.user.watches}</strong>
                            <span>Films</span>
                          </p>
                        </li>
                        <li>
                          <p className="stat">
                            <strong>{this.state.user.filmsInDiaryThisYear}</strong>
                            <span>This year</span>
                          </p>
                        </li>
                        <li>
                          <p className="stat">
                            <strong>{this.state.user.filmLikes}</strong>
                            <span>Likes</span>
                          </p>
                        </li>
                        <li>
                          <p className="stat">
                            <strong>{this.state.user.ratings}</strong>
                            <span>Ratings</span>
                          </p>
                        </li>
                      </ul>
                    </div>
                  </section>

                  <Row>
                    <Col xs={12} className="section">
                      <h2 className="section-heading">Highest Rated Films</h2>
                      <TopFilms userId={this.state.user.id} year={2019}/>
                    </Col>
                  </Row>

                  <Row>
                    <Col xs={12} className="section">
                      <h2 className="section-heading">Monthly Chart</h2>
                      <MonthlyChart userId={this.state.user.id}/>
                    </Col>
                  </Row>
                </Container>
                :
                <Container>
                  <Row>
                    <Col xs={3} className="loading">
                    </Col>
                  </Row> 
                </Container>
              }

              {
                this.state.failedUserIdRetrieval && ! this.state.loading
                ?
                <Container>
                  <Row>
                    <Col xs={12} className="section">
                      <h2 className="section-heading">No Result</h2>
                      <p>Couldn't find a user with that username.</p>
                    </Col>
                  </Row>
                </Container>
                : ''
              }

            </Col>
          </Row>
        </Row>

      </Container>
    );
  }
}

export default App;
