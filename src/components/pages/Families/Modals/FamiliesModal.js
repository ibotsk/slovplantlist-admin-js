import React, { Component } from 'react';
import { connect } from 'react-redux';

import {
  Button, Modal, Col,
  Form, FormGroup, FormControl, ControlLabel,
} from 'react-bootstrap';

import PropTypes from 'prop-types';

import { notifications } from 'utils';

import { familiesFacade } from 'facades';

const VALIDATION_STATE_SUCCESS = 'success';
const VALIDATION_STATE_ERROR = 'error';

const titleColWidth = 2;
const mainColWidth = 10;

const initialValues = {
  id: undefined,
  name: '',
  vernacular: '',
};

class FamiliesModal extends Component {
  constructor(props) {
    super(props);

    this.state = {
      ...initialValues,
    };
  }

    onEnter = async () => {
      const { id, accessToken } = this.props;
      if (id) {
        const data = await familiesFacade.getFamilyByIdCurated(id, accessToken);
        this.setState({ ...data });
      }
    }

    getValidationState = () => {
      const { name } = this.state;
      if (name.length > 0) {
        return VALIDATION_STATE_SUCCESS;
      }
      return VALIDATION_STATE_ERROR;
    }

    handleChange = (e) => {
      this.setState({
        [e.target.id]: e.target.value,
      });
    }

    handleHide = () => {
      this.setState({
        ...initialValues,
      });
      const { onHide } = this.props;
      onHide();
    }

    handleSave = async () => {
      if (this.getValidationState() === VALIDATION_STATE_SUCCESS) {
        const { data } = this.state;
        const { accessToken } = this.props;
        try {
          await familiesFacade.saveFamily(data, accessToken);
          notifications.success('Saved');
          this.handleHide();
        } catch (error) {
          notifications.error('Error saving');
          throw error;
        }
      } else {
        notifications.error('Family name must not be empty!');
      }
    }

    render() {
      const { show, id } = this.props;
      const { name, vernacular } = this.state;
      return (
        <Modal show={show} onHide={this.handleHide} onEnter={this.onEnter}>
          <Modal.Header closeButton>
            <Modal.Title>
              {id ? 'Edit family' : 'Create new family'}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form horizontal>
              <FormGroup
                controlId="name"
                bsSize="sm"
                validationState={this.getValidationState()}
              >
                <Col componentClass={ControlLabel} sm={titleColWidth}>
                  Name
                </Col>
                <Col sm={mainColWidth}>
                  <FormControl
                    type="text"
                    value={name}
                    placeholder="Family name"
                    onChange={this.handleChange}
                  />
                  <FormControl.Feedback />
                </Col>
              </FormGroup>
              <FormGroup
                controlId="vernacular"
                bsSize="sm"
              >
                <Col componentClass={ControlLabel} sm={titleColWidth}>
                  Vernacular
                </Col>
                <Col sm={mainColWidth}>
                  <FormControl
                    type="text"
                    value={vernacular}
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

export default connect(mapStateToProps)(FamiliesModal);

FamiliesModal.propTypes = {
  show: PropTypes.bool.isRequired,
  id: PropTypes.number.isRequired,
  accessToken: PropTypes.string.isRequired,
  onHide: PropTypes.func.isRequired,
};
