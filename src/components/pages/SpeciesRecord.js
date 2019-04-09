import React, { Component } from 'react';

import {
    Grid, Col, Row, Well, Panel,
    Form, FormControl, FormGroup, ControlLabel,
    ListGroup, ListGroupItem,
    Checkbox, Button, Glyphicon
} from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { AsyncTypeahead } from 'react-bootstrap-typeahead';

import { NotificationContainer } from 'react-notifications';
import notifications from '../../utils/notifications';

import AddableList from '../segments/AddableList';
import LosName from '../segments/LosName';
import SynonymListItem from '../segments/SynonymListItem';

import speciesFacade from '../../facades/species';

import helper from '../../utils/helper';
import config from '../../config/config';

import '../../styles/custom.css';

const LABEL_COL_WIDTH = 2;
const CONTENT_COL_WIDTH = 10;

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
        value: synonym
    }
);

const addSynonymToList = async (selected, synonyms, accessToken) => {
    if (!selected) {
        return null;
    }
    if (synonyms.find(s => s.id === selected.id)) {
        notifications.warning('The item is already in the list');
        return null;
    }
    const { speciesRecord } = await speciesFacade.getRecordById(selected.id);

    synonyms.push(speciesRecord);
    synonyms.sort(helper.listOfSpeciesSorterLex);
    return synonyms;
}

class SpeciesRecord extends Component {

    constructor(props) {
        super(props);

        this.state = {
            record: {},
            listOfSpecies: [],
            isLoading: false,
            [`${ID_ACCEPTED_NAME_PROP}_selected`]: undefined,
            [`${ID_BASIONYM_NAME_PROP}_selected`]: undefined,
            [`${ID_REPLACED_NAME_PROP}_selected`]: undefined,
            [`${ID_NOMEN_NOVUM_NAME_PROP}_selected`]: undefined,

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

    handleChangeInput = e => {
        this.handleChange(e.target.id, e.target.value);
    }

    handleChangeCheckbox = e => {
        this.handleChange(e.target.id, e.target.checked);
    }

    handleChange = (property, value) => {
        const record = { ...this.state.record };
        record[property] = value;
        this.setState({
            record
        });
    }

    getSelectedName = id => {
        return this.state[`${id}_selected`];
    }

    handleChangeTypeaheadSingle = (selected, prop) => {
        const id = selected[0] ? selected[0].id : undefined;
        const propSelected = `${prop}_selected`;
        this.setState({
            [propSelected]: selected
        });
        this.handleChange(prop, id);
    }

    handleSearchSpeciesAsyncTypeahead = async query => {
        this.setState({ isLoading: true });
        const listOfSpecies = await this.handleSearchAsync(query);

        this.setState({
            isLoading: false,
            listOfSpecies,
        });
    }

    handleSearchAsync = async query => {
        return await speciesFacade.getAllSpeciesBySearchTerm(query, l => ({
            id: l.id,
            label: helper.listOfSpeciesString(l)
        }));
    }

    handleAddNomenclatoricSynonym = async selected => {
        const accessToken = this.props.accessToken;
        const nomenclatoricSynonyms = await addSynonymToList(selected, [...this.state.nomenclatoricSynonyms], accessToken);
        this.setState({
            nomenclatoricSynonyms,
            isNomenclatoricSynonymsChanged: true
        });
    }

    handleAddTaxonomicSynonym = async selected => {
        const accessToken = this.props.accessToken;
        const taxonomicSynonyms = await addSynonymToList(selected, [...this.state.taxonomicSynonyms], accessToken);
        this.setState({
            taxonomicSynonyms,
            isTaxonomicSynonymsChanged: true
        });
    }

    handleAddInvalidDesignation = async selected => {
        const accessToken = this.props.accessToken;
        const invalidDesignations = await addSynonymToList(selected, [...this.state.invalidDesignations], accessToken);
        this.setState({
            invalidDesignations,
            isInvalidDesignationsChanged: true
        });
    }

    handleRemoveNomenclatoricSynonym = id => {
        const nomenclatoricSynonyms = this.state.nomenclatoricSynonyms.filter(s => s.id !== id);
        this.setState({
            nomenclatoricSynonyms,
            isNomenclatoricSynonymsChanged: true
        });
    }

    handleRemoveTaxonomicSynonym = id => {
        const taxonomicSynonyms = this.state.taxonomicSynonyms.filter(s => s.id !== id);
        this.setState({
            taxonomicSynonyms,
            isTaxonomicSynonymsChanged: true
        });
    }

    handleRemoveInvalidDesignation = id => {
        const invalidDesignations = this.state.invalidDesignations.filter(s => s.id !== id);
        this.setState({
            invalidDesignations,
            isInvalidDesignationsChanged: true
        });
    }

    handleChangeToTaxonomic = async (id, fromList) => {
        // const selected = this.state.nomenclatoricSynonyms.find(s => s.id === id);
        const selected = fromList.find(s => s.id === id);
        await this.handleAddTaxonomicSynonym(selected);
        // remove from all others
        await this.handleRemoveNomenclatoricSynonym(id);
        await this.handleRemoveInvalidDesignation(id);
    }

    handleChangeToNomenclatoric = async (id, fromList) => {
        const selected = fromList.find(s => s.id === id);
        await this.handleAddNomenclatoricSynonym(selected);
        // remove from all others
        await this.handleRemoveTaxonomicSynonym(id);
        await this.handleRemoveInvalidDesignation(id);
    }

    handleChangeToInvalid = async (id, fromList) => {
        const selected = fromList.find(s => s.id === id);
        await this.handleAddInvalidDesignation(selected);
        //remove from all others
        await this.handleRemoveNomenclatoricSynonym(id);
        await this.handleRemoveTaxonomicSynonym(id);
    }

    renderPlainListOfSpeciesNames = list => {
        if (!list || list.length === 0) {
            return <ListGroupItem />
        }
        return (
            <ListGroup>
                {list.map(b =>
                    <ListGroupItem key={b.id}>
                        <LosName data={b} />
                    </ListGroupItem>)}
            </ListGroup>
        )
    }

    NomenclatoricSynonymListItem = ({ rowId, ...props }) => {
        const fromList = this.state.nomenclatoricSynonyms;
        const Additions = () => (
            <React.Fragment>
                <Button bsStyle="primary" bsSize="xsmall" onClick={() => this.handleChangeToTaxonomic(rowId, fromList)} title="Change to taxonomic synonym"><Glyphicon glyph="share-alt" /> {config.mappings.synonym.taxonomic.prefix}</Button>
                &nbsp;
                <Button bsStyle="primary" bsSize="xsmall" onClick={() => this.handleChangeToInvalid(rowId, fromList)} title="Change to invalid designation"><Glyphicon glyph="share-alt" /> {config.mappings.synonym.invalid.prefix}</Button>
            </React.Fragment>
        );
        return (
            <SynonymListItem {...props} additions={Additions} />
        );
    }

    TaxonomicSynonymListItem = ({ rowId, ...props }) => {
        const fromList = this.state.taxonomicSynonyms;
        const Additions = p => (
            <React.Fragment>
                <Button bsStyle="primary" bsSize="xsmall" onClick={() => this.handleChangeToNomenclatoric(rowId, fromList)} title="Change to nomenclatoric synonym"><Glyphicon glyph="share-alt" /> {config.mappings.synonym.nomenclatoric.prefix}</Button>
                &nbsp;
                <Button bsStyle="primary" bsSize="xsmall" onClick={() => this.handleChangeToInvalid(rowId, fromList)} title="Change to invalid designation"><Glyphicon glyph="share-alt" /> {config.mappings.synonym.invalid.prefix}</Button>
            </React.Fragment>
        );
        return (
            <SynonymListItem {...props} additions={Additions} />
        );
    }

    InvalidSynonymListItem = ({ rowId, ...props }) => {
        const fromList = this.state.invalidDesignations;
        const Additions = p => (
            <React.Fragment>
                <Button bsStyle="primary" bsSize="xsmall" onClick={() => this.handleChangeToNomenclatoric(rowId, fromList)} title="Change to nomenclatoric synonym"><Glyphicon glyph="share-alt" /> {config.mappings.synonym.nomenclatoric.prefix}</Button>
                &nbsp;
                <Button bsStyle="primary" bsSize="xsmall" onClick={() => this.handleChangeToTaxonomic(rowId, fromList)} title="Change to taxonomic synonym"><Glyphicon glyph="share-alt" /> {config.mappings.synonym.taxonomic.prefix}</Button>
            </React.Fragment>
        );
        return (
            <SynonymListItem {...props} additions={Additions} />
        );
    }

    submitForm = async e => {
        e.preventDefault();
        try {
            await speciesFacade.saveSpeciesAndSynonyms({
                species: this.state.record,
                nomenclatoricSynonyms: this.state.nomenclatoricSynonyms,
                taxonomicSynonyms: this.state.taxonomicSynonyms,
                invalidDesignations: this.state.invalidDesignations,
                isNomenclatoricSynonymsChanged: this.state.isNomenclatoricSynonymsChanged,
                isTaxonomicSynonymsChanged: this.state.isTaxonomicSynonymsChanged,
                isInvalidDesignationsChanged: this.state.isInvalidDesignationsChanged
            });
            notifications.success('Saved');

            this.setState({
                isNomenclatoricSynonymsChanged: false,
                isTaxonomicSynonymsChanged: false,
                isInvalidDesignationsChanged: false
            });
        } catch (error) {
            notifications.error('Error saving');
            throw error;
        }
    }

    async componentDidMount() {
        const recordId = this.props.match.params.id;
        const { speciesRecord, accepted, basionym, replaced, nomenNovum } = await speciesFacade.getRecordById(recordId);

        const { nomenclatoricSynonyms, taxonomicSynonyms, invalidDesignations } = await speciesFacade.getSynonyms(recordId);
        const { basionymFor, replacedFor, nomenNovumFor } = await speciesFacade.getBasionymsFor(recordId);

        this.setState({
            record: speciesRecord,
            [`${ID_ACCEPTED_NAME_PROP}_selected`]: accepted,
            [`${ID_BASIONYM_NAME_PROP}_selected`]: basionym,
            [`${ID_REPLACED_NAME_PROP}_selected`]: replaced,
            [`${ID_NOMEN_NOVUM_NAME_PROP}_selected`]: nomenNovum,
            nomenclatoricSynonyms,
            taxonomicSynonyms,
            invalidDesignations,
            basionymFor,
            replacedFor,
            nomenNovumFor
        });
    }

    renderHybridFields = isHybrid => {
        if (isHybrid) {
            return (
                <Panel>
                    <Panel.Body>
                        <FormGroup controlId="genus_h" bsSize='sm'>
                            <Col componentClass={ControlLabel} sm={LABEL_COL_WIDTH}>
                                Hybrid Genus
                            </Col>
                            <Col sm={CONTENT_COL_WIDTH}>
                                <FormControl
                                    type="text"
                                    value={this.state.record.genus_h || ''}
                                    onChange={this.handleChangeInput}
                                    placeholder="Hybrid Genus"
                                />
                            </Col>
                        </FormGroup>
                        <FormGroup controlId="species_h" bsSize='sm'>
                            <Col componentClass={ControlLabel} sm={LABEL_COL_WIDTH}>
                                Hybrid Species
                            </Col>
                            <Col sm={CONTENT_COL_WIDTH}>
                                <FormControl
                                    type="text"
                                    value={this.state.record.species_h || ''}
                                    onChange={this.handleChangeInput}
                                    placeholder="Hybrid Species"
                                />
                            </Col>
                        </FormGroup>
                        <FormGroup controlId="subsp_h" bsSize='sm'>
                            <Col componentClass={ControlLabel} sm={LABEL_COL_WIDTH}>
                                Hybrid Subsp
                            </Col>
                            <Col sm={CONTENT_COL_WIDTH}>
                                <FormControl
                                    type="text"
                                    value={this.state.record.subsp_h || ''}
                                    onChange={this.handleChangeInput}
                                    placeholder="Hybrid Subsp"
                                />
                            </Col>
                        </FormGroup>
                        <FormGroup controlId="var_h" bsSize='sm'>
                            <Col componentClass={ControlLabel} sm={LABEL_COL_WIDTH}>
                                Hybrid Var
                            </Col>
                            <Col sm={CONTENT_COL_WIDTH}>
                                <FormControl
                                    type="text"
                                    value={this.state.record.var_h || ''}
                                    onChange={this.handleChangeInput}
                                    placeholder="Hybrid Var"
                                />
                            </Col>
                        </FormGroup>
                        <FormGroup controlId="subvar_h" bsSize='sm'>
                            <Col componentClass={ControlLabel} sm={LABEL_COL_WIDTH}>
                                Hybrid Subvar
                            </Col>
                            <Col sm={CONTENT_COL_WIDTH}>
                                <FormControl
                                    type="text"
                                    value={this.state.record.subvar_h || ''}
                                    onChange={this.handleChangeInput}
                                    placeholder="Hybrid Subvar"
                                />
                            </Col>
                        </FormGroup>
                        <FormGroup controlId="forma_h" bsSize='sm'>
                            <Col componentClass={ControlLabel} sm={LABEL_COL_WIDTH}>
                                Hybrid Forma
                            </Col>
                            <Col sm={CONTENT_COL_WIDTH}>
                                <FormControl
                                    type="text"
                                    value={this.state.record.forma_h || ''}
                                    onChange={this.handleChangeInput}
                                    placeholder="Hybrid Forma"
                                />
                            </Col>
                        </FormGroup>
                        <FormGroup controlId="nothosubsp_h" bsSize='sm'>
                            <Col componentClass={ControlLabel} sm={LABEL_COL_WIDTH}>
                                Hybrid Nothosubsp
                            </Col>
                            <Col sm={CONTENT_COL_WIDTH}>
                                <FormControl
                                    type="text"
                                    value={this.state.record.nothosubsp_h || ''}
                                    onChange={this.handleChangeInput}
                                    placeholder="Hybrid Nothosubsp"
                                />
                            </Col>
                        </FormGroup>
                        <FormGroup controlId="nothoforma_h" bsSize='sm'>
                            <Col componentClass={ControlLabel} sm={LABEL_COL_WIDTH}>
                                Hybrid Nothoforma
                            </Col>
                            <Col sm={CONTENT_COL_WIDTH}>
                                <FormControl
                                    type="text"
                                    value={this.state.record.nothoforma_h || ''}
                                    onChange={this.handleChangeInput}
                                    placeholder="Hybrid Nothoforma"
                                />
                            </Col>
                        </FormGroup>
                        <FormGroup controlId="authors_h" bsSize='sm'>
                            <Col componentClass={ControlLabel} sm={LABEL_COL_WIDTH}>
                                Hybrid Authors
                            </Col>
                            <Col sm={CONTENT_COL_WIDTH}>
                                <FormControl
                                    type="text"
                                    value={this.state.record.authors_h || ''}
                                    onChange={this.handleChangeInput}
                                    placeholder="Hybrid Authors"
                                />
                            </Col>
                        </FormGroup>
                    </Panel.Body>
                </Panel>
            )
        }
    }

    render() {
        return (
            <div id='species-detail'>
                <Grid>
                    <h2>Checklist record <small>({this.state.record ? <LosName data={this.state.record} /> : 'new'})</small></h2>

                    <Form horizontal onSubmit={this.submitForm}>
                        <div id="name">
                            <h3>Name</h3>
                            <Well>
                                <FormGroup controlId="ntype" bsSize='sm'>
                                    <Col componentClass={ControlLabel} sm={LABEL_COL_WIDTH}>
                                        Type
                                    </Col>
                                    <Col sm={CONTENT_COL_WIDTH}>
                                        <FormControl
                                            componentClass="select"
                                            placeholder="select"
                                            value={this.state.record.ntype}
                                            onChange={this.handleChangeInput} >
                                            {
                                                Object.keys(ntypes).map(t => <option value={t} key={t}>{ntypes[t].text}</option>)
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
                                            value={this.state.record.genus || ''}
                                            onChange={this.handleChangeInput}
                                            placeholder="Genus as text" />
                                    </Col>
                                </FormGroup>
                                <FormGroup controlId="species" bsSize="sm">
                                    <Col componentClass={ControlLabel} sm={LABEL_COL_WIDTH}>
                                        Species
                                    </Col>
                                    <Col sm={CONTENT_COL_WIDTH}>
                                        <FormControl
                                            type="text"
                                            value={this.state.record.species || ''}
                                            onChange={this.handleChangeInput}
                                            placeholder="Species" />
                                    </Col>
                                </FormGroup>
                                <FormGroup controlId="subsp" bsSize='sm'>
                                    <Col componentClass={ControlLabel} sm={LABEL_COL_WIDTH}>
                                        Subsp
                                    </Col>
                                    <Col sm={CONTENT_COL_WIDTH}>
                                        <FormControl
                                            type="text"
                                            value={this.state.record.subsp || ''}
                                            onChange={this.handleChangeInput}
                                            placeholder="Subsp"
                                        />
                                    </Col>
                                </FormGroup>
                                <FormGroup controlId="var" bsSize='sm'>
                                    <Col componentClass={ControlLabel} sm={LABEL_COL_WIDTH}>
                                        Var
                                    </Col>
                                    <Col sm={CONTENT_COL_WIDTH}>
                                        <FormControl
                                            type="text"
                                            value={this.state.record.var || ''}
                                            onChange={this.handleChangeInput}
                                            placeholder="Var"
                                        />
                                    </Col>
                                </FormGroup>
                                <FormGroup controlId="subvar" bsSize='sm'>
                                    <Col componentClass={ControlLabel} sm={LABEL_COL_WIDTH}>
                                        Subvar
                                    </Col>
                                    <Col sm={CONTENT_COL_WIDTH}>
                                        <FormControl
                                            type="text"
                                            value={this.state.record.subvar || ''}
                                            onChange={this.handleChangeInput}
                                            placeholder="Subvar"
                                        />
                                    </Col>
                                </FormGroup>
                                <FormGroup controlId="forma" bsSize='sm'>
                                    <Col componentClass={ControlLabel} sm={LABEL_COL_WIDTH}>
                                        Forma
                                    </Col>
                                    <Col sm={CONTENT_COL_WIDTH}>
                                        <FormControl
                                            type="text"
                                            value={this.state.record.forma || ''}
                                            onChange={this.handleChangeInput}
                                            placeholder="Forma"
                                        />
                                    </Col>
                                </FormGroup>
                                <FormGroup controlId="nothosubsp" bsSize='sm'>
                                    <Col componentClass={ControlLabel} sm={LABEL_COL_WIDTH}>
                                        Nothosubsp
                                    </Col>
                                    <Col sm={CONTENT_COL_WIDTH}>
                                        <FormControl
                                            type="text"
                                            value={this.state.record.nothosubsp || ''}
                                            placeholder="Nothosubsp"
                                            onChange={this.handleChangeInput}
                                        />
                                    </Col>
                                </FormGroup>
                                <FormGroup controlId="nothoforma" bsSize='sm'>
                                    <Col componentClass={ControlLabel} sm={LABEL_COL_WIDTH}>
                                        Nothoforma
                                    </Col>
                                    <Col sm={CONTENT_COL_WIDTH}>
                                        <FormControl
                                            type="text"
                                            value={this.state.record.nothoforma || ''}
                                            placeholder="Nothoforma"
                                            onChange={this.handleChangeInput}
                                        />
                                    </Col>
                                </FormGroup>
                                <FormGroup controlId="authors" bsSize='sm'>
                                    <Col componentClass={ControlLabel} sm={LABEL_COL_WIDTH}>
                                        Authors
                                    </Col>
                                    <Col sm={CONTENT_COL_WIDTH}>
                                        <FormControl
                                            type="text"
                                            value={this.state.record.authors || ''}
                                            placeholder="Authors"
                                            onChange={this.handleChangeInput}
                                        />
                                    </Col>
                                </FormGroup>
                                <FormGroup controlId="hybrid">
                                    <Col sm={CONTENT_COL_WIDTH} smOffset={LABEL_COL_WIDTH} xs={12}>
                                        <Checkbox inline
                                            id="hybrid"
                                            value={this.state.hybrid}
                                            checked={this.state.hybrid}
                                            onChange={this.handleChangeCheckbox}>Hybrid</Checkbox>
                                    </Col>
                                </FormGroup>
                                {
                                    this.renderHybridFields(this.state.record.hybrid)
                                }
                            </Well>
                            <Well>
                                <FormGroup controlId="publication" bsSize='sm'>
                                    <Col componentClass={ControlLabel} sm={LABEL_COL_WIDTH}>
                                        Publication
                                    </Col>
                                    <Col sm={CONTENT_COL_WIDTH}>
                                        <FormControl
                                            type="text"
                                            value={this.state.record.publication || ''}
                                            placeholder="Publication"
                                            onChange={this.handleChangeInput}
                                        />
                                    </Col>
                                </FormGroup>
                                <FormGroup controlId="vernacular" bsSize='sm'>
                                    <Col componentClass={ControlLabel} sm={LABEL_COL_WIDTH}>
                                        Vernacular
                                    </Col>
                                    <Col sm={CONTENT_COL_WIDTH}>
                                        <FormControl
                                            type="text"
                                            value={this.state.record.vernacular || ''}
                                            placeholder="Vernacular"
                                            onChange={this.handleChangeInput}
                                        />
                                    </Col>
                                </FormGroup>
                                <FormGroup controlId="tribus" bsSize='sm'>
                                    <Col componentClass={ControlLabel} sm={LABEL_COL_WIDTH}>
                                        Tribus
                                    </Col>
                                    <Col sm={CONTENT_COL_WIDTH}>
                                        <FormControl
                                            type="text"
                                            value={this.state.record.tribus || ''}
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
                                <FormGroup controlId={ID_ACCEPTED_NAME_PROP} bsSize='sm'>
                                    <Col componentClass={ControlLabel} sm={LABEL_COL_WIDTH}>
                                        Accepted name
                                    </Col>
                                    <Col xs={CONTENT_COL_WIDTH}>
                                        <AsyncTypeahead
                                            id={`${ID_ACCEPTED_NAME_PROP}-autocomplete`}
                                            isLoading={this.state.isLoading}
                                            options={this.state.listOfSpecies}
                                            onSearch={this.handleSearchSpeciesAsyncTypeahead}
                                            selected={this.getSelectedName(ID_ACCEPTED_NAME_PROP)}
                                            onChange={selected => this.handleChangeTypeaheadSingle(selected, ID_ACCEPTED_NAME_PROP)}
                                            placeholder="Start by typing a species present in the database"
                                        />
                                    </Col>
                                </FormGroup>
                                <FormGroup controlId={ID_BASIONYM_NAME_PROP} bsSize='sm'>
                                    <Col componentClass={ControlLabel} sm={LABEL_COL_WIDTH}>
                                        Basionym
                                    </Col>
                                    <Col xs={CONTENT_COL_WIDTH}>
                                        <AsyncTypeahead
                                            id={`${ID_BASIONYM_NAME_PROP}-autocomplete`}
                                            isLoading={this.state.isLoading}
                                            options={this.state.listOfSpecies}
                                            onSearch={this.handleSearchSpeciesAsyncTypeahead}
                                            selected={this.getSelectedName(ID_BASIONYM_NAME_PROP)}
                                            onChange={selected => this.handleChangeTypeaheadSingle(selected, ID_BASIONYM_NAME_PROP)}
                                            placeholder="Start by typing a species present in the database"
                                        />
                                    </Col>
                                </FormGroup>
                                <FormGroup controlId={ID_REPLACED_NAME_PROP} bsSize='sm'>
                                    <Col componentClass={ControlLabel} sm={LABEL_COL_WIDTH}>
                                        Replaced name
                                    </Col>
                                    <Col xs={CONTENT_COL_WIDTH}>
                                        <AsyncTypeahead
                                            id={`${ID_REPLACED_NAME_PROP}-autocomplete`}
                                            isLoading={this.state.isLoading}
                                            options={this.state.listOfSpecies}
                                            onSearch={this.handleSearchSpeciesAsyncTypeahead}
                                            selected={this.getSelectedName(ID_REPLACED_NAME_PROP)}
                                            onChange={selected => this.handleChangeTypeaheadSingle(selected, ID_REPLACED_NAME_PROP)}
                                            placeholder="Start by typing a species present in the database"
                                        />
                                    </Col>
                                </FormGroup>
                                <FormGroup controlId={ID_NOMEN_NOVUM_NAME_PROP} bsSize='sm'>
                                    <Col componentClass={ControlLabel} sm={LABEL_COL_WIDTH}>
                                        Nomen novum
                                    </Col>
                                    <Col xs={CONTENT_COL_WIDTH}>
                                        <AsyncTypeahead
                                            id={`${ID_NOMEN_NOVUM_NAME_PROP}-autocomplete`}
                                            isLoading={this.state.isLoading}
                                            options={this.state.listOfSpecies}
                                            onSearch={this.handleSearchSpeciesAsyncTypeahead}
                                            selected={this.getSelectedName(ID_NOMEN_NOVUM_NAME_PROP)}
                                            onChange={selected => this.handleChangeTypeaheadSingle(selected, ID_NOMEN_NOVUM_NAME_PROP)}
                                            placeholder="Start by typing a species present in the database"
                                        />
                                    </Col>
                                </FormGroup>
                            </Well>
                        </div>
                        <div id="synonyms">
                            <h3>Synonyms</h3>
                            <Well>
                                <FormGroup controlId="nomenclatoric-synonyms" bsSize='sm'>
                                    <Col componentClass={ControlLabel} sm={LABEL_COL_WIDTH}>
                                        Nomenclatoric Synonyms
                                    </Col>
                                    <Col xs={CONTENT_COL_WIDTH}>
                                        <AddableList
                                            id={`nomenclatoric-synonyms-autocomplete`}
                                            async={true}
                                            data={this.state.nomenclatoricSynonyms.map(s => synonymFormatter(s, config.mappings.synonym.nomenclatoric.prefix))}
                                            options={this.state.listOfSpecies}
                                            onAddItemToList={this.handleAddNomenclatoricSynonym}
                                            onRowDelete={this.handleRemoveNomenclatoricSynonym}
                                            onSearch={this.handleSearchAsync}
                                            itemComponent={this.NomenclatoricSynonymListItem}
                                        />
                                    </Col>
                                </FormGroup>
                                <FormGroup controlId="taxonomic-synonyms" bsSize='sm'>
                                    <Col componentClass={ControlLabel} sm={LABEL_COL_WIDTH}>
                                        Taxonomic Synonyms
                                    </Col>
                                    <Col xs={CONTENT_COL_WIDTH}>
                                        <AddableList
                                            id={`taxonomic-synonyms-autocomplete`}
                                            async={true}
                                            data={this.state.taxonomicSynonyms.map(s => synonymFormatter(s, config.mappings.synonym.taxonomic.prefix))}
                                            options={this.state.listOfSpecies}
                                            onAddItemToList={this.handleAddTaxonomicSynonym}
                                            onRowDelete={this.handleRemoveTaxonomicSynonym}
                                            onSearch={this.handleSearchAsync}
                                            itemComponent={this.TaxonomicSynonymListItem}
                                        />
                                    </Col>
                                </FormGroup>
                                <FormGroup controlId="invalid-designations" bsSize='sm'>
                                    <Col componentClass={ControlLabel} sm={LABEL_COL_WIDTH}>
                                        Invalid Designations
                                    </Col>
                                    <Col xs={CONTENT_COL_WIDTH}>
                                        <AddableList
                                            id={`invalid-designations`}
                                            async={true}
                                            data={this.state.invalidDesignations.map(s => synonymFormatter(s, config.mappings.synonym.invalid.prefix))}
                                            options={this.state.listOfSpecies}
                                            onAddItemToList={this.handleAddInvalidDesignation}
                                            onRowDelete={this.handleRemoveInvalidDesignation}
                                            onSearch={this.handleSearchAsync}
                                            itemComponent={this.InvalidSynonymListItem}
                                        />
                                    </Col>
                                </FormGroup>
                            </Well>
                        </div>
                        <div id="associations-inherited">
                            <h3>Inherited associations</h3>
                            <Well>
                                <FormGroup controlId="idBasionymFor">
                                    <Col componentClass={ControlLabel} sm={LABEL_COL_WIDTH}>
                                        Basionym For
                                    </Col>
                                    <Col xs={CONTENT_COL_WIDTH}>
                                        {this.renderPlainListOfSpeciesNames(this.state.basionymFor)}
                                    </Col>
                                </FormGroup>
                                <FormGroup controlId="idReplacedFor">
                                    <Col componentClass={ControlLabel} sm={LABEL_COL_WIDTH}>
                                        Replaced For
                                    </Col>
                                    <Col xs={CONTENT_COL_WIDTH}>
                                        {this.renderPlainListOfSpeciesNames(this.state.replacedFor)}
                                    </Col>
                                </FormGroup>
                                <FormGroup controlId="idNomenNovumFor">
                                    <Col componentClass={ControlLabel} sm={LABEL_COL_WIDTH}>
                                        Nomen Novum For
                                    </Col>
                                    <Col xs={CONTENT_COL_WIDTH}>
                                        {this.renderPlainListOfSpeciesNames(this.state.nomenNovumFor)}
                                    </Col>
                                </FormGroup>
                            </Well>
                        </div>
                        <div id="controls">
                            <Row>
                                <Col sm={5} smOffset={2}>
                                    <LinkContainer to={CHECKLIST_LIST_URI}>
                                        <Button bsStyle="default" >Cancel</Button>
                                    </LinkContainer>
                                </Col>
                                <Col sm={5}>
                                    <Button bsStyle="primary" type='submit' >Save</Button>
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

export default SpeciesRecord;