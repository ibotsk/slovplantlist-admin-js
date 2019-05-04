import React, { Component } from 'react';
import { connect } from 'react-redux';

import {
    Button, Modal, Col,
    Form, FormGroup, FormControl, ControlLabel
} from 'react-bootstrap';

import notifications from '../../../utils/notifications';

import usersFacade from '../../../facades/users';

const VALIDATION_STATE_SUCCESS = 'success';
const VALIDATION_STATE_ERROR = 'error';

const PREFIX = 'search-'; // to prevent LastPass to autofill username and password

const titleColWidth = 2;
const mainColWidth = 10;

const initialValues = {
    id: undefined,
    username: '',
    email: '',
    password: '',
    realm: '',
    emailVerified: false,
    verificationToken: null,
    roles: []
};

class UsersModal extends Component {

    constructor(props) {
        super(props);

        this.accessToken = this.props.accessToken;

        this.state = {
            ...initialValues
        }
    }

    onEnter = async () => {
        if (this.props.id) {
            const data = await usersFacade.getUserById({ id: this.props.id, accessToken: this.accessToken });
            this.setState({ ...data });
        }
    }

    getValidationState = () => {
        if (this.state.username.length > 0 
            && this.state.email.length > 0
            && ((!this.props.id && this.state.password.length > 0) || this.props.id)) {
            return VALIDATION_STATE_SUCCESS;
        }
        return VALIDATION_STATE_ERROR;
    }

    handleChange = e => {
        const id = e.target.id.replace(PREFIX, '');
        this.setState({
            [id]: e.target.value
        });
    }

    handleHide = () => {
        this.setState({
            ...initialValues
        });
        this.props.onHide();
    }

    handleSave = async () => {
        if (this.getValidationState() === VALIDATION_STATE_SUCCESS) {
            const data = { ...this.state };
            try {
                await usersFacade.saveUser({ data, accessToken: this.accessToken });
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
                                    value={this.state.username}
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
                                    value={this.state.email}
                                    placeholder="Enter Email"
                                    onChange={this.handleChange}
                                    data-lpignore={true}
                                />
                                <FormControl.Feedback />
                            </Col>
                        </FormGroup>
                        <FormGroup
                            controlId="search-password"
                            bsSize='sm'
                            validationState={this.props.id ? null: this.getValidationState()}
                        >
                            <Col componentClass={ControlLabel} sm={titleColWidth}>
                                {this.props.id ? 'Set new password' : 'Password'}
                            </Col>
                            <Col sm={mainColWidth}>
                                <FormControl
                                    type="password"
                                    value={this.state.password}
                                    onChange={this.handleChange}
                                    data-lpignore={true}
                                />
                                <FormControl.Feedback />
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