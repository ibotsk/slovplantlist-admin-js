import PropTypes from 'prop-types';

export default {
  type: PropTypes.shape({
    id: PropTypes.number.isRequired,
    email: PropTypes.string,
    emailVerified: PropTypes.bool,
    realm: PropTypes.string,
    roles: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
    })),
    genera: PropTypes.arrayOf(PropTypes.shape({

    })),
  }),
};
