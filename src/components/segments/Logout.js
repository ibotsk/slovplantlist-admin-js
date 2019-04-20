import React from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router';

import { unsetAuthenticated } from '../../actions/index';
import { removeState } from '../../services/local-storage';
import userService from '../../services/user-service';

class Logout extends React.Component {

    async componentWillMount() {
        await userService.logout(this.props.accessToken);
        this.props.unsetAuthenticated();
        removeState();
    }

    render() {
        return <Redirect to="/" />;
    }

}

const mapStateToProps = state => ({
    accessToken: state.authentication.accessToken
});

export default connect(
    mapStateToProps,
    {
        unsetAuthenticated
    }
)(Logout);