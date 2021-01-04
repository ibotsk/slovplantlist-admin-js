import React from 'react';

import PropTypes from 'prop-types';
import GenusType from 'components/propTypes/genus';

import { Menu, MenuItem } from 'react-bootstrap-typeahead';

import AcceptedNameWarning from './AcceptedNameWarning';

const GenusSynonymMenu = ({ results, menuProps, assignedToName }) => (
  // eslint-disable-next-line react/jsx-props-no-spreading
  <Menu {...menuProps}>
    {results.map((result, index) => (
      <MenuItem
        option={result}
        position={index}
        key={result.id}
      >
        {result.label}
        <AcceptedNameWarning
          className="pull-right"
          currentAccepted={result.accepted}
          newAccepted={assignedToName}
        />
      </MenuItem>
    ))}
  </Menu>
);

export default GenusSynonymMenu;

GenusSynonymMenu.propTypes = {
  results: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.number.isRequired,
    label: PropTypes.string.isRequired,
    // eslint-disable-next-line react/forbid-prop-types
    accepted: PropTypes.object,
  })).isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  menuProps: PropTypes.object.isRequired,
  assignedToName: GenusType.type,
};

GenusSynonymMenu.defaultProps = {
  assignedToName: undefined,
};
