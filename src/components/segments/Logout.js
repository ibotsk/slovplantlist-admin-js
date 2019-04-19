import React from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router';

import { unsetAuthenticated } from '../../actions/index';
import { removeState } from '../../services/local-storage';
import userServiceModule from '../../services/user-service';

class Logout extends React.Component {

    constructor(props) {
        super(props);

        this.userService = userServiceModule(this.props.accessToken);
    }

    async componentWillMount() {
        await this.userService.logout();
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