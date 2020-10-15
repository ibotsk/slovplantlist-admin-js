import React from 'react';

import {
  Col, Row,
  Button, Glyphicon,
  ListGroup, ListGroupItem,
} from 'react-bootstrap';

import PropTypes from 'prop-types';

import SpeciesType from '../propTypes/species';

import LosName from './LosName';

import config from '../../config/config';

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
  rowId, data: { prefix, value: losObject },
  additions: Additions, removable = false, ...props
}) => (
  <ListGroupItem bsSize="sm">
    <Row>
      <Col xs={12}>
        {prefix}
        {' '}
        <LosName data={losObject} />
        <span className="pull-right">
          {Additions
            && <Additions rowId={rowId} {...props} />}
          {removable
            && (
              <span className="remove-list-item">
                <Button
                  bsStyle="danger"
                  bsSize="xsmall"
                  onClick={() => props.onRowDelete(rowId)}
                  title="Remove from this list"
                >
                  <Glyphicon glyph="remove" />
                </Button>
              </span>
            )}
        </span>
      </Col>
    </Row>
    {constructSubNomenlatoric(losObject['synonyms-nomenclatoric'])}
  </ListGroupItem>
);

export default SynonymListItem;

SynonymListItem.propTypes = {
  rowId: PropTypes.number.isRequired,
  data: PropTypes.shape({
    prefix: PropTypes.string.isRequired,
    value: SpeciesType.type.isRequired,
  }).isRequired,
  additions: PropTypes.func,
  removable: PropTypes.bool,
  onRowDelete: PropTypes.func.isRequired,
};

SynonymListItem.defaultProps = {
  additions: undefined,
  removable: false,
};
