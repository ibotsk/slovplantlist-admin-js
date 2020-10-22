import React from 'react';
import { connect } from 'react-redux';

import PropTypes from 'prop-types';
import LoggedUserType from 'components/propTypes/loggedUser';

import Can from 'components/segments/auth/Can';

import { speciesFacade } from 'facades';

import SpeciesRecordEdit from './Components/SpeciesRecordEdit';
import SpeciesRecordView from './Components/SpeciesRecordView';

class SpeciesRecord extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      idGenus: undefined,
    };
  }

  async componentDidMount() {
    const { match: { params: { id } }, accessToken } = this.props;
    const { idGenus } = await speciesFacade.getSpeciesById(
      id, accessToken,
    );
    this.setState({
      idGenus,
    });
  }

  render() {
    const { user: { role, userGenera }, match: { params } } = this.props;
    const { idGenus } = this.state;
    return (
      <Can
        role={role}
        perform="species:edit"
        data={{
          speciesGenusId: idGenus,
          userGeneraIds: userGenera,
        }}
        yes={() => <SpeciesRecordEdit recordId={params.id} />}
        no={() => <SpeciesRecordView recordId={params.id} />}
      />
    );
  }
}

const mapStateToProps = (state) => ({
  accessToken: state.authentication.accessToken,
  user: state.user,
});

export default connect(mapStateToProps)(SpeciesRecord);

SpeciesRecord.propTypes = {
  accessToken: PropTypes.string.isRequired,
  user: LoggedUserType.type.isRequired,
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.string,
    }),
  }).isRequired,
};
