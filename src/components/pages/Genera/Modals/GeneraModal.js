import React, { useState } from 'react';
import { connect } from 'react-redux';

import {
  Col,
  Button, Modal,
  Form, FormGroup, FormControl, ControlLabel,
} from 'react-bootstrap';

import { AsyncTypeahead } from 'react-bootstrap-typeahead';

import PropTypes from 'prop-types';

import AddableList from 'components/segments/AddableList';

import { helperUtils, notifications, sorterUtils } from 'utils';
import config from 'config/config';

import { genusFacade, familiesFacade } from 'facades';

import GenusSynonymListItem from './items/GenusSynonymListItem';
import GenusSynonymMenu from './items/GenusSynonymMenu';

const {
  getGenusByIdWithRelations,
  saveGenusAndSynonyms,
  getAllGeneraBySearchTerm,
  getAllGeneraBySearchTermWithAccepted,
} = genusFacade;
const {
  getAllFamiliesBySearchTerm,
  getAllFamiliesApgBySearchTerm,
} = familiesFacade;

const genusIdLabelFormat = (g) => (
  { id: g.id, label: helperUtils.genusString(g) }
);
const genusIdLabelAcceptedFormat = (g) => {
  const idLabel = genusIdLabelFormat(g);
  let accepted;
  if (g.accepted) {
    accepted = g.accepted;
  }
  return {
    ...idLabel,
    accepted,
  };
};

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

const createNewSynonymToList = async (
  selected,
  idParent,
  type,
  accessToken,
) => {
  // when adding synonyms to a new record, idParent is undefined
  const { id: selectedId } = selected;
  const synonymObj = genusFacade.createSynonym(idParent, selectedId, type);
  const { genus: genusSyn, accepted } = await getGenusByIdWithRelations(
    selectedId, accessToken,
  );
  return {
    ...synonymObj,
    synonym: {
      ...genusSyn,
      accepted,
    },
  };
};

const synonymsChanged = (list) => {
  list.sort(sorterUtils.generaSynonymSorterLex);
  return list.map((item, i) => ({ ...item, rorder: i + 1 }));
};

const GeneraModal = ({
  editId, show, onHide, accessToken,
}) => {
  const [genus, setGenus] = useState(initialValues);
  const [acceptedOptions, setAcceptedOptions] = useState([]);
  const [families, setFamilies] = useState([]);
  const [familiesApg, setFamiliesApg] = useState([]);
  const [isLoading, setLoading] = useState(false);
  const [selectedAccepted, setSelectedAccepted] = useState([]); // stored as { id, label }
  const [selectedFamily, setSelectedFamily] = useState([]);
  const [selectedFamilyApg, setSelectedFamilyApg] = useState([]);
  const [synonyms, setSynonyms] = useState([]);

  const onEnter = async () => {
    if (editId) {
      const {
        genus: dbGenus, accepted, family, familyApg, synonyms: syns,
      } = await getGenusByIdWithRelations(
        editId, accessToken,
      );

      setGenus(dbGenus);
      setSelectedAccepted(accepted ? [genusIdLabelFormat(accepted)] : []);
      setSelectedFamily(family ? [family] : []);
      setSelectedFamilyApg(familyApg ? [familyApg] : []);
      setSynonyms(syns);
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
        await saveGenusAndSynonyms(genus, synonyms, accessToken, false);
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

  const handleSearchAccepted = async (query) => {
    setLoading(true);
    const results = await getAllGeneraBySearchTerm(
      query, accessToken, genusIdLabelFormat,
    );
    setLoading(false);
    setAcceptedOptions(results);
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

  const handleOnChangeTypeaheadAccepted = (selected) => {
    setSelectedAccepted(selected);
    setGenus({
      ...genus,
      idAcceptedName: selected[0] ? selected[0].id : undefined,
    });
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

  const handleSynonymAddRow = async (selectedSpecies, type) => {
    if (selectedSpecies) {
      if (synonyms.find((s) => s.synonym.id === selectedSpecies.id)) {
        notifications.warning('The item already exists in the list');
        return;
      }

      const newSynonym = await createNewSynonymToList(
        selectedSpecies, editId, type, accessToken,
      );
      synonyms.push(newSynonym);
      const sorted = synonymsChanged(synonyms);

      setSynonyms(sorted);
    }
  };

  const handleSynonymRemoveRow = (rowId) => {
    const synonymsWithoutRemoved = synonyms.filter((_, i) => i !== rowId);
    const sorted = synonymsChanged(synonymsWithoutRemoved);
    setSynonyms(sorted);
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
          <FormGroup
            controlId="accepted"
            bsSize="sm"
          >
            <Col componentClass={ControlLabel} sm={titleColWidth}>
              Accepted name
            </Col>
            <Col sm={mainColWidth}>
              <AsyncTypeahead
                id="accepted-autocomplete"
                labelKey="label"
                isLoading={isLoading}
                onSearch={handleSearchAccepted}
                options={acceptedOptions}
                selected={selectedAccepted}
                onChange={handleOnChangeTypeaheadAccepted}
                placeholder="Start by typing (case sensitive)"
              />
            </Col>
          </FormGroup>
          <hr />
          <FormGroup
            controlId="synonyms"
            bsSize="sm"
          >
            <Col componentClass={ControlLabel} sm={titleColWidth}>
              Synonyms
            </Col>
            <Col sm={mainColWidth}>
              <AddableList
                id="synonyms-autocomplete"
                async
                data={synonyms}
                onSearch={(query) => getAllGeneraBySearchTermWithAccepted(
                  query, accessToken, genusIdLabelAcceptedFormat,
                )}
                onAddItemToList={(selected) => handleSynonymAddRow(
                  selected,
                  config.mappings.synonym.taxonomic.numType,
                )}
                onRowDelete={(rowId) => handleSynonymRemoveRow(
                  rowId,
                )}
                itemComponent={({ rowId, data, onRowDelete }) => (
                  <GenusSynonymListItem
                    rowId={rowId}
                    data={data}
                    onRowDelete={onRowDelete}
                    assignedToName={genus}
                  />
                )}
                renderMenu={(results, menuProps) => (
                  <GenusSynonymMenu
                    results={results}
                    menuProps={menuProps}
                    assignedToName={genus}
                  />
                )}
              />
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
