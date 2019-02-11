import React, { Component } from 'react';

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import UsernameForm from './components/UsernameForm';

import { ReactComponent as Logo } from './images/logo.svg';
import './css/App.css';

class App extends Component {
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

              <Row>
                <UsernameForm />
              </Row>

            </Col>
          </Row>
        </Row>

      </Container>
    );
  }
}

export default App;
