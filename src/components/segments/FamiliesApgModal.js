import React, { Component } from 'react';

import {
    Button, Modal,
    Form, FormGroup, FormControl
} from 'react-bootstrap';

import familiesFacade from '../../facades/families';

const VALIDATION_STATE_SUCCESS = 'success';
const VALIDATION_STATE_ERROR = 'error';

const initialValues = {
    id: undefined,
    name: '',
    vernacular: ''
};

class FamiliesApgModal extends Component {

    constructor(props) {
        super(props);

        this.state = {
            ...initialValues
        }
    }

    onEnter = async () => {
        if (this.props.id) {
            const accessToken = this.props.accessToken;
            const data = await familiesFacade.getFamilyApgByIdCurated({ id: this.props.id, accessToken });
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
            await familiesFacade.saveFamilyApg({ data, accessToken });
            this.handleHide();
        } else {
            alert("Family name must not be empty!");
        }
    }

    render() {
        return (
            <Modal show={this.props.show} onHide={this.handleHide} onEnter={this.onEnter}>
                <Modal.Header closeButton>
                    <Modal.Title>{this.props.id ? 'Edit family APG' : 'Create new family APG'}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <FormGroup
                            controlId="name"
                            bsSize='sm'
                            validationState={this.getValidationState()}
                        >
                            <FormControl
                                type="text"
                                value={this.state.name}
                                placeholder="Family name"
                                onChange={this.handleChange}
                            />
                            <FormControl.Feedback />
                        </FormGroup>
                        <FormGroup
                            controlId="vernacular"
                            bsSize='sm'
                        >
                            <FormControl
                                type="text"
                                value={this.state.vernacular}
                                placeholder="Vernacular name"
                                onChange={this.handleChange}
                            />
                            <FormControl.Feedback />
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

export default FamiliesApgModal;