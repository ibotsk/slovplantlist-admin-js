import React from 'react';

import PropTypes from 'prop-types';

import { helperUtils } from 'utils';

const GenusName = ({ data }) => (
  <span>{helperUtils.genusString(data)}</span>
);

export default GenusName;

GenusName.propTypes = {
  data: PropTypes.shape({
    name: PropTypes.string.isRequired,
    authors: PropTypes.string,
  }),
};

GenusName.defaultProps = {
  data: undefined,
};
