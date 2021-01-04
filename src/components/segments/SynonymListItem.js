import React from 'react';

import {
  Col, Row,
  Button, Glyphicon,
  ListGroup, ListGroupItem,
} from 'react-bootstrap';

import PropTypes from 'prop-types';
import SpeciesType from 'components/propTypes/species';

import config from 'config/config';

import LosName from './Checklist/LosName';

const constructSubNomenlatoric = (subNomenclatoricList) => {
  if (!subNomenclatoricList || subNomenclatoricList.length === 0) {
    return null;
  }
  return (
    <ListGroup className="synonyms-sublist">
      {subNomenclatoricList.map((subNomen) => (
        <ListGroupItem key={subNomen.id} bsSize="sm">
          <small>
            {config.mappings.synonym.nomenclatoric.prefix}
            {' '}
            <LosName data={subNomen} />
          </small>
        </ListGroupItem>
      ))}
    </ListGroup>
  );
};

const SynonymListItem = ({
  rowId,
  data,
  prefix,
  additions: Additions,
  nameComponent: NameComponent,
  showSubNomenclatoric = false,
  children,
  onRowDelete,
}) => {
  const { synonym: subject } = data;
  return (
    <ListGroupItem bsSize="sm">
      <Row>
        <Col xs={12}>
          {prefix}
          {' '}
          <NameComponent data={subject} />
          <span className="pull-right">
            {Additions && <Additions />}
            {onRowDelete
              && (
                <span className="remove-list-item">
                  <Button
                    bsStyle="danger"
                    bsSize="xsmall"
                    onClick={() => onRowDelete(rowId)}
                    title="Remove from this list"
                  >
                    <Glyphicon glyph="remove" />
                  </Button>
                </span>
              )}
          </span>
        </Col>
      </Row>
      {children}
      {showSubNomenclatoric
        && constructSubNomenlatoric(
          subject['synonyms-nomenclatoric-through'],
        )
      }
    </ListGroupItem>
  );
};

export default SynonymListItem;

SynonymListItem.propTypes = {
  rowId: PropTypes.number,
  data: PropTypes.shape({
    synonym: SpeciesType.isRequired,
  }).isRequired,
  nameComponent: PropTypes.func.isRequired,
  prefix: PropTypes.string.isRequired,
  additions: PropTypes.func,
  onRowDelete: PropTypes.func,
  showSubNomenclatoric: PropTypes.bool,
  children: PropTypes.element,
};

SynonymListItem.defaultProps = {
  rowId: undefined,
  additions: undefined,
  onRowDelete: undefined,
  showSubNomenclatoric: false,
  children: undefined,
};
