import React from 'react';

import PropTypes from 'prop-types';
import GenusType from 'components/propTypes/genus';

import { helperUtils } from 'utils';

const tooltipText = (currentAN, newAN) => (
  `This synonym is currently assigned to accepted name '${currentAN}'.
  After save it will be ressigned to '${newAN}'.`
);

/**
 * @param {object} props currentAccepted - accepted name currently assigned to a genus
 * newAccepted - accepted name to which the genus will be reassigned
 * if they match, no warning is shown
 */
const AcceptedNameWarning = ({ className, currentAccepted, newAccepted }) => {
  if (!currentAccepted) {
    return null;
  }
  const currentAN = helperUtils.genusString(currentAccepted);
  const newAN = helperUtils.genusString(newAccepted);

  if (currentAN === newAN) {
    return null;
  }

  return (
    <span className={className}>
      <small>
        <span className="text-warning">
          <abbr
            title={tooltipText(currentAN, newAN)}
          >
            {currentAN}
          </abbr>
        </span>
      </small>
    </span>
  );
};

export default AcceptedNameWarning;

AcceptedNameWarning.propTypes = {
  className: PropTypes.string,
  currentAccepted: GenusType.type,
  newAccepted: GenusType.type,
};

AcceptedNameWarning.defaultProps = {
  className: undefined,
  currentAccepted: undefined,
  newAccepted: undefined,
};
