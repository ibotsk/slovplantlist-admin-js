import React, { Component } from 'react';
import { connect } from 'react-redux';

import {
  Grid, Col, Row, Well, Panel,
  Form, FormControl, FormGroup, ControlLabel,
  Checkbox, Button,
} from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { AsyncTypeahead } from 'react-bootstrap-typeahead';

import PropTypes from 'prop-types';

import { NotificationContainer } from 'react-notifications';

import AddableList from 'components/segments/AddableList';
import LosName from 'components/segments/Checklist/LosName';
import PlainListOfSpeciesNames from
  'components/segments/Checklist/PlainListOfSpeciesNames';

import { speciesFacade, genusFacade } from 'facades';

import { notifications, helperUtils } from 'utils';
import config from 'config/config';

import 'styles/custom.css';

import {
  NomenclatoricSynonymListItem,
  TaxonomicSynonymListItem,
  InvalidSynonymListItem,
  MisidentifiedSynonymListItem,
} from './items';

const LABEL_COL_WIDTH = 2;
const CONTENT_COL_WIDTH = 10;

const ID_GENUS_NAME_PROP = 'idGenus';
const ID_ACCEPTED_NAME_PROP = 'idAcceptedName';
const ID_BASIONYM_NAME_PROP = 'idBasionym';
const ID_REPLACED_NAME_PROP = 'idReplaced';
const ID_NOMEN_NOVUM_NAME_PROP = 'idNomenNovum';

const CHECKLIST_LIST_URI = '/checklist';

const ntypes = config.mappings.losType;

const recordInitialValues = {
  authors: '',
  authorsH: '',
  forma: '',
  formaH: '',
  genus: '',
  genusH: '',
  hybrid: false,
  id: undefined,
  idAcceptedName: undefined,
  idBasionym: undefined,
  idGenus: undefined,
  idNomenNovum: undefined,
  idReplaced: undefined,
  isBasionym: false,
  isIsonym: false,
  notes: '',
  nothoforma: '',
  nothoformaH: '',
  nothosubsp: '',
  nothosubspH: '',
  ntype: 'A',
  ntypeOrder: 8,
  publication: '',
  species: '',
  speciesH: '',
  subsp: '',
  subspH: '',
  subvar: '',
  subvarH: '',
  synType: undefined,
  tribus: '',
  var: '',
  varH: '',
  vernacular: '',
};

const createNewSynonymToList = async (
  selected,
  idParent,
  type,
  accessToken,
) => {
  // when adding synonyms to a new record, idParent is undefined
  const { id: selectedId } = selected;
  const synonymObj = speciesFacade.createSynonym(idParent, selectedId, type);
  const species = await speciesFacade.getSpeciesById(selectedId, accessToken);
  return {
    ...synonymObj,
    synonym: species,
  };
};

const synonymsChanged = (list) => {
  list.sort(helperUtils.synonymSorterLex);
  return list.map((item, i) => ({ ...item, rorder: i + 1 }));
};

class SpeciesRecord extends Component {
  constructor(props) {
    super(props);

    this.state = {
      record: {
        ...recordInitialValues,
      },
      listOfSpecies: [],
      genera: [],
      familyApg: '',
      family: '',
      isLoading: false,
      [`${ID_ACCEPTED_NAME_PROP}Selected`]: undefined,
      [`${ID_BASIONYM_NAME_PROP}Selected`]: undefined,
      [`${ID_REPLACED_NAME_PROP}Selected`]: undefined,
      [`${ID_NOMEN_NOVUM_NAME_PROP}Selected`]: undefined,
      [`${ID_GENUS_NAME_PROP}Selected`]: undefined,

      nomenclatoricSynonyms: [], // contains objects of synonym
      taxonomicSynonyms: [],
      invalidDesignations: [],
      misidentifications: [],

      basionymFor: [],
      replacedFor: [],
      nomenNovumFor: [],
    };
  }

  async componentDidMount() {
    const { recordId, accessToken } = this.props;
    if (recordId) {
      const {
        speciesRecord, accepted, basionym, replaced,
        nomenNovum, genus, familyApg, family,
      } = await speciesFacade.getRecordById(recordId, accessToken);

      const {
        nomenclatoricSynonyms, taxonomicSynonyms,
        invalidDesignations, misidentifications,
      } = await speciesFacade.getSynonyms(recordId, accessToken);
      const {
        basionymFor, replacedFor, nomenNovumFor,
      } = await speciesFacade.getBasionymsFor(recordId, accessToken);

      this.setState({
        record: speciesRecord,
        [`${ID_ACCEPTED_NAME_PROP}Selected`]: accepted,
        [`${ID_BASIONYM_NAME_PROP}Selected`]: basionym,
        [`${ID_REPLACED_NAME_PROP}Selected`]: replaced,
        [`${ID_NOMEN_NOVUM_NAME_PROP}Selected`]: nomenNovum,
        [`${ID_GENUS_NAME_PROP}Selected`]: genus,
        familyApg,
        family,
        nomenclatoricSynonyms,
        taxonomicSynonyms,
        invalidDesignations,
        misidentifications,
        basionymFor,
        replacedFor,
        nomenNovumFor,
      });
    }
  }

  handleChangeInput = (e) => {
    this.handleChange(e.target.id, e.target.value);
  }

  handleChangeCheckbox = (e) => {
    this.handleChange(e.target.id, e.target.checked);
  }

  handleChange = (property, value) => (
    this.setState((state) => {
      const { record } = state;
      record[property] = value;
      return record;
    }));

  getSelectedTypeahead = (id) => {
    const { [`${id}Selected`]: selectedTypeahead } = this.state;
    return selectedTypeahead;
  }

  handleChangeGenusTypeahead = async (selected, prop) => {
    const { accessToken } = this.props;
    const id = selected[0] ? selected[0].id : undefined;
    if (id) {
      const { family, familyApg } = await genusFacade.getGenusByIdWithFamilies(
        id, accessToken,
      );
      this.setState({
        family: family.name,
        familyApg: familyApg.name,
      });
    }
    this.handleChangeTypeaheadSingle(selected, prop);
  }

  handleChangeTypeaheadSingle = (selected, prop) => {
    const id = selected[0] ? selected[0].id : undefined;
    const propSelected = `${prop}Selected`;
    this.setState({
      [propSelected]: selected,
    });
    this.handleChange(prop, id);
  }

  handleSearchSpeciesAsyncTypeahead = async (query) => {
    this.setState({ isLoading: true });
    const listOfSpecies = await this.handleSearchSpeciesAsync(query);

    this.setState({
      isLoading: false,
      listOfSpecies,
    });
  }

  handleSearchGeneraAsyncTypeahead = async (query) => {
    this.setState({ isLoading: true });
    const { accessToken } = this.props;
    const genera = await genusFacade.getAllGeneraBySearchTerm(
      query, accessToken, (g) => ({
        id: g.id,
        label: g.name,
      }),
    );

    this.setState({
      isLoading: false,
      genera,
    });
  }

  handleSearchSpeciesAsync = async (query) => {
    const { accessToken } = this.props;
    return speciesFacade.getAllSpeciesBySearchTerm(
      query, accessToken, (l) => ({
        id: l.id,
        label: helperUtils.listOfSpeciesString(l),
      }),
    );
  };

  handleSynonymAddRow = async (selectedSpecies, synonymName, type) => {
    if (!selectedSpecies) {
      return undefined;
    }
    const { accessToken, recordId } = this.props;
    const newSynonym = await createNewSynonymToList(
      selectedSpecies,
      recordId,
      type,
      accessToken,
    );

    return this.setState((state) => {
      const {
        [synonymName]: synonyms,
      } = state;
      if (synonyms.find((s) => s.synonym.id === selectedSpecies.id)) {
        notifications.warning('The item already exists in the list');
        return undefined;
      }

      synonyms.push(newSynonym);

      const changedSynonyms = synonymsChanged(synonyms);

      return {
        [synonymName]: changedSynonyms,
      };
    });
  }

  handleSynonymRemoveRow = (rowId, synonymName) => (
    this.setState((state) => {
      const {
        [synonymName]: synonyms,
      } = state;
      const synonymsWithoutRemoved = synonyms.filter((_, i) => i !== rowId);

      const changedSynonyms = synonymsChanged(synonymsWithoutRemoved);
      return {
        [synonymName]: changedSynonyms,
      };
    })
  )

  handleChangeMisidentificationAuthor = (rowId, value) => (
    this.setState((state) => {
      const { misidentifications } = state;
      misidentifications[rowId].misidentificationAuthor = value;
      return {
        misidentifications,
      };
    })
  )

  handleSynonymTransition = (rowId, fromListName, toListName, newNumType) => (
    this.setState((state) => {
      const {
        [fromListName]: synonymsFrom,
        [toListName]: synonymsTo,
      } = state;
      const selected = synonymsFrom[rowId];
      selected.syntype = newNumType;
      // add selected to toList
      synonymsTo.push(selected);
      const synonymsToChanged = synonymsChanged(synonymsTo);

      const synonymsFromWORemoved = synonymsFrom.filter((s, i) => i !== rowId);
      const synonymsFromChanged = synonymsChanged(synonymsFromWORemoved);

      return {
        [fromListName]: synonymsFromChanged,
        [toListName]: synonymsToChanged,
      };
    })
  )

  submitForm = async (e) => {
    e.preventDefault();
    const { accessToken } = this.props;
    const {
      record,
      nomenclatoricSynonyms,
      taxonomicSynonyms,
      invalidDesignations,
      misidentifications,
    } = this.state;
    try {
      await speciesFacade.saveSpeciesAndSynonyms({
        species: record,
        nomenclatoricSynonyms,
        taxonomicSynonyms,
        invalidDesignations,
        misidentifications,
        accessToken,
      });
      notifications.success('Saved');
    } catch (error) {
      notifications.error('Error saving');
      throw error;
    }
  }

  renderHybridFields = (isHybrid) => {
    if (isHybrid) {
      const {
        record: {
          genusH, speciesH, subspH, varH, subvarH, formaH,
          nothosubspH, nothoformaH, authorsH,
        } = {},
      } = this.state;
      return (
        <Panel>
          <Panel.Body>
            <FormGroup controlId="genusH" bsSize="sm">
              <Col componentClass={ControlLabel} sm={LABEL_COL_WIDTH}>
                Hybrid Genus
              </Col>
              <Col sm={CONTENT_COL_WIDTH}>
                <FormControl
                  type="text"
                  value={genusH || ''}
                  onChange={this.handleChangeInput}
                  placeholder="Hybrid Genus"
                />
              </Col>
            </FormGroup>
            <FormGroup controlId="speciesH" bsSize="sm">
              <Col componentClass={ControlLabel} sm={LABEL_COL_WIDTH}>
                Hybrid Species
              </Col>
              <Col sm={CONTENT_COL_WIDTH}>
                <FormControl
                  type="text"
                  value={speciesH || ''}
                  onChange={this.handleChangeInput}
                  placeholder="Hybrid Species"
                />
              </Col>
            </FormGroup>
            <FormGroup controlId="subspH" bsSize="sm">
              <Col componentClass={ControlLabel} sm={LABEL_COL_WIDTH}>
                Hybrid Subsp
              </Col>
              <Col sm={CONTENT_COL_WIDTH}>
                <FormControl
                  type="text"
                  value={subspH || ''}
                  onChange={this.handleChangeInput}
                  placeholder="Hybrid Subsp"
                />
              </Col>
            </FormGroup>
            <FormGroup controlId="varH" bsSize="sm">
              <Col componentClass={ControlLabel} sm={LABEL_COL_WIDTH}>
                Hybrid Var
              </Col>
              <Col sm={CONTENT_COL_WIDTH}>
                <FormControl
                  type="text"
                  value={varH || ''}
                  onChange={this.handleChangeInput}
                  placeholder="Hybrid Var"
                />
              </Col>
            </FormGroup>
            <FormGroup controlId="subvarH" bsSize="sm">
              <Col componentClass={ControlLabel} sm={LABEL_COL_WIDTH}>
                Hybrid Subvar
              </Col>
              <Col sm={CONTENT_COL_WIDTH}>
                <FormControl
                  type="text"
                  value={subvarH || ''}
                  onChange={this.handleChangeInput}
                  placeholder="Hybrid Subvar"
                />
              </Col>
            </FormGroup>
            <FormGroup controlId="formaH" bsSize="sm">
              <Col componentClass={ControlLabel} sm={LABEL_COL_WIDTH}>
                Hybrid Forma
              </Col>
              <Col sm={CONTENT_COL_WIDTH}>
                <FormControl
                  type="text"
                  value={formaH || ''}
                  onChange={this.handleChangeInput}
                  placeholder="Hybrid Forma"
                />
              </Col>
            </FormGroup>
            <FormGroup controlId="nothosubspH" bsSize="sm">
              <Col componentClass={ControlLabel} sm={LABEL_COL_WIDTH}>
                Hybrid Nothosubsp
              </Col>
              <Col sm={CONTENT_COL_WIDTH}>
                <FormControl
                  type="text"
                  value={nothosubspH || ''}
                  onChange={this.handleChangeInput}
                  placeholder="Hybrid Nothosubsp"
                />
              </Col>
            </FormGroup>
            <FormGroup controlId="nothoformaH" bsSize="sm">
              <Col componentClass={ControlLabel} sm={LABEL_COL_WIDTH}>
                Hybrid Nothoforma
              </Col>
              <Col sm={CONTENT_COL_WIDTH}>
                <FormControl
                  type="text"
                  value={nothoformaH || ''}
                  onChange={this.handleChangeInput}
                  placeholder="Hybrid Nothoforma"
                />
              </Col>
            </FormGroup>
            <FormGroup controlId="authorsH" bsSize="sm">
              <Col componentClass={ControlLabel} sm={LABEL_COL_WIDTH}>
                Hybrid Authors
              </Col>
              <Col sm={CONTENT_COL_WIDTH}>
                <FormControl
                  type="text"
                  value={authorsH || ''}
                  onChange={this.handleChangeInput}
                  placeholder="Hybrid Authors"
                />
              </Col>
            </FormGroup>
          </Panel.Body>
        </Panel>
      );
    }
    return undefined;
  }

  render() {
    const {
      isLoading,
      familyApg, family, genera, record,
      listOfSpecies,
      nomenclatoricSynonyms, taxonomicSynonyms, invalidDesignations,
      misidentifications,
      basionymFor, replacedFor, nomenNovumFor,
      record: {
        id, ntype, genus, species, subsp, var: variety,
        subvar, forma, nothosubsp, nothoforma, proles, unranked, authors,
        hybrid, publication, vernacular, tribus,
      } = {},
    } = this.state;
    return (
      <div id="species-detail">
        <Grid id="functions-panel">
          <div id="functions">
            <Row>
              <Col md={2}>
                <LinkContainer to={CHECKLIST_LIST_URI}>
                  <Button bsStyle="default">Cancel</Button>
                </LinkContainer>
              </Col>
            </Row>
          </div>
        </Grid>
        <hr />
        <Grid>
          <h2>
            Checklist record
            <small>
              {id ? <LosName data={record} /> : 'new'}
            </small>
          </h2>

          <Form horizontal onSubmit={this.submitForm}>
            <div id="name">
              <h3>Name</h3>
              <Well>
                <FormGroup bsSize="sm">
                  <Col componentClass={ControlLabel} sm={LABEL_COL_WIDTH}>
                    <ControlLabel>Family APG</ControlLabel>
                  </Col>
                  <Col sm={CONTENT_COL_WIDTH}>
                    <FormControl.Static>{familyApg}</FormControl.Static>
                  </Col>
                </FormGroup>
                <FormGroup bsSize="sm">
                  <Col componentClass={ControlLabel} sm={LABEL_COL_WIDTH}>
                    <ControlLabel>Family</ControlLabel>
                  </Col>
                  <Col sm={CONTENT_COL_WIDTH}>
                    <FormControl.Static>{family}</FormControl.Static>
                  </Col>
                </FormGroup>
                <FormGroup controlId={ID_ACCEPTED_NAME_PROP} bsSize="sm">
                  <Col componentClass={ControlLabel} sm={LABEL_COL_WIDTH}>
                    Genus (reference)
                  </Col>
                  <Col sm={CONTENT_COL_WIDTH}>
                    <AsyncTypeahead
                      id={`${ID_GENUS_NAME_PROP}-autocomplete`}
                      isLoading={isLoading}
                      options={genera}
                      onSearch={this.handleSearchGeneraAsyncTypeahead}
                      selected={this.getSelectedTypeahead(ID_GENUS_NAME_PROP)}
                      onChange={(selected) => this.handleChangeGenusTypeahead(
                        selected, ID_GENUS_NAME_PROP,
                      )}
                      placeholder="Start by typing a genus present
                        in the database (case sensitive)"
                    />
                  </Col>
                </FormGroup>
              </Well>
              <Well>
                <FormGroup controlId="ntype" bsSize="sm">
                  <Col componentClass={ControlLabel} sm={LABEL_COL_WIDTH}>
                    Type
                  </Col>
                  <Col sm={CONTENT_COL_WIDTH}>
                    <FormControl
                      componentClass="select"
                      placeholder="select"
                      value={ntype}
                      onChange={this.handleChangeInput}
                    >
                      {
                        Object.keys(ntypes).map((t) => (
                          <option value={t} key={t}>{ntypes[t].text}</option>
                        ))
                      }
                    </FormControl>
                  </Col>
                </FormGroup>
                <FormGroup controlId="genus" bsSize="sm">
                  <Col componentClass={ControlLabel} sm={LABEL_COL_WIDTH}>
                    Genus (text)
                  </Col>
                  <Col sm={CONTENT_COL_WIDTH}>
                    <FormControl
                      type="text"
                      value={genus || ''}
                      onChange={this.handleChangeInput}
                      placeholder="Genus as text"
                    />
                  </Col>
                </FormGroup>
                <FormGroup controlId="species" bsSize="sm">
                  <Col componentClass={ControlLabel} sm={LABEL_COL_WIDTH}>
                    Species
                  </Col>
                  <Col sm={CONTENT_COL_WIDTH}>
                    <FormControl
                      type="text"
                      value={species || ''}
                      onChange={this.handleChangeInput}
                      placeholder="Species"
                    />
                  </Col>
                </FormGroup>
                <FormGroup controlId="subsp" bsSize="sm">
                  <Col componentClass={ControlLabel} sm={LABEL_COL_WIDTH}>
                    Subsp
                  </Col>
                  <Col sm={CONTENT_COL_WIDTH}>
                    <FormControl
                      type="text"
                      value={subsp || ''}
                      onChange={this.handleChangeInput}
                      placeholder="Subsp"
                    />
                  </Col>
                </FormGroup>
                <FormGroup controlId="var" bsSize="sm">
                  <Col componentClass={ControlLabel} sm={LABEL_COL_WIDTH}>
                    Var
                  </Col>
                  <Col sm={CONTENT_COL_WIDTH}>
                    <FormControl
                      type="text"
                      value={variety || ''}
                      onChange={this.handleChangeInput}
                      placeholder="Var"
                    />
                  </Col>
                </FormGroup>
                <FormGroup controlId="subvar" bsSize="sm">
                  <Col componentClass={ControlLabel} sm={LABEL_COL_WIDTH}>
                    Subvar
                  </Col>
                  <Col sm={CONTENT_COL_WIDTH}>
                    <FormControl
                      type="text"
                      value={subvar || ''}
                      onChange={this.handleChangeInput}
                      placeholder="Subvar"
                    />
                  </Col>
                </FormGroup>
                <FormGroup controlId="forma" bsSize="sm">
                  <Col componentClass={ControlLabel} sm={LABEL_COL_WIDTH}>
                    Forma
                  </Col>
                  <Col sm={CONTENT_COL_WIDTH}>
                    <FormControl
                      type="text"
                      value={forma || ''}
                      onChange={this.handleChangeInput}
                      placeholder="Forma"
                    />
                  </Col>
                </FormGroup>
                <FormGroup controlId="nothosubsp" bsSize="sm">
                  <Col componentClass={ControlLabel} sm={LABEL_COL_WIDTH}>
                    Nothosubsp
                  </Col>
                  <Col sm={CONTENT_COL_WIDTH}>
                    <FormControl
                      type="text"
                      value={nothosubsp || ''}
                      placeholder="Nothosubsp"
                      onChange={this.handleChangeInput}
                    />
                  </Col>
                </FormGroup>
                <FormGroup controlId="nothoforma" bsSize="sm">
                  <Col componentClass={ControlLabel} sm={LABEL_COL_WIDTH}>
                    Nothoforma
                  </Col>
                  <Col sm={CONTENT_COL_WIDTH}>
                    <FormControl
                      type="text"
                      value={nothoforma || ''}
                      placeholder="Nothoforma"
                      onChange={this.handleChangeInput}
                    />
                  </Col>
                </FormGroup>
                <FormGroup controlId="proles" bsSize="sm">
                  <Col componentClass={ControlLabel} sm={LABEL_COL_WIDTH}>
                    Proles
                  </Col>
                  <Col sm={CONTENT_COL_WIDTH}>
                    <FormControl
                      type="text"
                      value={proles || ''}
                      placeholder="Proles"
                      onChange={this.handleChangeInput}
                    />
                  </Col>
                </FormGroup>
                <FormGroup controlId="unranked" bsSize="sm">
                  <Col componentClass={ControlLabel} sm={LABEL_COL_WIDTH}>
                    Unranked
                  </Col>
                  <Col sm={CONTENT_COL_WIDTH}>
                    <FormControl
                      type="text"
                      value={unranked || ''}
                      placeholder="Unranked"
                      onChange={this.handleChangeInput}
                    />
                  </Col>
                </FormGroup>
                <FormGroup controlId="authors" bsSize="sm">
                  <Col componentClass={ControlLabel} sm={LABEL_COL_WIDTH}>
                    Authors
                  </Col>
                  <Col sm={CONTENT_COL_WIDTH}>
                    <FormControl
                      type="text"
                      value={authors || ''}
                      placeholder="Authors"
                      onChange={this.handleChangeInput}
                    />
                  </Col>
                </FormGroup>
                <FormGroup controlId="hybrid">
                  <Col
                    sm={CONTENT_COL_WIDTH}
                    smOffset={LABEL_COL_WIDTH}
                    xs={12}
                  >
                    <Checkbox
                      inline
                      id="hybrid"
                      value={hybrid || false}
                      checked={hybrid}
                      onChange={this.handleChangeCheckbox}
                    >
                      Hybrid
                    </Checkbox>
                  </Col>
                </FormGroup>
                {
                  this.renderHybridFields(hybrid)
                }
              </Well>
              <Well>
                <FormGroup controlId="publication" bsSize="sm">
                  <Col componentClass={ControlLabel} sm={LABEL_COL_WIDTH}>
                    Publication
                  </Col>
                  <Col sm={CONTENT_COL_WIDTH}>
                    <FormControl
                      type="text"
                      value={publication || ''}
                      placeholder="Publication"
                      onChange={this.handleChangeInput}
                    />
                  </Col>
                </FormGroup>
                <FormGroup controlId="vernacular" bsSize="sm">
                  <Col componentClass={ControlLabel} sm={LABEL_COL_WIDTH}>
                    Vernacular
                  </Col>
                  <Col sm={CONTENT_COL_WIDTH}>
                    <FormControl
                      type="text"
                      value={vernacular || ''}
                      placeholder="Vernacular"
                      onChange={this.handleChangeInput}
                    />
                  </Col>
                </FormGroup>
                <FormGroup controlId="tribus" bsSize="sm">
                  <Col componentClass={ControlLabel} sm={LABEL_COL_WIDTH}>
                    Tribus
                  </Col>
                  <Col sm={CONTENT_COL_WIDTH}>
                    <FormControl
                      type="text"
                      value={tribus || ''}
                      placeholder="Tribus"
                      onChange={this.handleChangeInput}
                    />
                  </Col>
                </FormGroup>
              </Well>
            </div>
            <div id="associations">
              <h3>Associations</h3>
              <Well>
                <FormGroup controlId={ID_ACCEPTED_NAME_PROP} bsSize="sm">
                  <Col componentClass={ControlLabel} sm={LABEL_COL_WIDTH}>
                    Accepted name
                  </Col>
                  <Col xs={CONTENT_COL_WIDTH}>
                    <AsyncTypeahead
                      id={`${ID_ACCEPTED_NAME_PROP}-autocomplete`}
                      isLoading={isLoading}
                      options={listOfSpecies}
                      onSearch={this.handleSearchSpeciesAsyncTypeahead}
                      selected={this.getSelectedTypeahead(
                        ID_ACCEPTED_NAME_PROP,
                      )}
                      onChange={(selected) => this.handleChangeTypeaheadSingle(
                        selected, ID_ACCEPTED_NAME_PROP,
                      )}
                      placeholder="Start by typing a species present
                        in the database (case sensitive)"
                    />
                  </Col>
                </FormGroup>
                <FormGroup controlId={ID_BASIONYM_NAME_PROP} bsSize="sm">
                  <Col componentClass={ControlLabel} sm={LABEL_COL_WIDTH}>
                    Basionym
                  </Col>
                  <Col xs={CONTENT_COL_WIDTH}>
                    <AsyncTypeahead
                      id={`${ID_BASIONYM_NAME_PROP}-autocomplete`}
                      isLoading={isLoading}
                      options={listOfSpecies}
                      onSearch={this.handleSearchSpeciesAsyncTypeahead}
                      selected={this.getSelectedTypeahead(
                        ID_BASIONYM_NAME_PROP,
                      )}
                      onChange={(selected) => this.handleChangeTypeaheadSingle(
                        selected, ID_BASIONYM_NAME_PROP,
                      )}
                      placeholder="Start by typing a species present
                        in the database (case sensitive)"
                    />
                  </Col>
                </FormGroup>
                <FormGroup controlId={ID_REPLACED_NAME_PROP} bsSize="sm">
                  <Col componentClass={ControlLabel} sm={LABEL_COL_WIDTH}>
                    Replaced name
                  </Col>
                  <Col xs={CONTENT_COL_WIDTH}>
                    <AsyncTypeahead
                      id={`${ID_REPLACED_NAME_PROP}-autocomplete`}
                      isLoading={isLoading}
                      options={listOfSpecies}
                      onSearch={this.handleSearchSpeciesAsyncTypeahead}
                      selected={this.getSelectedTypeahead(
                        ID_REPLACED_NAME_PROP,
                      )}
                      onChange={(selected) => this.handleChangeTypeaheadSingle(
                        selected, ID_REPLACED_NAME_PROP,
                      )}
                      placeholder="Start by typing a species present
                        in the database (case sensitive)"
                    />
                  </Col>
                </FormGroup>
                <FormGroup controlId={ID_NOMEN_NOVUM_NAME_PROP} bsSize="sm">
                  <Col componentClass={ControlLabel} sm={LABEL_COL_WIDTH}>
                    Nomen novum
                  </Col>
                  <Col xs={CONTENT_COL_WIDTH}>
                    <AsyncTypeahead
                      id={`${ID_NOMEN_NOVUM_NAME_PROP}-autocomplete`}
                      isLoading={isLoading}
                      options={listOfSpecies}
                      onSearch={this.handleSearchSpeciesAsyncTypeahead}
                      selected={this.getSelectedTypeahead(
                        ID_NOMEN_NOVUM_NAME_PROP,
                      )}
                      onChange={(selected) => this.handleChangeTypeaheadSingle(
                        selected, ID_NOMEN_NOVUM_NAME_PROP,
                      )}
                      placeholder="Start by typing a species present
                        in the database (case sensitive)"
                    />
                  </Col>
                </FormGroup>
              </Well>
            </div>
            <div id="synonyms">
              <h3>Synonyms</h3>
              <Well>
                <FormGroup controlId="nomenclatoric-synonyms" bsSize="sm">
                  <Col componentClass={ControlLabel} sm={LABEL_COL_WIDTH}>
                    Nomenclatoric Synonyms
                  </Col>
                  <Col xs={CONTENT_COL_WIDTH}>
                    <AddableList
                      id="nomenclatoric-synonyms-autocomplete"
                      async
                      data={nomenclatoricSynonyms}
                      onSearch={this.handleSearchSpeciesAsync}
                      onAddItemToList={(selected) => this.handleSynonymAddRow(
                        selected,
                        'nomenclatoricSynonyms',
                        config.mappings.synonym.nomenclatoric.numType,
                      )}
                      onRowDelete={(rowId) => this.handleSynonymRemoveRow(
                        rowId,
                        'nomenclatoricSynonyms',
                      )}
                      itemComponent={NomenclatoricSynonymListItem}
                      // props specific to itemComponent
                      onChangeToTaxonomic={(rowId) => (
                        this.handleSynonymTransition(
                          rowId,
                          'nomenclatoricSynonyms',
                          'taxonomicSynonyms',
                          config.mappings.synonym.taxonomic.numType,
                        ))}
                      onChangeToInvalid={(rowId) => (
                        this.handleSynonymTransition(
                          rowId,
                          'nomenclatoricSynonyms',
                          'invalidDesignations',
                          config.mappings.synonym.invalid.numType,
                        ))}
                    />
                  </Col>
                </FormGroup>
                <FormGroup controlId="taxonomic-synonyms" bsSize="sm">
                  <Col componentClass={ControlLabel} sm={LABEL_COL_WIDTH}>
                    Taxonomic Synonyms
                  </Col>
                  <Col xs={CONTENT_COL_WIDTH}>
                    <AddableList
                      id="taxonomic-synonyms-autocomplete"
                      async
                      data={taxonomicSynonyms}
                      onSearch={this.handleSearchSpeciesAsync}
                      onAddItemToList={(selected) => this.handleSynonymAddRow(
                        selected,
                        'taxonomicSynonyms',
                        config.mappings.synonym.taxonomic.numType,
                      )}
                      onRowDelete={(rowId) => this.handleSynonymRemoveRow(
                        rowId,
                        'taxonomicSynonyms',
                      )}
                      itemComponent={TaxonomicSynonymListItem}
                      // props specific to itemComponent
                      onChangeToNomenclatoric={(rowId) => (
                        this.handleSynonymTransition(
                          rowId,
                          'taxonomicSynonyms',
                          'nomenclatoricSynonyms',
                          config.mappings.synonym.nomenclatoric.numType,
                        ))}
                      onChangeToInvalid={(rowId) => (
                        this.handleSynonymTransition(
                          rowId,
                          'taxonomicSynonyms',
                          'invalidDesignations',
                          config.mappings.synonym.invalid.numType,
                        ))}
                    />
                  </Col>
                </FormGroup>
                <FormGroup controlId="invalid-designations" bsSize="sm">
                  <Col componentClass={ControlLabel} sm={LABEL_COL_WIDTH}>
                    Invalid Designations
                  </Col>
                  <Col xs={CONTENT_COL_WIDTH}>
                    <AddableList
                      id="invalid-designations"
                      async
                      data={invalidDesignations}
                      onAddItemToList={(selected) => this.handleSynonymAddRow(
                        selected,
                        'invalidDesignations',
                        config.mappings.synonym.invalid.numType,
                      )}
                      onRowDelete={(rowId) => this.handleSynonymRemoveRow(
                        rowId,
                        'invalidDesignations',
                      )}
                      onSearch={this.handleSearchSpeciesAsync}
                      itemComponent={InvalidSynonymListItem}
                      // props specific to itemComponent
                      onChangeToNomenclatoric={(rowId) => (
                        this.handleSynonymTransition(
                          rowId,
                          'invalidDesignations',
                          'nomenclatoricSynonyms',
                          config.mappings.synonym.nomenclatoric.numType,
                        ))}
                      onChangeToTaxonomic={(rowId) => (
                        this.handleSynonymTransition(
                          rowId,
                          'invalidDesignations',
                          'taxonomicSynonyms',
                          config.mappings.synonym.taxonomic.numType,
                        ))}
                    />
                  </Col>
                </FormGroup>
                <FormGroup controlId="misidentifications" bsSize="sm">
                  <Col componentClass={ControlLabel} sm={LABEL_COL_WIDTH}>
                    Misidentifications
                  </Col>
                  <Col xs={CONTENT_COL_WIDTH}>
                    <AddableList
                      id="misidentifications"
                      async
                      data={misidentifications}
                      onAddItemToList={(selected) => this.handleSynonymAddRow(
                        selected,
                        'misidentifications',
                        config.mappings.synonym.misidentification.numType,
                      )}
                      onRowDelete={(rowId) => this.handleSynonymRemoveRow(
                        rowId,
                        'misidentifications',
                      )}
                      itemComponent={MisidentifiedSynonymListItem}
                      onSearch={this.handleSearchSpeciesAsync}
                      // props specific to itemComponent
                      onChangeAuthor={this.handleChangeMisidentificationAuthor}
                    />
                  </Col>
                </FormGroup>
              </Well>
            </div>
            <div id="associations-inherited">
              <h3>Inherited associations</h3>
              <Well>
                <FormGroup controlId="idBasionymFor" bsSize="sm">
                  <Col componentClass={ControlLabel} sm={LABEL_COL_WIDTH}>
                    Basionym For
                  </Col>
                  <Col xs={CONTENT_COL_WIDTH}>
                    <PlainListOfSpeciesNames list={basionymFor} />
                  </Col>
                </FormGroup>
                <FormGroup controlId="idReplacedFor" bsSize="sm">
                  <Col componentClass={ControlLabel} sm={LABEL_COL_WIDTH}>
                    Replaced For
                  </Col>
                  <Col xs={CONTENT_COL_WIDTH}>
                    <PlainListOfSpeciesNames list={replacedFor} />
                  </Col>
                </FormGroup>
                <FormGroup controlId="idNomenNovumFor" bsSize="sm">
                  <Col componentClass={ControlLabel} sm={LABEL_COL_WIDTH}>
                    Nomen Novum For
                  </Col>
                  <Col xs={CONTENT_COL_WIDTH}>
                    <PlainListOfSpeciesNames list={nomenNovumFor} />
                  </Col>
                </FormGroup>
              </Well>
            </div>
            <div id="controls">
              <Row>
                <Col sm={5} smOffset={2}>
                  <LinkContainer to={CHECKLIST_LIST_URI}>
                    <Button bsStyle="default">Cancel</Button>
                  </LinkContainer>
                </Col>
                <Col sm={5}>
                  <Button bsStyle="primary" type="submit">Save</Button>
                </Col>
              </Row>
            </div>
          </Form>
        </Grid>
        <NotificationContainer />
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  accessToken: state.authentication.accessToken,
});

export default connect(mapStateToProps)(SpeciesRecord);

SpeciesRecord.propTypes = {
  accessToken: PropTypes.string.isRequired,
  recordId: PropTypes.string,
};

SpeciesRecord.defaultProps = {
  recordId: undefined,
};
