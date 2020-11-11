import React, { useState } from 'react';
import { connect } from 'react-redux';

import {
  Col,
  Button, Modal,
  Form, FormGroup, FormControl, ControlLabel,
} from 'react-bootstrap';

import { AsyncTypeahead } from 'react-bootstrap-typeahead';

import PropTypes from 'prop-types';

import { notifications } from 'utils';
import config from 'config/config';

import { genusFacade, familiesFacade } from 'facades';

const {
  getAllFamiliesBySearchTerm,
  getAllFamiliesApgBySearchTerm,
} = familiesFacade;

const VALIDATION_STATE_SUCCESS = 'success';
const VALIDATION_STATE_ERROR = 'error';

const titleColWidth = 2;
const mainColWidth = 10;

const ntypes = config.mappings.genusType;

const initialValues = {
  id: undefined,
  ntype: '',
  name: '',
  authors: '',
  vernacular: '',
  idFamily: undefined,
  idFamilyApg: undefined,
};

const GeneraModal = ({
  editId, show, onHide, accessToken,
}) => {
  const [genus, setGenus] = useState(initialValues);
  const [families, setFamilies] = useState([]);
  const [familiesApg, setFamiliesApg] = useState([]);
  const [isLoading, setLoading] = useState(false);
  const [selectedFamily, setSelectedFamily] = useState([]);
  const [selectedFamilyApg, setSelectedFamilyApg] = useState([]);

  const onEnter = async () => {
    if (editId) {
      const {
        genus: dbGenus, family, familyApg,
      } = await genusFacade.getGenusByIdWithFamilies(
        editId, accessToken,
      );

      setGenus(dbGenus);
      setSelectedFamily(family ? [family] : []);
      setSelectedFamilyApg(familyApg ? [familyApg] : []);
    }
  };

  const getValidationState = () => {
    if (genus.name.length > 0 && genus.authors.length > 0) {
      return VALIDATION_STATE_SUCCESS;
    }
    return VALIDATION_STATE_ERROR;
  };

  const handleChangeInput = (e) => {
    const { id: prop, value } = e.target;
    setGenus({
      ...genus,
      [prop]: value,
    });
  };

  const handleHide = () => {
    setGenus({ ...initialValues });
    onHide();
  };

  const handleSave = async () => {
    if (getValidationState() === VALIDATION_STATE_SUCCESS) {
      try {
        await genusFacade.saveGenus(genus, accessToken);
        notifications.success('Saved');
        handleHide();
      } catch (error) {
        notifications.error('Error saving');
        throw error;
      }
    } else {
      notifications.error('Genus name and authors must not be empty!');
    }
  };

  const handleSearchFamily = async (query) => {
    setLoading(true);
    const results = await getAllFamiliesBySearchTerm(query, accessToken);
    setLoading(false);
    setFamilies(results);
  };

  const handleSearchFamilyApg = async (query) => {
    setLoading(true);
    const results = await getAllFamiliesApgBySearchTerm(query, accessToken);
    setLoading(false);
    setFamiliesApg(results);
  };

  const handleOnChangeTypeaheadFamily = (selected) => {
    setSelectedFamily(selected);
    setGenus({
      ...genus,
      idFamily: selected[0] ? selected[0].id : undefined,
    });
  };

  const handleOnChangeTypeaheadFamilyApg = (selected) => {
    setSelectedFamilyApg(selected);
    setGenus({
      ...genus,
      idFamilyApg: selected[0] ? selected[0].id : undefined,
    });
  };

  const {
    ntype, name, authors, vernacular,
  } = genus;

  return (
    <Modal show={show} onHide={handleHide} onEnter={onEnter}>
      <Modal.Header closeButton>
        <Modal.Title>
          {editId ? 'Edit genus' : 'Create new genus'}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form horizontal>
          <FormGroup controlId="ntype" bsSize="sm">
            <Col componentClass={ControlLabel} sm={titleColWidth}>
              Type
            </Col>
            <Col sm={mainColWidth}>
              <FormControl
                componentClass="select"
                placeholder="select"
                value={ntype || ''}
                onChange={handleChangeInput}
              >
                {Object.keys(ntypes).map((t) => (
                  <option value={t} key={t}>{ntypes[t].label}</option>
                ))}
              </FormControl>
            </Col>
          </FormGroup>
          <FormGroup
            controlId="name"
            bsSize="sm"
            validationState={getValidationState()}
          >
            <Col componentClass={ControlLabel} sm={titleColWidth}>
              Name
            </Col>
            <Col sm={mainColWidth}>
              <FormControl
                type="text"
                value={name || ''}
                placeholder="Genus name"
                onChange={handleChangeInput}
              />
              <FormControl.Feedback />
            </Col>
          </FormGroup>
          <FormGroup
            controlId="authors"
            bsSize="sm"
            validationState={getValidationState()}
          >
            <Col componentClass={ControlLabel} sm={titleColWidth}>
              Authors
            </Col>
            <Col sm={mainColWidth}>
              <FormControl
                type="text"
                value={authors || ''}
                placeholder="Authors"
                onChange={handleChangeInput}
              />
              <FormControl.Feedback />
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
              <AsyncTypeahead
                id="family-apg-autocomplete"
                labelKey="name"
                isLoading={isLoading}
                onSearch={handleSearchFamilyApg}
                options={familiesApg}
                selected={selectedFamilyApg}
                onChange={handleOnChangeTypeaheadFamilyApg}
                placeholder="Start by typing (case sensitive)"
              />
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
              <AsyncTypeahead
                id="family-autocomplete"
                labelKey="name"
                isLoading={isLoading}
                onSearch={handleSearchFamily}
                options={families}
                selected={selectedFamily}
                onChange={handleOnChangeTypeaheadFamily}
                placeholder="Start by typing (case sensitive)"
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
                onChange={handleChangeInput}
              />
              <FormControl.Feedback />
            </Col>
          </FormGroup>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={handleHide}>Close</Button>
        <Button bsStyle="primary" onClick={handleSave}>
          Save changes
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

const mapStateToProps = (state) => ({
  accessToken: state.authentication.accessToken,
});

export default connect(mapStateToProps)(GeneraModal);

GeneraModal.propTypes = {
  show: PropTypes.bool.isRequired,
  editId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  accessToken: PropTypes.string.isRequired,
  onHide: PropTypes.func.isRequired,
};

GeneraModal.defaultProps = {
  editId: undefined,
};
