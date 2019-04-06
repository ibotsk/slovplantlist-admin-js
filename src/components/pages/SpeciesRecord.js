import React, { Component } from 'react';

import {
    Grid, Col, Row, Well, Panel,
    Form, FormControl, FormGroup, ControlLabel,
    Checkbox, Button
} from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { AsyncTypeahead } from 'react-bootstrap-typeahead';

import LosName from '../segments/LosName';

import speciesFacade from '../../facades/species';

import helper from '../../utils/helper';
import formatter from '../../utils/formatter';
import config from '../../config/config';

const LABEL_COL_WIDTH = 2;
const CONTENT_COL_WIDTH = 10;

const ID_ACCEPTED_NAME_PROP = 'id_accepted_name';
const ID_BASIONYM_NAME_PROP = 'id_basionym';
const ID_REPLACED_NAME_PROP = 'id_replaced';
const ID_NOMEN_NOVUM_NAME_PROP = 'id_nomen_novum';
const CHECKLIST_LIST_URI = '/checklist';

const ntypes = config.mappings.losType;

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
        const listOfSpecies = await speciesFacade.getAllSpeciesBySearchTerm(query, l => ({
            id: l.id,
            label: helper.listOfSpeciesString(l)
        }));
        this.setState({
            isLoading: false,
            listOfSpecies,
        });
    }

    submitForm = async e => {
        e.preventDefault();
        try {
            await speciesFacade.saveSpeciesAndSynonyms({
                species: this.state.record,
            });
        } catch (error) {
            throw error;
        }
    }

    async componentDidMount() {
        const recordId = this.props.match.params.id;
        const record = await speciesFacade.getRecordById(recordId);

        const acceptedSelected = formatter.losToTypeaheadSelected(record.accepted);
        const basionymSelected = formatter.losToTypeaheadSelected(record.basionym);
        const replacedSelected = formatter.losToTypeaheadSelected(record.replaced);
        const nomenNovumSelected = formatter.losToTypeaheadSelected(record.nomenNovum);

        this.setState({
            record,
            [`${ID_ACCEPTED_NAME_PROP}_selected`]: acceptedSelected,
            [`${ID_BASIONYM_NAME_PROP}_selected`]: basionymSelected,
            [`${ID_REPLACED_NAME_PROP}_selected`]: replacedSelected,
            [`${ID_NOMEN_NOVUM_NAME_PROP}_selected`]: nomenNovumSelected
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
        console.log(this.state);

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
            </div>
        );
    }

}

export default SpeciesRecord;