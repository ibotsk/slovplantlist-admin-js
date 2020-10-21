import React from 'react';

import {
  ListGroup, ListGroupItem,
} from 'react-bootstrap';

import PropTypes from 'prop-types';
import SpecesType from 'components/propTypes/species';

import LosName from './LosName';

const PlainListOfSpeciesNames = ({ list }) => {
  if (!list || list.length === 0) {
    return <ListGroupItem />;
  }
  return (
    <ListGroup>
      {list.map((name) => (
        <ListGroupItem key={name.id}>
          <LosName data={name} />
        </ListGroupItem>
      ))}
    </ListGroup>
  );
};

export default PlainListOfSpeciesNames;

PlainListOfSpeciesNames.propTypes = {
  list: PropTypes.arrayOf(SpecesType.type),
};

PlainListOfSpeciesNames.defaultProps = {
  list: undefined,
};
