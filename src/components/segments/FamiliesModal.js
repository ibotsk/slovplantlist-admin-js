import React, { Component } from 'react';

import {
    Button, Modal, Col,
    Form, FormGroup, FormControl, ControlLabel
} from 'react-bootstrap';

import notifications from '../../utils/notifications';

import familiesFacade from '../../facades/families';

const VALIDATION_STATE_SUCCESS = 'success';
const VALIDATION_STATE_ERROR = 'error';

const titleColWidth = 2;
const mainColWidth = 10;

const initialValues = {
    id: undefined,
    name: '',
    vernacular: ''
};

class FamiliesModal extends Component {

    constructor(props) {
        super(props);

        this.state = {
            ...initialValues
        }
    }

    onEnter = async () => {
        if (this.props.id) {
            const accessToken = this.props.accessToken;
            const data = await familiesFacade.getFamilyByIdCurated({ id: this.props.id, accessToken });
            this.setState({ ...data });
        }
    }

    getValidationState = () => {
        if (this.state.name.length > 0) {
            return VALIDATION_STATE_SUCCESS;
        }
        return VALIDATION_STATE_ERROR;
    }

    handleChange = e => {
        this.setState({
            [e.target.id]: e.target.value
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
            const accessToken = this.props.accessToken;
            const data = { ...this.state };
            try {
                await familiesFacade.saveFamily({ data, accessToken });
                notifications.success('Saved');
                this.handleHide();
            } catch (error) {
                notifications.error('Error saving');
                throw error;
            }
        } else {
            notifications.error("Family name must not be empty!");
        }
    }

    render() {
        return (
            <Modal show={this.props.show} onHide={this.handleHide} onEnter={this.onEnter}>
                <Modal.Header closeButton>
                    <Modal.Title>{this.props.id ? 'Edit family' : 'Create new family'}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form horizontal>
                        <FormGroup
                            controlId="name"
                            bsSize='sm'
                            validationState={this.getValidationState()}
                        >
                            <Col componentClass={ControlLabel} sm={titleColWidth}>
                                Name
                            </Col>
                            <Col sm={mainColWidth}>
                                <FormControl
                                    type="text"
                                    value={this.state.name}
                                    placeholder="Family name"
                                    onChange={this.handleChange}
                                />
                                <FormControl.Feedback />
                            </Col>
                        </FormGroup>
                        <FormGroup
                            controlId="vernacular"
                            bsSize='sm'
                        >
                            <Col componentClass={ControlLabel} sm={titleColWidth}>
                                Vernacular
                            </Col>
                            <Col sm={mainColWidth}>
                                <FormControl
                                    type="text"
                                    value={this.state.vernacular}
                                    placeholder="Vernacular"
                                    onChange={this.handleChange}
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

export default FamiliesModal;