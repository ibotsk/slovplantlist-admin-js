import React, { Component } from 'react';
import { connect } from 'react-redux';

import {
  Grid, Col, Row, Well, Panel,
  Form, FormControl, FormGroup, ControlLabel,
  ListGroup, ListGroupItem,
  Checkbox, Button, Glyphicon,
} from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { AsyncTypeahead } from 'react-bootstrap-typeahead';

import PropTypes from 'prop-types';

import { NotificationContainer } from 'react-notifications';

import AddableList from 'components/segments/AddableList';
import LosName from 'components/segments/LosName';
import SynonymListItem from 'components/segments/SynonymListItem';

import { speciesFacade, genusFacade } from 'facades';

import { notifications, helperUtils } from 'utils';
import config from 'config/config';

import 'styles/custom.css';

const LABEL_COL_WIDTH = 2;
const CONTENT_COL_WIDTH = 10;

const ID_GENUS_NAME_PROP = 'id_genus';
const ID_ACCEPTED_NAME_PROP = 'id_accepted_name';
const ID_BASIONYM_NAME_PROP = 'id_basionym';
const ID_REPLACED_NAME_PROP = 'id_replaced';
const ID_NOMEN_NOVUM_NAME_PROP = 'id_nomen_novum';

const CHECKLIST_LIST_URI = '/checklist';

const ntypes = config.mappings.losType;

const synonymFormatter = (synonym, prefix) => (
  {
    id: synonym.id,
    prefix,
    value: synonym,
  }
);

const recordInitialValues = {
  authors: '',
  authors_h: '',
  forma: '',
  forma_h: '',
  genus: '',
  genus_h: '',
  hybrid: false,
  id: undefined,
  id_accepted_name: undefined,
  id_basionym: undefined,
  id_genus: undefined,
  id_nomen_novum: undefined,
  id_replaced: undefined,
  is_basionym: false,
  is_isonym: false,
  notes: '',
  nothoforma: '',
  nothoforma_h: '',
  nothosubsp: '',
  nothosubsp_h: '',
  ntype: 'A',
  ntype_order: 8,
  publication: '',
  species: '',
  species_h: '',
  subsp: '',
  subsp_h: '',
  subvar: '',
  subvar_h: '',
  syn_type: undefined,
  tribus: '',
  var: '',
  var_h: '',
  vernacular: '',
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

      nomenclatoricSynonyms: [], // contains objects of list-of-species
      taxonomicSynonyms: [], // contains objects of list-of-species
      invalidDesignations: [],

      isNomenclatoricSynonymsChanged: false,
      isTaxonomicSynonymsChanged: false,
      isInvalidDesignationsChanged: false,

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
      } = await speciesFacade.getRecordById({ id: recordId, accessToken });

      const {
        nomenclatoricSynonyms, taxonomicSynonyms, invalidDesignations,
      } = await speciesFacade.getSynonyms({ id: recordId, accessToken });
      const {
        basionymFor, replacedFor, nomenNovumFor,
      } = await speciesFacade.getBasionymsFor({ id: recordId, accessToken });

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

  handleChange = (property, value) => this.setState((state) => {
    const { record } = state;
    record[property] = value;
    return record;
  });

  getSelectedTypeahead = (id) => {
    const { [`${id}Selected`]: selectedTypeahead } = this.state;
    return selectedTypeahead;
  }

  handleChangeGenusTypeahead = async (selected, prop) => {
    const { accessToken } = this.props;
    const id = selected[0] ? selected[0].id : undefined;
    if (id) {
      const { family, familyApg } = await genusFacade.getGenusByIdWithFamilies({
        id,
        accessToken,
      });
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
    const genera = await genusFacade.getAllGeneraBySearchTerm({
      term: query,
      format: (g) => ({
        id: g.id,
        label: g.name,
      }),
      accessToken,
    });

    this.setState({
      isLoading: false,
      genera,
    });
  }

  handleSearchSpeciesAsync = async (query) => {
    const { accessToken } = this.props;
    return speciesFacade.getAllSpeciesBySearchTerm({
      term: query,
      format: (l) => ({
        id: l.id,
        label: helperUtils.listOfSpeciesString(l),
      }),
      accessToken,
    });
  };

  handleAddNomenclatoricSynonym = async (selected) => (
    this.setState(async (state) => {
      const { nomenclatoricSynonyms } = state;
      const nomenclatoricSynonymsNew = await this.addSynonymToList(
        selected, nomenclatoricSynonyms,
      );
      return {
        nomenclatoricSynonyms: nomenclatoricSynonymsNew,
        isNomenclatoricSynonymsChanged: true,
      };
    })
  );

  handleAddTaxonomicSynonym = async (selected) => (
    this.setState(async (state) => {
      const { taxonomicSynonyms } = state;
      const taxonomicSynonymsNew = await this.addSynonymToList(
        selected, taxonomicSynonyms,
      );
      return {
        taxonomicSynonyms: taxonomicSynonymsNew,
        isTaxonomicSynonymsChanged: true,
      };
    })
  );

  handleAddInvalidDesignation = async (selected) => (
    this.setState(async (state) => {
      const { invalidDesignations } = state;
      const invalidDesignationsNew = await this.addSynonymToList(
        selected, invalidDesignations,
      );
      return {
        invalidDesignations: invalidDesignationsNew,
        isInvalidDesignationsChanged: true,
      };
    })
  );

  handleRemoveNomenclatoricSynonym = (id) => (
    this.setState((state) => {
      const { nomenclatoricSynonyms } = state;
      const nomenclatoricSynonymsFiltered = nomenclatoricSynonyms
        .filter((s) => s.id !== id);

      return {
        nomenclatoricSynonyms: nomenclatoricSynonymsFiltered,
        isNomenclatoricSynonymsChanged: true,
      };
    })
  );

  handleRemoveTaxonomicSynonym = (id) => (
    this.setState((state) => {
      const { taxonomicSynonyms } = state;
      const taxonomicSynonymsFiltered = taxonomicSynonyms
        .filter((s) => s.id !== id);

      return {
        taxonomicSynonyms: taxonomicSynonymsFiltered,
        isTaxonomicSynonymsChanged: true,
      };
    })
  );

  handleRemoveInvalidDesignation = (id) => (
    this.setState((state) => {
      const { invalidDesignations } = state;
      const invalidDesignationsFiltered = invalidDesignations
        .filter((s) => s.id !== id);

      return {
        invalidDesignations: invalidDesignationsFiltered,
        isInvalidDesignationsChanged: true,
      };
    })
  );

  handleChangeToTaxonomic = async (id, fromList) => {
    // const selected = this.state.nomenclatoricSynonyms.find(s => s.id === id);
    const selected = fromList.find((s) => s.id === id);
    await this.handleAddTaxonomicSynonym(selected);
    // remove from all others
    await this.handleRemoveNomenclatoricSynonym(id);
    await this.handleRemoveInvalidDesignation(id);
  }

  handleChangeToNomenclatoric = async (id, fromList) => {
    const selected = fromList.find((s) => s.id === id);
    await this.handleAddNomenclatoricSynonym(selected);
    // remove from all others
    await this.handleRemoveTaxonomicSynonym(id);
    await this.handleRemoveInvalidDesignation(id);
  }

  handleChangeToInvalid = async (id, fromList) => {
    const selected = fromList.find((s) => s.id === id);
    await this.handleAddInvalidDesignation(selected);
    // remove from all others
    await this.handleRemoveNomenclatoricSynonym(id);
    await this.handleRemoveTaxonomicSynonym(id);
  }

  renderPlainListOfSpeciesNames = (list) => {
    if (!list || list.length === 0) {
      return <ListGroupItem />;
    }
    return (
      <ListGroup>
        {list.map((b) => (
          <ListGroupItem key={b.id}>
            <LosName data={b} />
          </ListGroupItem>
        ))}
      </ListGroup>
    );
  }

  addSynonymToList = async (selected, synonyms) => {
    if (!selected) {
      return null;
    }
    if (synonyms.find((s) => s.id === selected.id)) {
      notifications.warning('The item is already in the list');
      return null;
    }
    const { accessToken } = this.props;

    const { speciesRecord } = await speciesFacade.getRecordById({
      id: selected.id,
      accessToken,
    });

    synonyms.push(speciesRecord);
    synonyms.sort(helperUtils.listOfSpeciesSorterLex);
    return synonyms;
  }

  NomenclatoricSynonymListItem = ({ rowId, ...props }) => {
    const nomenclatoricSynonyms = this.state;
    const Additions = () => (
      <>
        <Button
          bsStyle="primary"
          bsSize="xsmall"
          onClick={() => this.handleChangeToTaxonomic(
            rowId, nomenclatoricSynonyms,
          )}
          title="Change to taxonomic synonym"
        >
          <Glyphicon glyph="share-alt" />
          {' '}
          {config.mappings.synonym.taxonomic.prefix}
        </Button>
                &nbsp;
        <Button
          bsStyle="primary"
          bsSize="xsmall"
          onClick={() => this.handleChangeToInvalid(
            rowId, nomenclatoricSynonyms,
          )}
          title="Change to invalid designation"
        >
          <Glyphicon glyph="share-alt" />
          {' '}
          {config.mappings.synonym.invalid.prefix}
        </Button>
      </>
    );
    return (
      <SynonymListItem {...props} additions={Additions} removable />
    );
  }

  TaxonomicSynonymListItem = ({ rowId, ...props }) => {
    const { taxonomicSynonyms } = this.state;
    const Additions = () => (
      <>
        <Button
          bsStyle="primary"
          bsSize="xsmall"
          onClick={() => this.handleChangeToNomenclatoric(
            rowId, taxonomicSynonyms,
          )}
          title="Change to nomenclatoric synonym"
        >
          <Glyphicon glyph="share-alt" />
          {' '}
          {config.mappings.synonym.nomenclatoric.prefix}
        </Button>
                &nbsp;
        <Button
          bsStyle="primary"
          bsSize="xsmall"
          onClick={() => this.handleChangeToInvalid(
            rowId, taxonomicSynonyms,
          )}
          title="Change to invalid designation"
        >
          <Glyphicon glyph="share-alt" />
          {' '}
          {config.mappings.synonym.invalid.prefix}
        </Button>
      </>
    );
    return (
      <SynonymListItem {...props} additions={Additions} removable />
    );
  }

  InvalidSynonymListItem = ({ rowId, ...props }) => {
    const { invalidDesignations } = this.state;
    const Additions = () => (
      <>
        <Button
          bsStyle="primary"
          bsSize="xsmall"
          onClick={() => this.handleChangeToNomenclatoric(
            rowId, invalidDesignations,
          )}
          title="Change to nomenclatoric synonym"
        >
          <Glyphicon glyph="share-alt" />
          {' '}
          {config.mappings.synonym.nomenclatoric.prefix}
        </Button>
                &nbsp;
        <Button
          bsStyle="primary"
          bsSize="xsmall"
          onClick={() => this.handleChangeToTaxonomic(
            rowId, invalidDesignations,
          )}
          title="Change to taxonomic synonym"
        >
          <Glyphicon glyph="share-alt" />
          {' '}
          {config.mappings.synonym.taxonomic.prefix}
        </Button>
      </>
    );
    return (
      <SynonymListItem {...props} additions={Additions} removable />
    );
  }

  submitForm = async (e) => {
    e.preventDefault();
    const { accessToken } = this.props;
    const {
      record,
      nomenclatoricSynonyms,
      taxonomicSynonyms,
      invalidDesignations,
      isNomenclatoricSynonymsChanged,
      isTaxonomicSynonymsChanged,
      isInvalidDesignationsChanged,
    } = this.state;
    try {
      await speciesFacade.saveSpeciesAndSynonyms({
        species: record,
        nomenclatoricSynonyms,
        taxonomicSynonyms,
        invalidDesignations,
        accessToken,
        isNomenclatoricSynonymsChanged,
        isTaxonomicSynonymsChanged,
        isInvalidDesignationsChanged,
      });
      notifications.success('Saved');

      this.setState({
        isNomenclatoricSynonymsChanged: false,
        isTaxonomicSynonymsChanged: false,
        isInvalidDesignationsChanged: false,
      });
    } catch (error) {
      notifications.error('Error saving');
      throw error;
    }
  }

  renderHybridFields = (isHybrid) => {
    if (isHybrid) {
      const {
        record: {
          genus_h: genusH, species_h: speciesH, subsp_h: subspH,
          var_h: varH, subvar_h: subvarH, forma_h: formaH,
          nothosubsp_h: nothosubspH, nothoforma_h: nothoformaH,
          authors_h: authorsH,
        } = {},
      } = this.state;
      return (
        <Panel>
          <Panel.Body>
            <FormGroup controlId="genus_h" bsSize="sm">
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
            <FormGroup controlId="species_h" bsSize="sm">
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
            <FormGroup controlId="subsp_h" bsSize="sm">
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
            <FormGroup controlId="var_h" bsSize="sm">
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
            <FormGroup controlId="subvar_h" bsSize="sm">
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
            <FormGroup controlId="forma_h" bsSize="sm">
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
            <FormGroup controlId="nothosubsp_h" bsSize="sm">
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
            <FormGroup controlId="nothoforma_h" bsSize="sm">
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
            <FormGroup controlId="authors_h" bsSize="sm">
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
      basionymFor, replacedFor, nomenNovumFor,
      record: {
        id, ntype, genus, species, subsp, var: variety,
        subvar, forma, nothosubsp, nothoforma, authors,
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
                      data={nomenclatoricSynonyms.map((s) => (
                        synonymFormatter(
                          s, config.mappings.synonym.nomenclatoric.prefix,
                        )))}
                      options={listOfSpecies}
                      onAddItemToList={this.handleAddNomenclatoricSynonym}
                      onRowDelete={this.handleRemoveNomenclatoricSynonym}
                      onSearch={this.handleSearchSpeciesAsync}
                      itemComponent={this.NomenclatoricSynonymListItem}
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
                      data={taxonomicSynonyms.map((s) => synonymFormatter(
                        s, config.mappings.synonym.taxonomic.prefix,
                      ))}
                      options={listOfSpecies}
                      onAddItemToList={this.handleAddTaxonomicSynonym}
                      onRowDelete={this.handleRemoveTaxonomicSynonym}
                      onSearch={this.handleSearchSpeciesAsync}
                      itemComponent={this.TaxonomicSynonymListItem}
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
                      data={invalidDesignations.map((s) => (
                        synonymFormatter(
                          s, config.mappings.synonym.invalid.prefix,
                        )
                      ))}
                      options={listOfSpecies}
                      onAddItemToList={this.handleAddInvalidDesignation}
                      onRowDelete={this.handleRemoveInvalidDesignation}
                      onSearch={this.handleSearchSpeciesAsync}
                      itemComponent={this.InvalidSynonymListItem}
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
                    {this.renderPlainListOfSpeciesNames(basionymFor)}
                  </Col>
                </FormGroup>
                <FormGroup controlId="idReplacedFor" bsSize="sm">
                  <Col componentClass={ControlLabel} sm={LABEL_COL_WIDTH}>
                    Replaced For
                  </Col>
                  <Col xs={CONTENT_COL_WIDTH}>
                    {this.renderPlainListOfSpeciesNames(replacedFor)}
                  </Col>
                </FormGroup>
                <FormGroup controlId="idNomenNovumFor" bsSize="sm">
                  <Col componentClass={ControlLabel} sm={LABEL_COL_WIDTH}>
                    Nomen Novum For
                  </Col>
                  <Col xs={CONTENT_COL_WIDTH}>
                    {this.renderPlainListOfSpeciesNames(nomenNovumFor)}
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
