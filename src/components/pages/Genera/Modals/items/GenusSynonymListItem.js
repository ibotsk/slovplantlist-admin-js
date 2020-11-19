import React from 'react';

import PropTypes from 'prop-types';
import SynonymType from 'components/propTypes/synonym';
import GenusType from 'components/propTypes/genus';

import SynonymListItem from 'components/segments/SynonymListItem';
import GenusName from 'components/segments/genera/GenusName';

import config from 'config/config';

import AcceptedNameWarning from './AcceptedNameWarning';

const GenusSynonymListItem = ({
  rowId,
  data,
  onRowDelete,
  assignedToName,
}) => {
  const { synonym } = data;
  const Addition = () => (
    <AcceptedNameWarning
      currentAccepted={synonym.accepted}
      newAccepted={assignedToName}
    />
  );

  return (
    <SynonymListItem
      rowId={rowId}
      data={data}
      nameComponent={GenusName}
      prefix={config.mappings.synonym.taxonomic.prefix}
      onRowDelete={onRowDelete}
      additions={Addition}
    />
  );
};

export default GenusSynonymListItem;

GenusSynonymListItem.propTypes = {
  rowId: PropTypes.number.isRequired,
  data: SynonymType.type.isRequired,
  onRowDelete: PropTypes.func.isRequired,
  assignedToName: GenusType.type,
};

GenusSynonymListItem.defaultProps = {
  assignedToName: undefined,
};
