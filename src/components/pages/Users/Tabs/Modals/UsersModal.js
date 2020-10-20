import React, { Component } from 'react';
import { connect } from 'react-redux';

import {
  Button, Modal, Col,
  Form, FormGroup, FormControl, ControlLabel,
} from 'react-bootstrap';

import PropTypes from 'prop-types';

import { notifications } from 'utils';

import { usersFacade, rolesFacade } from 'facades';

const VALIDATION_STATE_SUCCESS = 'success';
const VALIDATION_STATE_ERROR = 'error';

const PREFIX = 'search-'; // to prevent LastPass to autofill username and password

const titleColWidth = 2;
const mainColWidth = 10;

const userInitialValues = {
  id: undefined,
  username: '',
  email: '',
  password: '',
  realm: '',
  emailVerified: false,
  verificationToken: null,
};

const userRoleInitialValues = {
  id: 3,
  name: 'author',
};

class UsersModal extends Component {
  constructor(props) {
    super(props);

    this.state = {
      user: {
        ...userInitialValues,
      },
      userRole: {
        ...userRoleInitialValues,
      },
      rolesOptions: [],
    };
  }

  async componentDidMount() {
    const { accessToken } = this.props;
    const format = (r) => ({ id: r.id, name: r.name });
    const rolesOptions = await rolesFacade.getAllRoles(accessToken, format);
    this.setState({
      rolesOptions,
    });
  }

  onEnter = async () => {
    const { id, accessToken } = this.props;
    if (id) {
      const { user, roles } = await usersFacade.getUserById(id, accessToken);
      const userRole = roles[0] || { ...userRoleInitialValues };
      this.setState({
        user,
        userRole,
      });
    }
  }

  getValidationState = () => {
    const { id } = this.props;
    const { user: { username, password, email } } = this.state;
    if (username.length > 0
      && email.length > 0
      && ((!id && password.length > 0) || id)) {
      return VALIDATION_STATE_SUCCESS;
    }
    return VALIDATION_STATE_ERROR;
  }

  handleChange = (e) => {
    this.setState((state) => {
      const { user } = state;
      const id = e.target.id.replace(PREFIX, '');
      user[id] = e.target.value;
      return {
        user,
      };
    });
  }

  handleChangeRole = (e) => {
    this.setState((state) => {
      const { rolesOptions } = state;
      const userRole = rolesOptions.find((r) => (
        r.id === parseInt(e.target.value, 10)
      ));
      return {
        userRole,
      };
    });
  }

  handleHide = () => {
    this.setState({
      user: {
        ...userInitialValues,
      },
      userRole: {
        ...userRoleInitialValues,
      },
    });
    const { onHide } = this.props;
    onHide();
  }

  handleSave = async () => {
    if (this.getValidationState() === VALIDATION_STATE_SUCCESS) {
      const { accessToken } = this.props;
      const { user, userRole: { id: roleId } } = this.state;
      try {
        const userId = await usersFacade.saveUser(user, accessToken);
        await rolesFacade.saveRoleForUser(userId, roleId, accessToken);
        notifications.success('Saved');
        this.handleHide();
      } catch (error) {
        notifications.error('Error saving');
        throw error;
      }
    } else {
      notifications.error('All mandatory fields must be filled!');
    }
  }

  render() {
    const { show, id } = this.props;
    const {
      user: { username, email, password },
      userRole, rolesOptions,
    } = this.state;
    return (
      <Modal show={show} onHide={this.handleHide} onEnter={this.onEnter}>
        <Modal.Header closeButton>
          <Modal.Title>
            {id ? 'Edit user' : 'Create new user'}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form horizontal autoComplete="off">
            <FormGroup
              controlId="search-username"
              bsSize="sm"
              validationState={this.getValidationState()}
            >
              <Col componentClass={ControlLabel} sm={titleColWidth}>
                User name
              </Col>
              <Col sm={mainColWidth}>
                <FormControl
                  type="text"
                  value={username || ''}
                  placeholder="Enter Username"
                  onChange={this.handleChange}
                  data-lpignore
                />
                <FormControl.Feedback />
              </Col>
            </FormGroup>
            <FormGroup
              controlId="email"
              bsSize="sm"
              validationState={this.getValidationState()}
            >
              <Col componentClass={ControlLabel} sm={titleColWidth}>
                Email
              </Col>
              <Col sm={mainColWidth}>
                <FormControl
                  type="email"
                  value={email || ''}
                  placeholder="Enter Email"
                  onChange={this.handleChange}
                  data-lpignore
                />
                <FormControl.Feedback />
              </Col>
            </FormGroup>
            {
              !id // render password field only when creating new user
              && (
                <FormGroup
                  controlId="search-password"
                  bsSize="sm"
                  validationState={id ? null : this.getValidationState()}
                >
                  <Col componentClass={ControlLabel} sm={titleColWidth}>
                    {id ? 'Set new password' : 'Password'}
                  </Col>
                  <Col sm={mainColWidth}>
                    <FormControl
                      type="password"
                      value={password || ''}
                      onChange={this.handleChange}
                      data-lpignore
                    />
                    <FormControl.Feedback />
                  </Col>
                </FormGroup>
              )
            }
            <FormGroup
              controlId="roles"
              bsSize="sm"
            >
              <Col componentClass={ControlLabel} sm={titleColWidth}>
                Role
              </Col>
              <Col sm={mainColWidth}>
                <FormControl
                  componentClass="select"
                  placeholder="select"
                  value={userRole.id || ''}
                  onChange={this.handleChangeRole}
                >
                  {
                    rolesOptions.map((r) => (
                      <option value={r.id} key={r.id}>
                        {r.name.toUpperCase()}
                      </option>
                    ))
                  }
                </FormControl>
              </Col>
            </FormGroup>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={this.handleHide}>Close</Button>
          <Button bsStyle="primary" onClick={this.handleSave}>
            Save changes
          </Button>
        </Modal.Footer>
      </Modal>
    );
  }
}

const mapStateToProps = (state) => ({
  accessToken: state.authentication.accessToken,
});

export default connect(mapStateToProps)(UsersModal);

UsersModal.propTypes = {
  show: PropTypes.bool.isRequired,
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  accessToken: PropTypes.string.isRequired,
  onHide: PropTypes.func.isRequired,
};

UsersModal.defaultProps = {
  id: undefined,
};
