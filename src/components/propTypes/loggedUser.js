import PropTypes from 'prop-types';

export default {
  type: PropTypes.shape({
    id: PropTypes.number.isRequired,
    role: PropTypes.string.isRequired,
    userGenera: PropTypes.arrayOf(PropTypes.number).isRequired,
  }),
};
