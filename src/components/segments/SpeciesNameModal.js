import React, { Component } from 'react';
import { connect } from 'react-redux';

import {
    Col,
    Button, Checkbox,
    Modal, Panel,
    Form, FormGroup, FormControl, ControlLabel
} from 'react-bootstrap';

import { Typeahead } from 'react-bootstrap-typeahead';

import notifications from '../../utils/notifications';

import speciesFacade from '../../facades/species';
import generaFacade from '../../facades/genus';

import config from '../../config/config';

const titleColWidth = 2;
const mainColWidth = 10;

const initialValues = {
    id: undefined,
    ntype: 'A',
    hybrid: false,
    genus: '',
    species: '',
    subsp: '',
    var: '',
    subvar: '',
    forma: '',
    nothosubsp: '',
    nothoforma: '',
    authors: '',
    genus_h: '',
    species_h: '',
    subsp_h: '',
    var_h: '',
    subvar_h: '',
    forma_h: '',
    nothosubsp_h: '',
    nothoforma_h: '',
    authors_h: '',
    publication: '',
    vernacular: '',
    tribus: '',
    id_genus: undefined
};

const ntypes = config.mappings.losType;

class SpeciesNameModal extends Component {

    constructor(props) {
        super(props);

        this.accessToken = this.props.accessToken;

        this.state = {
            record: {
                ...initialValues
            },
            genera: [],
            genus_selected: undefined,
            family_selected: undefined,
            familyApg_selected: undefined
        };
    }

    onEnter = async () => {
        if (this.props.id) {
            const data = await speciesFacade.getSpeciesById({ id: this.props.id, accessToken: this.accessToken });
            const genus_selected = this.state.genera.filter(g => g.id === data.id_genus).map(g => ({ id: g.id, label: g.name }));
            const { family_selected, familyApg_selected } = this.filterFamilies(data.id_genus);
            this.setState({
                record: { ...data },
                genus_selected,
                family_selected,
                familyApg_selected
            });
        }
    }

    // at least one field must be non-empty - prevent accidental saving of all-empty
    getValidationState = () => {
        const { id, ntype, ...record } = this.state.record;
        for (const key in record) {  //without id and ntype
            if (record[key].length > 0) {
                return true;
            }
        }
        return false;
    }

    handleChange = (e) => {
        const record = { ...this.state.record };
        record[e.target.id] = e.target.value;
        this.setState({
            record
        });
    }

    handleChangeCheckbox = (e) => {
        const record = { ...this.state.record };
        record[e.target.id] = e.target.checked;
        this.setState({
            record
        });
    }

    handleChangeTypeahead = (selected) => {
        const id = selected[0] ? selected[0].id : undefined;
        const record = { ...this.state.record };
        record.id_genus = id;
        const { family_selected, familyApg_selected } = this.filterFamilies(id);
        this.setState({
            record,
            genus_selected: selected,
            family_selected,
            familyApg_selected
        });
    }

    handleHide = () => {
        this.props.onHide();
        this.setState({
            record: { ...initialValues },
            genus_selected: undefined,
            family_selected: undefined,
            familyApg_selected: undefined
        });
    }

    handleSave = async () => {
        if (this.getValidationState()) {
            const data = { ...this.state.record };
            try {
                await speciesFacade.saveSpecies({ data, accessToken: this.accessToken });
                notifications.success('Saved');
                this.handleHide();
            } catch (error) {
                notifications.error('Error saving');
                throw error;
            }
        } else {
            notifications.error('At least one field must not be empty!');
        }
    }

    filterFamilies = idGenus => {
        const family_selected = this.state.genera.filter(g => g.id === idGenus).map(g => g.family ? g.family.name : '-')[0];
        const familyApg_selected = this.state.genera.filter(g => g.id === idGenus).map(g => g.familyApg ? g.familyApg.name : '-')[0];
        return {
            family_selected,
            familyApg_selected
        }
    }

    async componentDidMount() {
        const genera = await generaFacade.getAllGeneraWithFamilies({ accessToken: this.accessToken });
        this.setState({
            genera
        });
    }

    render() {
        return (
            <Modal show={this.props.show} onHide={this.handleHide} onEnter={this.onEnter}>
                <Modal.Header closeButton>
                    <Modal.Title>{this.props.id ? 'Edit name' : 'Create new name'}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form horizontal>
                        <FormGroup controlId="ntype" bsSize='sm'>
                            <Col componentClass={ControlLabel} sm={titleColWidth}>
                                Type
                            </Col>
                            <Col sm={mainColWidth}>
                                <FormControl
                                    componentClass="select"
                                    placeholder="select"
                                    value={this.state.record.ntype}
                                    onChange={this.handleChange} >
                                    {
                                        Object.keys(ntypes).map(t => <option value={t} key={t}>{ntypes[t].text}</option>)
                                    }
                                </FormControl>
                            </Col>
                        </FormGroup>
                        <FormGroup bsSize='sm'>
                            <Col componentClass={ControlLabel} sm={titleColWidth}>
                                <ControlLabel>Family</ControlLabel>
                            </Col>
                            <Col sm={mainColWidth}>
                                <FormControl.Static>{this.state.family_selected}</FormControl.Static>
                            </Col>
                        </FormGroup>
                        <FormGroup bsSize='sm'>
                            <Col componentClass={ControlLabel} sm={titleColWidth}>
                                <ControlLabel>Family APG</ControlLabel>
                            </Col>
                            <Col sm={mainColWidth}>
                                <FormControl.Static>{this.state.familyApg_selected}</FormControl.Static>
                            </Col>
                        </FormGroup>
                        <FormGroup
                            controlId="genus-ref"
                            bsSize='sm'
                        >
                            <Col componentClass={ControlLabel} sm={titleColWidth}>
                                Genus reference
                            </Col>
                            <Col sm={mainColWidth}>
                                <Typeahead
                                    id="genus-reference-autocomplete"
                                    options={this.state.genera.map(g => ({ id: g.id, label: g.name }))}
                                    selected={this.state.genus_selected}
                                    onChange={this.handleChangeTypeahead}
                                    placeholder="Start by typing a family in the database" />
                            </Col>
                        </FormGroup>
                        <FormGroup controlId="genus" bsSize='sm'>
                            <Col componentClass={ControlLabel} sm={titleColWidth}>
                                Genus text
                            </Col>
                            <Col sm={mainColWidth}>
                                <FormControl
                                    type="text"
                                    value={this.state.record.genus || ''}
                                    placeholder="Genus"
                                    onChange={this.handleChange}
                                />
                            </Col>
                        </FormGroup>
                        <FormGroup controlId="species" bsSize='sm'>
                            <Col componentClass={ControlLabel} sm={titleColWidth}>
                                Species
                            </Col>
                            <Col sm={mainColWidth}>
                                <FormControl
                                    type="text"
                                    value={this.state.record.species || ''}
                                    placeholder="Species"
                                    onChange={this.handleChange}
                                />
                            </Col>
                        </FormGroup>
                        <FormGroup controlId="subsp" bsSize='sm'>
                            <Col componentClass={ControlLabel} sm={titleColWidth}>
                                Subsp
                            </Col>
                            <Col sm={mainColWidth}>
                                <FormControl
                                    type="text"
                                    value={this.state.record.subsp || ''}
                                    placeholder="Subsp"
                                    onChange={this.handleChange}
                                />
                            </Col>
                        </FormGroup>
                        <FormGroup controlId="var" bsSize='sm'>
                            <Col componentClass={ControlLabel} sm={titleColWidth}>
                                Var
                            </Col>
                            <Col sm={mainColWidth}>
                                <FormControl
                                    type="text"
                                    value={this.state.record.var || ''}
                                    placeholder="Var"
                                    onChange={this.handleChange}
                                />
                            </Col>
                        </FormGroup>
                        <FormGroup controlId="subvar" bsSize='sm'>
                            <Col componentClass={ControlLabel} sm={titleColWidth}>
                                Subvar
                            </Col>
                            <Col sm={mainColWidth}>
                                <FormControl
                                    type="text"
                                    value={this.state.record.subvar || ''}
                                    placeholder="Subvar"
                                    onChange={this.handleChange}
                                />
                            </Col>
                        </FormGroup>
                        <FormGroup controlId="forma" bsSize='sm'>
                            <Col componentClass={ControlLabel} sm={titleColWidth}>
                                Forma
                            </Col>
                            <Col sm={mainColWidth}>
                                <FormControl
                                    type="text"
                                    value={this.state.record.forma || ''}
                                    placeholder="Forma"
                                    onChange={this.handleChange}
                                />
                            </Col>
                        </FormGroup>
                        <FormGroup controlId="nothosubsp" bsSize='sm'>
                            <Col componentClass={ControlLabel} sm={titleColWidth}>
                                Nothosubsp
                            </Col>
                            <Col sm={mainColWidth}>
                                <FormControl
                                    type="text"
                                    value={this.state.record.nothosubsp || ''}
                                    placeholder="Nothosubsp"
                                    onChange={this.handleChange}
                                />
                            </Col>
                        </FormGroup>
                        <FormGroup controlId="nothoforma" bsSize='sm'>
                            <Col componentClass={ControlLabel} sm={titleColWidth}>
                                Nothoforma
                            </Col>
                            <Col sm={mainColWidth}>
                                <FormControl
                                    type="text"
                                    value={this.state.record.nothoforma || ''}
                                    placeholder="Nothoforma"
                                    onChange={this.handleChange}
                                />
                            </Col>
                        </FormGroup>
                        <FormGroup controlId="authors" bsSize='sm'>
                            <Col componentClass={ControlLabel} sm={titleColWidth}>
                                Authors
                            </Col>
                            <Col sm={mainColWidth}>
                                <FormControl
                                    type="text"
                                    value={this.state.record.authors || ''}
                                    placeholder="Authors"
                                    onChange={this.handleChange}
                                />
                            </Col>
                        </FormGroup>
                        <FormGroup controlId="hybrid">
                            <Col sm={12}>
                                <Checkbox inline
                                    id="hybrid"
                                    value={this.state.record.hybrid || false}
                                    checked={this.state.record.hybrid}
                                    onChange={this.handleChangeCheckbox}>Hybrid</Checkbox>
                            </Col>
                        </FormGroup>
                        {
                            this.renderHybridFields(this.state.record.hybrid)
                        }
                        <FormGroup controlId="publication" bsSize='sm'>
                            <Col componentClass={ControlLabel} sm={titleColWidth}>
                                Publication
                            </Col>
                            <Col sm={mainColWidth}>
                                <FormControl
                                    type="text"
                                    value={this.state.record.publication || ''}
                                    placeholder="Publication"
                                    onChange={this.handleChange}
                                />
                            </Col>
                        </FormGroup>
                        <FormGroup controlId="tribus" bsSize='sm'>
                            <Col componentClass={ControlLabel} sm={titleColWidth}>
                                Tribus
                            </Col>
                            <Col sm={mainColWidth}>
                                <FormControl
                                    type="text"
                                    value={this.state.record.tribus || ''}
                                    placeholder="Tribus"
                                    onChange={this.handleChange}
                                />
                            </Col>
                        </FormGroup>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={this.handleHide}>Close</Button>
                    <Button bsStyle="primary" onClick={this.handleSave}>Save</Button>
                </Modal.Footer>
            </Modal>
        )
    }

    renderHybridFields = (isHybrid) => {
        if (isHybrid) {
            return (
                <Panel>
                    <Panel.Body>
                        <FormGroup controlId="genus_h" bsSize='sm'>
                            <Col componentClass={ControlLabel} sm={titleColWidth}>
                                Hybrid Genus
                            </Col>
                            <Col sm={mainColWidth}>
                                <FormControl
                                    type="text"
                                    value={this.state.record.genus_h || ''}
                                    placeholder="Hybrid Genus"
                                    onChange={this.handleChange}
                                />
                            </Col>
                        </FormGroup>
                        <FormGroup controlId="species_h" bsSize='sm'>
                            <Col componentClass={ControlLabel} sm={titleColWidth}>
                                Hybrid Species
                            </Col>
                            <Col sm={mainColWidth}>
                                <FormControl
                                    type="text"
                                    value={this.state.record.species_h || ''}
                                    placeholder="Hybrid Species"
                                    onChange={this.handleChange}
                                />
                            </Col>
                        </FormGroup>
                        <FormGroup controlId="subsp_h" bsSize='sm'>
                            <Col componentClass={ControlLabel} sm={titleColWidth}>
                                Hybrid Subsp
                            </Col>
                            <Col sm={mainColWidth}>
                                <FormControl
                                    type="text"
                                    value={this.state.record.subsp_h || ''}
                                    placeholder="Hybrid Subsp"
                                    onChange={this.handleChange}
                                />
                            </Col>
                        </FormGroup>
                        <FormGroup controlId="var_h" bsSize='sm'>
                            <Col componentClass={ControlLabel} sm={titleColWidth}>
                                Hybrid Var
                            </Col>
                            <Col sm={mainColWidth}>
                                <FormControl
                                    type="text"
                                    value={this.state.record.var_h || ''}
                                    placeholder="Hybrid Var"
                                    onChange={this.handleChange}
                                />
                            </Col>
                        </FormGroup>
                        <FormGroup controlId="subvar_h" bsSize='sm'>
                            <Col componentClass={ControlLabel} sm={titleColWidth}>
                                Hybrid Subvar
                            </Col>
                            <Col sm={mainColWidth}>
                                <FormControl
                                    type="text"
                                    value={this.state.record.subvar_h || ''}
                                    placeholder="Hybrid Subvar"
                                    onChange={this.handleChange}
                                />
                            </Col>
                        </FormGroup>
                        <FormGroup controlId="forma_h" bsSize='sm'>
                            <Col componentClass={ControlLabel} sm={titleColWidth}>
                                Hybrid Forma
                            </Col>
                            <Col sm={mainColWidth}>
                                <FormControl
                                    type="text"
                                    value={this.state.record.forma_h || ''}
                                    placeholder="Hybrid Forma"
                                    onChange={this.handleChange}
                                />
                            </Col>
                        </FormGroup>
                        <FormGroup controlId="nothosubsp_h" bsSize='sm'>
                            <Col componentClass={ControlLabel} sm={titleColWidth}>
                                Hybrid Nothosubsp
                            </Col>
                            <Col sm={mainColWidth}>
                                <FormControl
                                    type="text"
                                    value={this.state.record.nothosubsp_h || ''}
                                    onChange={this.handleChange}
                                    placeholder="Hybrid Nothosubsp"
                                />
                            </Col>
                        </FormGroup>
                        <FormGroup controlId="nothoforma_h" bsSize='sm'>
                            <Col componentClass={ControlLabel} sm={titleColWidth}>
                                Hybrid Nothoforma
                            </Col>
                            <Col sm={mainColWidth}>
                                <FormControl
                                    type="text"
                                    value={this.state.record.nothoforma_h || ''}
                                    onChange={this.handleChange}
                                    placeholder="Hybrid Nothoforma"
                                />
                            </Col>
                        </FormGroup>
                        <FormGroup controlId="authors_h" bsSize='sm'>
                            <Col componentClass={ControlLabel} sm={titleColWidth}>
                                Hybrid Authors
                            </Col>
                            <Col sm={mainColWidth}>
                                <FormControl
                                    type="text"
                                    value={this.state.record.authors_h || ''}
                                    placeholder="Hybrid Authors"
                                    onChange={this.handleChange}
                                />
                            </Col>
                        </FormGroup>
                    </Panel.Body>
                </Panel>
            )
        }
    }

}

const mapStateToProps = state => ({
    accessToken: state.authentication.accessToken
});

export default connect(mapStateToProps)(SpeciesNameModal);