import React, { Component } from 'react';
import { connect } from 'react-redux';

import {
  Col,
  Button, Checkbox,
  Modal, Panel,
  Form, FormGroup, FormControl, ControlLabel,
} from 'react-bootstrap';

import { Typeahead } from 'react-bootstrap-typeahead';

import PropTypes from 'prop-types';

import { notifications } from 'utils';

import { speciesFacade, genusFacade } from 'facades';

import config from 'config/config';

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
  genusH: '',
  speciesH: '',
  subspH: '',
  varH: '',
  subvarH: '',
  formaH: '',
  nothosubspH: '',
  nothoformaH: '',
  authorsH: '',
  publication: '',
  vernacular: '',
  tribus: '',
  idGenus: undefined,
};

const ntypes = config.mappings.losType;

class SpeciesNameModal extends Component {
  constructor(props) {
    super(props);

    this.state = {
      record: {
        ...initialValues,
      },
      genera: [],
      genusSelected: undefined,
      familySelected: undefined,
      familyApgSelected: undefined,
    };
  }

  async componentDidMount() {
    const { accessToken } = this.props;
    const genera = await genusFacade.getAllGeneraWithFamilies(accessToken);
    this.setState({
      genera,
    });
  }

  onEnter = async () => {
    const { id, accessToken } = this.props;
    if (id) {
      const data = await speciesFacade.getSpeciesById(id, accessToken);
      this.setState((state) => {
        const { genera } = state;
        const genusSelected = genera
          .filter((g) => g.id === data.idGenus)
          .map((g) => ({ id: g.id, label: g.name }));
        const {
          familySelected, familyApgSelected,
        } = this.filterFamilies(data.idGenus);

        return {
          record: data,
          genusSelected,
          familySelected,
          familyApgSelected,
        };
      });
    }
  }

  // at least one field must be non-empty - prevent accidental saving of all-empty
  getValidationState = () => {
    const { record: { id, ntype, ...recordWithoutIdNtype } } = this.state;
    for (const key of Object.keys(recordWithoutIdNtype)) {
      if (recordWithoutIdNtype[key].length > 0) {
        return true;
      }
    }
    return false;
  }

  handleChange = (e) => {
    const { id: prop, value } = e.target;
    return this.setState((state) => {
      const { record } = state;
      record[prop] = value;
      return {
        record,
      };
    });
  };

  handleChangeCheckbox = (e) => {
    const { id: prop, checked } = e.target;
    return this.setState((state) => {
      const { record } = state;
      record[prop] = checked;
      return {
        record,
      };
    });
  };

  handleChangeTypeahead = (selected) => {
    const id = selected[0] ? selected[0].id : undefined;
    this.setState((state) => {
      const { record } = state;
      record.idGenus = id;
      const { familySelected, familyApgSelected } = this.filterFamilies(id);
      return {
        record,
        genusSelected: selected,
        familySelected,
        familyApgSelected,
      };
    });
  }

  handleHide = () => {
    this.setState({
      record: { ...initialValues },
      genusSelected: undefined,
      familySelected: undefined,
      familyApgSelected: undefined,
    });
    const { onHide } = this.props;
    onHide();
  }

  handleSave = async () => {
    if (this.getValidationState()) {
      const { accessToken } = this.props;
      const { record: data } = this.state;
      try {
        await speciesFacade.saveSpecies(data, accessToken);
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

  filterFamilies = (idGenus) => {
    const { genera } = this.state;
    const familySelected = genera
      .filter((g) => g.id === idGenus)
      .map((g) => (g.family ? g.family.name : '-'))[0];
    const familyApgSelected = genera
      .filter((g) => g.id === idGenus)
      .map((g) => (g['family-apg'] ? g['family-apg'].name : '-'))[0];
    return {
      familySelected,
      familyApgSelected,
    };
  }

  renderHybridFields = (isHybrid) => {
    if (isHybrid) {
      const {
        record: {
          genusH, speciesH, subspH, varH, subvarH, formaH,
          nothosubspH, nothoformaH, authorsH,
        },
      } = this.state;
      return (
        <Panel>
          <Panel.Body>
            <FormGroup controlId="genusH" bsSize="sm">
              <Col componentClass={ControlLabel} sm={titleColWidth}>
                Hybrid Genus
              </Col>
              <Col sm={mainColWidth}>
                <FormControl
                  type="text"
                  value={genusH || ''}
                  placeholder="Hybrid Genus"
                  onChange={this.handleChange}
                />
              </Col>
            </FormGroup>
            <FormGroup controlId="speciesH" bsSize="sm">
              <Col componentClass={ControlLabel} sm={titleColWidth}>
                Hybrid Species
              </Col>
              <Col sm={mainColWidth}>
                <FormControl
                  type="text"
                  value={speciesH || ''}
                  placeholder="Hybrid Species"
                  onChange={this.handleChange}
                />
              </Col>
            </FormGroup>
            <FormGroup controlId="subspH" bsSize="sm">
              <Col componentClass={ControlLabel} sm={titleColWidth}>
                Hybrid Subsp
              </Col>
              <Col sm={mainColWidth}>
                <FormControl
                  type="text"
                  value={subspH || ''}
                  placeholder="Hybrid Subsp"
                  onChange={this.handleChange}
                />
              </Col>
            </FormGroup>
            <FormGroup controlId="varH" bsSize="sm">
              <Col componentClass={ControlLabel} sm={titleColWidth}>
                Hybrid Var
              </Col>
              <Col sm={mainColWidth}>
                <FormControl
                  type="text"
                  value={varH || ''}
                  placeholder="Hybrid Var"
                  onChange={this.handleChange}
                />
              </Col>
            </FormGroup>
            <FormGroup controlId="subvarH" bsSize="sm">
              <Col componentClass={ControlLabel} sm={titleColWidth}>
                Hybrid Subvar
              </Col>
              <Col sm={mainColWidth}>
                <FormControl
                  type="text"
                  value={subvarH || ''}
                  placeholder="Hybrid Subvar"
                  onChange={this.handleChange}
                />
              </Col>
            </FormGroup>
            <FormGroup controlId="formaH" bsSize="sm">
              <Col componentClass={ControlLabel} sm={titleColWidth}>
                Hybrid Forma
              </Col>
              <Col sm={mainColWidth}>
                <FormControl
                  type="text"
                  value={formaH || ''}
                  placeholder="Hybrid Forma"
                  onChange={this.handleChange}
                />
              </Col>
            </FormGroup>
            <FormGroup controlId="nothosubspH" bsSize="sm">
              <Col componentClass={ControlLabel} sm={titleColWidth}>
                Hybrid Nothosubsp
              </Col>
              <Col sm={mainColWidth}>
                <FormControl
                  type="text"
                  value={nothosubspH || ''}
                  onChange={this.handleChange}
                  placeholder="Hybrid Nothosubsp"
                />
              </Col>
            </FormGroup>
            <FormGroup controlId="nothoformaH" bsSize="sm">
              <Col componentClass={ControlLabel} sm={titleColWidth}>
                Hybrid Nothoforma
              </Col>
              <Col sm={mainColWidth}>
                <FormControl
                  type="text"
                  value={nothoformaH || ''}
                  onChange={this.handleChange}
                  placeholder="Hybrid Nothoforma"
                />
              </Col>
            </FormGroup>
            <FormGroup controlId="authorsH" bsSize="sm">
              <Col componentClass={ControlLabel} sm={titleColWidth}>
                Hybrid Authors
              </Col>
              <Col sm={mainColWidth}>
                <FormControl
                  type="text"
                  value={authorsH || ''}
                  placeholder="Hybrid Authors"
                  onChange={this.handleChange}
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
    const { show, id } = this.props;
    const {
      familySelected, familyApgSelected, genera, genusSelected,
      record: {
        ntype, genus, species, subsp, var: variety, subvar,
        forma, nothosubsp, nothoforma, proles, unranked, authors, hybrid,
        publication, tribus,
      },
    } = this.state;
    return (
      <Modal show={show} onHide={this.handleHide} onEnter={this.onEnter}>
        <Modal.Header closeButton>
          <Modal.Title>
            {id ? 'Edit name' : 'Create new name'}
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
                  onChange={this.handleChange}
                >
                  {Object.keys(ntypes).map((t) => (
                    <option value={t} key={t}>{ntypes[t].text}</option>
                  ))}
                </FormControl>
              </Col>
            </FormGroup>
            <FormGroup bsSize="sm">
              <Col componentClass={ControlLabel} sm={titleColWidth}>
                <ControlLabel>Family</ControlLabel>
              </Col>
              <Col sm={mainColWidth}>
                <FormControl.Static>{familySelected}</FormControl.Static>
              </Col>
            </FormGroup>
            <FormGroup bsSize="sm">
              <Col componentClass={ControlLabel} sm={titleColWidth}>
                <ControlLabel>Family APG</ControlLabel>
              </Col>
              <Col sm={mainColWidth}>
                <FormControl.Static>{familyApgSelected}</FormControl.Static>
              </Col>
            </FormGroup>
            <FormGroup
              controlId="genus-ref"
              bsSize="sm"
            >
              <Col componentClass={ControlLabel} sm={titleColWidth}>
                Genus reference
              </Col>
              <Col sm={mainColWidth}>
                <Typeahead
                  id="genus-reference-autocomplete"
                  options={genera.map((g) => ({ id: g.id, label: g.name }))}
                  selected={genusSelected}
                  onChange={this.handleChangeTypeahead}
                  placeholder="Start by typing a family in the database"
                />
              </Col>
            </FormGroup>
            <FormGroup controlId="genus" bsSize="sm">
              <Col componentClass={ControlLabel} sm={titleColWidth}>
                Genus text
              </Col>
              <Col sm={mainColWidth}>
                <FormControl
                  type="text"
                  value={genus || ''}
                  placeholder="Genus"
                  onChange={this.handleChange}
                />
              </Col>
            </FormGroup>
            <FormGroup controlId="species" bsSize="sm">
              <Col componentClass={ControlLabel} sm={titleColWidth}>
                Species
              </Col>
              <Col sm={mainColWidth}>
                <FormControl
                  type="text"
                  value={species || ''}
                  placeholder="Species"
                  onChange={this.handleChange}
                />
              </Col>
            </FormGroup>
            <FormGroup controlId="subsp" bsSize="sm">
              <Col componentClass={ControlLabel} sm={titleColWidth}>
                Subsp
              </Col>
              <Col sm={mainColWidth}>
                <FormControl
                  type="text"
                  value={subsp || ''}
                  placeholder="Subsp"
                  onChange={this.handleChange}
                />
              </Col>
            </FormGroup>
            <FormGroup controlId="var" bsSize="sm">
              <Col componentClass={ControlLabel} sm={titleColWidth}>
                Var
              </Col>
              <Col sm={mainColWidth}>
                <FormControl
                  type="text"
                  value={variety || ''}
                  placeholder="Var"
                  onChange={this.handleChange}
                />
              </Col>
            </FormGroup>
            <FormGroup controlId="subvar" bsSize="sm">
              <Col componentClass={ControlLabel} sm={titleColWidth}>
                Subvar
              </Col>
              <Col sm={mainColWidth}>
                <FormControl
                  type="text"
                  value={subvar || ''}
                  placeholder="Subvar"
                  onChange={this.handleChange}
                />
              </Col>
            </FormGroup>
            <FormGroup controlId="forma" bsSize="sm">
              <Col componentClass={ControlLabel} sm={titleColWidth}>
                Forma
              </Col>
              <Col sm={mainColWidth}>
                <FormControl
                  type="text"
                  value={forma || ''}
                  placeholder="Forma"
                  onChange={this.handleChange}
                />
              </Col>
            </FormGroup>
            <FormGroup controlId="nothosubsp" bsSize="sm">
              <Col componentClass={ControlLabel} sm={titleColWidth}>
                Nothosubsp
              </Col>
              <Col sm={mainColWidth}>
                <FormControl
                  type="text"
                  value={nothosubsp || ''}
                  placeholder="Nothosubsp"
                  onChange={this.handleChange}
                />
              </Col>
            </FormGroup>
            <FormGroup controlId="nothoforma" bsSize="sm">
              <Col componentClass={ControlLabel} sm={titleColWidth}>
                Nothoforma
              </Col>
              <Col sm={mainColWidth}>
                <FormControl
                  type="text"
                  value={nothoforma || ''}
                  placeholder="Nothoforma"
                  onChange={this.handleChange}
                />
              </Col>
            </FormGroup>
            <FormGroup controlId="proles" bsSize="sm">
              <Col componentClass={ControlLabel} sm={titleColWidth}>
                Proles
              </Col>
              <Col sm={mainColWidth}>
                <FormControl
                  type="text"
                  value={proles || ''}
                  placeholder="Proles"
                  onChange={this.handleChange}
                />
              </Col>
            </FormGroup>
            <FormGroup controlId="unranked" bsSize="sm">
              <Col componentClass={ControlLabel} sm={titleColWidth}>
                Unranked
              </Col>
              <Col sm={mainColWidth}>
                <FormControl
                  type="text"
                  value={unranked || ''}
                  placeholder="Unranked"
                  onChange={this.handleChange}
                />
              </Col>
            </FormGroup>
            <FormGroup controlId="authors" bsSize="sm">
              <Col componentClass={ControlLabel} sm={titleColWidth}>
                Authors
              </Col>
              <Col sm={mainColWidth}>
                <FormControl
                  type="text"
                  value={authors || ''}
                  placeholder="Authors"
                  onChange={this.handleChange}
                />
              </Col>
            </FormGroup>
            <FormGroup controlId="hybrid">
              <Col sm={12}>
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
            <FormGroup controlId="publication" bsSize="sm">
              <Col componentClass={ControlLabel} sm={titleColWidth}>
                Publication
              </Col>
              <Col sm={mainColWidth}>
                <FormControl
                  type="text"
                  value={publication || ''}
                  placeholder="Publication"
                  onChange={this.handleChange}
                />
              </Col>
            </FormGroup>
            <FormGroup controlId="tribus" bsSize="sm">
              <Col componentClass={ControlLabel} sm={titleColWidth}>
                Tribus
              </Col>
              <Col sm={mainColWidth}>
                <FormControl
                  type="text"
                  value={tribus || ''}
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
    );
  }
}

const mapStateToProps = (state) => ({
  accessToken: state.authentication.accessToken,
});

export default connect(mapStateToProps)(SpeciesNameModal);

SpeciesNameModal.propTypes = {
  show: PropTypes.bool.isRequired,
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  accessToken: PropTypes.string.isRequired,
  onHide: PropTypes.func.isRequired,
};

SpeciesNameModal.defaultProps = {
  id: undefined,
};
