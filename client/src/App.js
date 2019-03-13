import React, { Component } from 'react';

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import { BarLoader } from 'react-spinners';
import UsernameForm from './components/UsernameForm';
import Avatar from './components/Avatar';
import ExampleUserAvatar from './components/ExampleUserAvatar';
import MonthlyChart from './components/MonthlyChart';
import TopFilms from './components/TopFilms';

import { ReactComponent as Logo } from './images/logo.svg';
import './css/App.css';
import {makeCancelable} from './makeCancelable'

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
        user: {
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
        exampleUsers: [{
            avatar: "https://secure.gravatar.com/avatar/b24b9e12f9e2e537573c7bd293ee042c?rating=PG&size=144&border=&default=https%3A%2F%2Fletterboxd.com%2Fstatic%2Fimg%2Favatar144.4850a154.png",
            id: "4ueV",
            name: "Bruno",
            username: "Heikai",
            bio: "",
            filmLikes: 473,
            filmsInDiaryThisYear: 11,
            followers: 10,
            following: 6,
            location: "Portugal",
            ratings: 567,
            watches: 929,
            watchlist: 431,
          },
          {
            avatar: "https://a.ltrbxd.com/resized/avatar/twitter/7/3/7/2/8/shard/http___pbs.twimg.com_profile_images_1045449894490566656_VfdzLXRO-0-144-0-144-crop.jpg?k=0e00bb1897",
            bio: "<p>ratings are overrated.</p>",
            filmLikes: 89,
            filmsInDiaryThisYear: 16,
            followers: 12,
            following: 10,
            id: "35NJ",
            name: "António",
            ratings: 1001,
            username: "skaddoe",
            watches: 1152,
            watchlist: 139,
          },
          {
            avatar: "https://a.ltrbxd.com/resized/avatar/twitter/4/2/9/8/5/7/shard/http___pbs.twimg.com_profile_images_662327963333955584_lIPiLqPo-0-144-0-144-crop.jpg?k=8fc287ca90",
            bio: "",
            filmLikes: 0,
            filmsInDiaryThisYear: 7,
            followers: 5,
            following: 5,
            id: "i2fT",
            ratings: 842,
            username: "L3v3L",
            watches: 1002,
            watchlist: 329,
          },
          {
            avatar: "https://secure.gravatar.com/avatar/1752031f1aec32a4687ebd4e82dc5c5c?rating=PG&size=144&border=&default=https%3A%2F%2Fletterboxd.com%2Fstatic%2Fimg%2Favatar144.4850a154.png",
            bio: "",
            filmLikes: 212,
            filmsInDiaryThisYear: 3,
            followers: 3,
            following: 3,
            id: "9dbF",
            ratings: 0,
            username: "Unzaree",
            watches: 338,
            watchlist: 412,
          }
        ],
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
    if (this.state.user.id !== null && this.state.user.id !== prevState.user.id) {
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

  resetState(event) {
    event.preventDefault();
    this.setState({ 
      user : {
        id: null,
        username: null,
      },
      retrievedUser: false,
      failedUserIdRetrieval: false,
      cancelable: [],
      loading: false
    });
  }

  render() {
    return (
      <Container fluid={true} className="App">

        <Row className="App-header">
          <span className="App-logo-wrapper">
              <Logo className="App-logo"/>BoxdStats
              <a href="/" onClick={ this.resetState.bind(this) }> </a>
          </span>
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
                    userName={this.state.user.username}
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
                      <Avatar size="110"
                        alt={`${this.state.user.name}'s avatar`}
                        name={`${this.state.user.name ? this.state.user.name : this.state.user.username}`}
                        href={`https://letterboxd.com/${this.state.user.username}/`}
                        imageUri={this.state.user.avatar}
                        userId={this.state.user.id} />
                      <div className="profile-person-info">
                        <h1 className="title-1">{this.state.user.name ? this.state.user.name : this.state.user.username}</h1>
                        <ul className="person-metadata">
                          <li>{this.state.user.location ? this.state.user.location : ''}</li>
                        </ul>
                      </div>
                      <ul className="stats">
                        <li>
                          <a href={`https://letterboxd.com/${this.state.user.username}/films/`} target="_blank" rel="noopener noreferrer">
                            <strong>{this.state.user.watches}</strong>
                            <span>Films</span>
                          </a>
                        </li>
                        <li>
                          <a href={`https://letterboxd.com/${this.state.user.username}/films/diary/for/2019/`} target="_blank" rel="noopener noreferrer">
                            <strong>{this.state.user.filmsInDiaryThisYear}</strong>
                            <span>This year</span>
                          </a>
                        </li>
                        <li>
                          <a href={`https://letterboxd.com/${this.state.user.username}/likes/films/`} target="_blank" rel="noopener noreferrer">
                            <strong>{this.state.user.filmLikes}</strong>
                            <span>Likes</span>
                          </a>
                        </li>
                        <li>
                          <a href={`https://letterboxd.com/${this.state.user.username}/films/ratings/`} target="_blank" rel="noopener noreferrer">
                            <strong>{this.state.user.ratings}</strong>
                            <span>Ratings</span>
                          </a>
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
                    <Col xs={12} className="section">
                      <h2 className="section-heading">Example Profiles</h2>
                      <Row className="poster-list">
                        <ExampleUserAvatar size="110" user={this.state.exampleUsers[0]}
                                onUserIdRetrieval={this.handleUserData} />
                        <ExampleUserAvatar size="110" user={this.state.exampleUsers[1]}
                                onUserIdRetrieval={this.handleUserData} />
                        <ExampleUserAvatar size="110" user={this.state.exampleUsers[2]}
                                onUserIdRetrieval={this.handleUserData} />
                        <ExampleUserAvatar size="110" user={this.state.exampleUsers[3]}
                                onUserIdRetrieval={this.handleUserData} />
                      </Row>
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
