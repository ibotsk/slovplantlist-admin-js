import React, { Component } from 'react';
import { connect } from 'react-redux';

import {
  Col,
  Button, Modal,
  Form, FormGroup, FormControl, ControlLabel,
} from 'react-bootstrap';

import { Typeahead } from 'react-bootstrap-typeahead';

import PropTypes from 'prop-types';

import { notifications } from 'utils';

import { genusFacade, familiesFacade } from 'facades';

const VALIDATION_STATE_SUCCESS = 'success';
const VALIDATION_STATE_ERROR = 'error';

const titleColWidth = 2;
const mainColWidth = 10;

const initialValues = {
  id: undefined,
  name: '',
  authors: '',
  vernacular: '',
  idFamily: undefined,
  idFamilyApg: undefined,
};

class GeneraModal extends Component {
  constructor(props) {
    super(props);

    this.state = {
      genus: {
        ...initialValues,
      },
      families: [],
      familiesApg: [],
    };
  }

  async componentDidMount() {
    const { accessToken } = this.props;
    const format = (f) => ({ id: f.id, label: f.name });
    const families = await familiesFacade.getAllFamilies(accessToken, format);
    const familiesApg = await familiesFacade.getAllFamiliesApg(
      accessToken, format,
    );
    this.setState({
      families,
      familiesApg,
    });
  }

  onEnter = async () => {
    const { id, accessToken } = this.props;
    if (id) {
      const { genus } = await genusFacade.getGenusByIdWithFamilies(
        id, accessToken,
      );
      this.setState({
        genus,
      });
    }
  }

  getValidationState = () => {
    const { genus } = this.state;
    if (genus.name.length > 0 && genus.authors.length > 0) {
      return VALIDATION_STATE_SUCCESS;
    }
    return VALIDATION_STATE_ERROR;
  }

  handleChangeInput = (e) => {
    const { id: prop, value } = e.target;
    return this.setState((state) => {
      const { genus } = state;
      genus[prop] = value;
      return {
        genus,
      };
    });
  };

  handleHide = () => {
    this.setState({
      genus: { ...initialValues },
    });
    const { onHide } = this.props;
    onHide();
  }

  handleSave = async () => {
    if (this.getValidationState() === VALIDATION_STATE_SUCCESS) {
      const { accessToken } = this.props;
      const { genus } = this.state;
      try {
        await genusFacade.saveGenus(genus, accessToken);
        notifications.success('Saved');
        this.handleHide();
      } catch (error) {
        notifications.error('Error saving');
        throw error;
      }
    } else {
      notifications.error('Genus name and authors must not be empty!');
    }
  }

  handleChangeTypeahead = (selected, prop) => {
    const id = selected[0] ? selected[0].id : undefined;
    this.setState((state) => {
      const { genus } = state;
      genus[prop] = id;
      return {
        genus,
      };
    });
  }

  render() {
    const { show, id } = this.props;
    const {
      families, familiesApg,
      genus: {
        name, authors, idFamily, idFamilyApg,
        vernacular,
      },
    } = this.state;
    return (
      <Modal show={show} onHide={this.handleHide} onEnter={this.onEnter}>
        <Modal.Header closeButton>
          <Modal.Title>
            {id ? 'Edit genus' : 'Create new genus'}
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
                  value={name || ''}
                  placeholder="Genus name"
                  onChange={this.handleChangeInput}
                />
                <FormControl.Feedback />
              </Col>
            </FormGroup>
            <FormGroup
              controlId="authors"
              bsSize="sm"
              validationState={this.getValidationState()}
            >
              <Col componentClass={ControlLabel} sm={titleColWidth}>
                Authors
              </Col>
              <Col sm={mainColWidth}>
                <FormControl
                  type="text"
                  value={authors || ''}
                  placeholder="Authors"
                  onChange={this.handleChangeInput}
                />
                <FormControl.Feedback />
              </Col>
            </FormGroup>
            <FormGroup
              controlId="family"
              bsSize="sm"
            >
              <Col componentClass={ControlLabel} sm={titleColWidth}>
                Family
              </Col>
              <Col sm={mainColWidth}>
                <Typeahead
                  id="family-autocomplete"
                  options={families}
                  selected={families.filter((f) => f.id === idFamily)}
                  onChange={(selected) => (
                    this.handleChangeTypeahead(selected, 'idFamily')
                  )}
                  placeholder="Start by typing a family in the database"
                />
              </Col>
            </FormGroup>
            <FormGroup
              controlId="family-apg"
              bsSize="sm"
            >
              <Col componentClass={ControlLabel} sm={titleColWidth}>
                Family APG
              </Col>
              <Col sm={mainColWidth}>
                <Typeahead
                  id="family-autocomplete"
                  options={familiesApg}
                  selected={familiesApg.filter((f) => f.id === idFamilyApg)}
                  onChange={(selected) => (
                    this.handleChangeTypeahead(selected, 'idFamilyApg')
                  )}
                  placeholder="Start by typing a family APG in the database"
                />
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
                  value={vernacular || ''}
                  placeholder="Vernacular name"
                  onChange={this.handleChangeInput}
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

export default connect(mapStateToProps)(GeneraModal);

GeneraModal.propTypes = {
  show: PropTypes.bool.isRequired,
  id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
  accessToken: PropTypes.string.isRequired,
  onHide: PropTypes.func.isRequired,
};
