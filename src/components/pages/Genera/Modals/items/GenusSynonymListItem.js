import React from 'react';

import PropTypes from 'prop-types';
import SynonymType from 'components/propTypes/synonym';

import SynonymListItem from 'components/segments/SynonymListItem';
import GenusName from 'components/segments/genera/GenusName';

import config from 'config/config';

const GenusSynonymListItem = ({
  rowId,
  data,
  onRowDelete,
}) => (
  <SynonymListItem
    rowId={rowId}
    data={data}
    nameComponent={GenusName}
    prefix={config.mappings.synonym.taxonomic.prefix}
    onRowDelete={onRowDelete}
  />
);

export default GenusSynonymListItem;

GenusSynonymListItem.propTypes = {
  rowId: PropTypes.number.isRequired,
  data: SynonymType.type.isRequired,
  onRowDelete: PropTypes.func.isRequired,
};
