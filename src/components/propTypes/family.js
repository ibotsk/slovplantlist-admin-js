import PropTypes from 'prop-types';

export default {
  type: PropTypes.exact({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    vernacular: PropTypes.string,
  }),
};
