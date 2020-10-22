import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router';

import PropTypes from 'prop-types';

import {
  unsetAuthenticated as unsetAuthenticatedAction,
} from 'actions/index';
import { removeState } from 'services/local-storage';
import { usersFacade } from 'facades';

const Logout = ({ accessToken, unsetAuthenticated }) => {
  useEffect(() => {
    async function doLogout() {
      await usersFacade.logout(accessToken);
      unsetAuthenticated();
      removeState();
    }

    doLogout();
  }, [accessToken, unsetAuthenticated]);

  return <Redirect to="/" />;
};

const mapStateToProps = (state) => ({
  accessToken: state.authentication.accessToken,
});

export default connect(mapStateToProps, {
  unsetAuthenticated: unsetAuthenticatedAction,
})(Logout);

Logout.propTypes = {
  accessToken: PropTypes.string.isRequired,
  unsetAuthenticated: PropTypes.func.isRequired,
};
