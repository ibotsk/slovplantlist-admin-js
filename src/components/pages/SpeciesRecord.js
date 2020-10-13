import React from 'react';
import { connect } from 'react-redux';

import Can from '../segments/auth/Can';
import SpeciesRecordEdit from './SpeciesRecordEdit';
import SpeciesRecordView from './SpeciesRecordView';

import speciesFacade from '../../facades/species';

class SpeciesRecord extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            idGenus: undefined
        }
    }

    async componentDidMount() {
        const { params: { id } } = this.props.match;
        const accessToken = this.props.accessToken;
        const { id_genus: idGenus } = await speciesFacade.getSpeciesById({ id, accessToken });
        this.setState({
            idGenus
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
                    userGeneraIds: userGenera
                }}
                yes={() => <SpeciesRecordEdit recordId={params.id} />}
                no={() => <SpeciesRecordView recordId={params.id} />}
            />
        );
    }
};

const mapStateToProps = state => ({
    accessToken: state.authentication.accessToken,
    user: state.user
});

export default connect(mapStateToProps)(SpeciesRecord);