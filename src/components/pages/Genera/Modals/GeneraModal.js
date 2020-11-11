import React, { Component } from 'react';
import { connect } from 'react-redux';

import {
  Col,
  Button, Modal,
  Form, FormGroup, FormControl, ControlLabel,
} from 'react-bootstrap';

import { AsyncTypeahead } from 'react-bootstrap-typeahead';

import PropTypes from 'prop-types';

import { notifications, miscUtils } from 'utils';
import config from 'config/config';

import { genusFacade, familiesFacade } from 'facades';

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

const searchFamilies = (query, at) => (
  familiesFacade.getAllFamiliesBySearchTerm(query, at)
);
const searchFamiliesApg = (query, at) => (
  familiesFacade.getAllFamiliesApgBySearchTerm(query, at)
);

class GeneraModal extends Component {
  constructor(props) {
    super(props);

    this.state = {
      genus: {
        ...initialValues,
      },
      families: [],
      familiesApg: [],
      isLoading: false,
      selectedFamily: [],
      selectedFamilyApg: [],
    };
  }

  onEnter = async () => {
    const { id, accessToken } = this.props;
    if (id) {
      const {
        genus, family, familyApg,
      } = await genusFacade.getGenusByIdWithFamilies(
        id, accessToken,
      );

      this.setState({
        genus,
        selectedFamily: family ? [family] : [],
        selectedFamilyApg: familyApg ? [familyApg] : [],
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

  handleSearch = async (query, func, listProp) => {
    this.setState({ isLoading: true });
    const { accessToken } = this.props;
    const results = await func(query, accessToken);
    this.setState({
      isLoading: false,
      [listProp]: results,
    });
  }

  handleOnChangeTypeahead = (selected, prop) => (
    this.setState((state) => {
      const { genus } = state;
      const capProp = miscUtils.capitalize(prop);
      genus[`id${capProp}`] = selected[0] ? selected[0].id : undefined;

      return {
        genus,
        [`selected${capProp}`]: selected,
      };
    })
  );

  render() {
    const { show, id } = this.props;
    const {
      isLoading,
      families, familiesApg,
      selectedFamily, selectedFamilyApg,
      genus: {
        ntype, name, authors,
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
            <FormGroup controlId="ntype" bsSize="sm">
              <Col componentClass={ControlLabel} sm={titleColWidth}>
                Type
              </Col>
              <Col sm={mainColWidth}>
                <FormControl
                  componentClass="select"
                  placeholder="select"
                  value={ntype || ''}
                  onChange={this.handleChangeInput}
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
                  onSearch={(query) => this.handleSearch(
                    query, searchFamiliesApg, 'familiesApg',
                  )}
                  options={familiesApg}
                  selected={selectedFamilyApg}
                  onChange={(selected) => this.handleOnChangeTypeahead(
                    selected, 'familyApg',
                  )}
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
                  onSearch={(query) => this.handleSearch(
                    query, searchFamilies, 'families',
                  )}
                  options={families}
                  selected={selectedFamily}
                  onChange={(selected) => this.handleOnChangeTypeahead(
                    selected, 'family',
                  )}
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
  id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  accessToken: PropTypes.string.isRequired,
  onHide: PropTypes.func.isRequired,
};

GeneraModal.defaultProps = {
  id: undefined,
};
