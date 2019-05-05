import React, { Component } from 'react';
import { connect } from 'react-redux';

import {
    Button, Modal, Col,
    Form, FormGroup, FormControl, ControlLabel
} from 'react-bootstrap';

import notifications from '../../../utils/notifications';

import usersFacade from '../../../facades/users';
import rolesFacade from '../../../facades/roles';

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
    verificationToken: null
};

const userRoleInitialValues = {
    id: 3,
    name: 'author'
};

class UsersModal extends Component {

    constructor(props) {
        super(props);

        this.accessToken = this.props.accessToken;

        this.state = {
            user: {
                ...userInitialValues,
            },
            userRole: {
                ...userRoleInitialValues
            },
            rolesOptions: []
        }
    }

    onEnter = async () => {
        if (this.props.id) {
            const { user, roles } = await usersFacade.getUserById({ id: this.props.id, accessToken: this.accessToken });
            const userRole = roles[0] || { ...userRoleInitialValues };
            this.setState({
                user,
                userRole
            });
        }
    }

    getValidationState = () => {
        if (this.state.user.username.length > 0
            && this.state.user.email.length > 0
            && ((!this.props.id && this.state.user.password.length > 0) || this.props.id)) {
            return VALIDATION_STATE_SUCCESS;
        }
        return VALIDATION_STATE_ERROR;
    }

    handleChange = e => {
        const user = { ...this.state.user };
        const id = e.target.id.replace(PREFIX, '');
        user[id] = e.target.value;
        this.setState({
            user
        });
    }

    handleChangeRole = e => {
        const user = { ...this.state.user };
        const userRole = this.state.rolesOptions.find(r => r.id === parseInt(e.target.value));
        this.setState({
            user,
            userRole
        });
    }

    handleHide = () => {
        this.setState({
            user: {
                ...userInitialValues
            },
            userRole: {
                ...userRoleInitialValues
            }
        });
        this.props.onHide();
    }

    handleSave = async () => {
        if (this.getValidationState() === VALIDATION_STATE_SUCCESS) {
            const data = { ...this.state.user };
            const roleId = this.state.userRole.id;
            try {
                const userId = await usersFacade.saveUser({ data, accessToken: this.accessToken });
                await rolesFacade.saveRoleForUser({ userId, roleId, accessToken: this.accessToken });
                notifications.success('Saved');
                this.handleHide();
            } catch (error) {
                notifications.error('Error saving');
                throw error;
            }
        } else {
            notifications.error("All mandatory fields must be filled!");
        }
    }

    async componentDidMount() {
        const format = r => ({ id: r.id, name: r.name });
        const rolesOptions = await rolesFacade.getAllRoles({ accessToken: this.accessToken, format });
        this.setState({
            rolesOptions
        });
    }

    render() {
        return (
            <Modal show={this.props.show} onHide={this.handleHide} onEnter={this.onEnter}>
                <Modal.Header closeButton>
                    <Modal.Title>{this.props.id ? 'Edit user' : 'Create new user'}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form horizontal autoComplete="off">
                        <FormGroup
                            controlId="search-username"
                            bsSize='sm'
                            validationState={this.getValidationState()}
                        >
                            <Col componentClass={ControlLabel} sm={titleColWidth}>
                                User name
                            </Col>
                            <Col sm={mainColWidth}>
                                <FormControl
                                    type="text"
                                    value={this.state.user.username}
                                    placeholder="Enter Username"
                                    onChange={this.handleChange}
                                    data-lpignore={true}
                                />
                                <FormControl.Feedback />
                            </Col>
                        </FormGroup>
                        <FormGroup
                            controlId="email"
                            bsSize='sm'
                            validationState={this.getValidationState()}
                        >
                            <Col componentClass={ControlLabel} sm={titleColWidth}>
                                Email
                            </Col>
                            <Col sm={mainColWidth}>
                                <FormControl
                                    type="email"
                                    value={this.state.user.email}
                                    placeholder="Enter Email"
                                    onChange={this.handleChange}
                                    data-lpignore={true}
                                />
                                <FormControl.Feedback />
                            </Col>
                        </FormGroup>
                        {
                            !this.props.id &&  // render password field only when creating new user
                            <FormGroup
                                controlId="search-password"
                                bsSize='sm'
                                validationState={this.props.id ? null : this.getValidationState()}
                            >
                                <Col componentClass={ControlLabel} sm={titleColWidth}>
                                    {this.props.id ? 'Set new password' : 'Password'}
                                </Col>
                                <Col sm={mainColWidth}>
                                    <FormControl
                                        type="password"
                                        value={this.state.user.password}
                                        onChange={this.handleChange}
                                        data-lpignore={true}
                                    />
                                    <FormControl.Feedback />
                                </Col>
                            </FormGroup>
                        }
                        <FormGroup
                            controlId="roles"
                            bsSize='sm'
                        >
                            <Col componentClass={ControlLabel} sm={titleColWidth}>
                                Role
                            </Col>
                            <Col sm={mainColWidth}>
                                <FormControl
                                    componentClass="select"
                                    placeholder="select"
                                    value={this.state.userRole.id}
                                    onChange={this.handleChangeRole} >
                                    {
                                        this.state.rolesOptions.map(r => <option value={r.id} key={r.id}>{r.name.toUpperCase()}</option>)
                                    }
                                </FormControl>
                            </Col>
                        </FormGroup>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={this.handleHide}>Close</Button>
                    <Button bsStyle="primary" onClick={this.handleSave}>Save changes</Button>
                </Modal.Footer>
            </Modal>
        )
    }
}

const mapStateToProps = state => ({
    accessToken: state.authentication.accessToken
});

export default connect(mapStateToProps)(UsersModal);