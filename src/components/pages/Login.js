import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  Redirect,
} from 'react-router-dom';

import {
  Grid, Col,
  Button,
  Form, FormGroup, FormControl, ControlLabel,
} from 'react-bootstrap';

import PropTypes from 'prop-types';

import { usersFacade } from 'facades';

import {
  setAuthenticated as setAuthenticatedAction,
  unsetAuthenticated as unsetAuthenticatedAction,
  setUser as setUserAction,
  unsetUser as unsetUserAction,
} from 'actions';

import config from 'config/config';

class Login extends Component {
  constructor(props) {
    super(props);

    const { unsetAuthenticated, unsetUser } = this.props;
    unsetAuthenticated();
    unsetUser();
    this.state = {
      username: '',
      password: '',
      redirectToReferrer: false,
    };
  }

  validateForm = () => {
    const { username, password } = this.state;
    return username.length > 0 && password.length > 0;
  };

  handleChange = (event) => {
    this.setState({
      [event.target.id]: event.target.value,
    });
  }

  handleSubmit = async (e) => {
    e.preventDefault();
    const { username, password } = this.state;
    const { setAuthenticated, setUser } = this.props;

    // stop here if form is invalid
    if (!(username && password)) {
      return;
    }
    // call login endpoint
    const {
      id: accessToken,
      userId,
    } = await usersFacade.login(username, password);
    if (!accessToken) {
      return;
    }
    const { roles } = await usersFacade.getUserById(userId, accessToken);
    const userGeneraIds = await usersFacade.getGeneraOfUser(
      userId, accessToken, (g) => g.id,
    );

    const userRole = roles[0]
      ? roles[0].name
      : config.mappings.userRole.author.name;

    setAuthenticated(accessToken);
    setUser(userId, userRole, userGeneraIds);
    this.setState({ redirectToReferrer: true });
  }

  render() {
    const { location } = this.props;
    const { from } = location.state || { from: { pathname: '/' } };
    const { username, password, redirectToReferrer } = this.state;

    if (redirectToReferrer === true) {
      return <Redirect to={from} />;
    }

    return (
      <div id="login-page">
        <Grid>
          <Col xs={12} md={4} mdOffset={4}>
            <h2>Login</h2>
            <Form onSubmit={this.handleSubmit}>
              <FormGroup controlId="username" bsSize="large">
                <ControlLabel>Username</ControlLabel>
                <FormControl
                  autoFocus
                  type="text"
                  value={username}
                  onChange={this.handleChange}
                />
              </FormGroup>
              <FormGroup controlId="password" bsSize="large">
                <ControlLabel>Password</ControlLabel>
                <FormControl
                  type="password"
                  value={password}
                  onChange={this.handleChange}
                />
              </FormGroup>
              <Button
                block
                bsSize="large"
                disabled={!this.validateForm()}
                type="submit"
                bsStyle="primary"
              >
                Login
              </Button>
            </Form>
          </Col>
        </Grid>
      </div>
    );
  }
}

export default connect(null, {
  setAuthenticated: setAuthenticatedAction,
  unsetAuthenticated: unsetAuthenticatedAction,
  setUser: setUserAction,
  unsetUser: unsetUserAction,
})(Login);

Login.propTypes = {
  unsetAuthenticated: PropTypes.func.isRequired,
  unsetUser: PropTypes.func.isRequired,
  setAuthenticated: PropTypes.func.isRequired,
  setUser: PropTypes.func.isRequired,
  location: PropTypes.shape({
    state: PropTypes.shape({
      from: PropTypes.shape({
        pathname: PropTypes.string,
      }),
    }),
  }).isRequired,
};
