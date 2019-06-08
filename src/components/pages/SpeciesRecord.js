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
            recordId: undefined,
            id_genus: undefined
        }
    }

    async componentDidMount() {
        const id = this.props.match.params.id;
        const accessToken = this.props.accessToken;
        const { id_genus } = await speciesFacade.getSpeciesById({ id, accessToken });
        this.setState({
            recordId: id,
            id_genus
        });
    }

    render() {
        if (!this.state.recordId) {
            return null;
        }
        return (
            <Can
                role={this.props.user.role}
                perform="species:edit"
                data={{
                    speciesGenusId: this.state.id_genus,
                    userGeneraIds: this.props.user.userGenera
                }}
                yes={() => <SpeciesRecordEdit recordId={this.state.recordId} />}
                no={() => <SpeciesRecordView recordId={this.state.recordId} />}
            />
        );
    }
};

const mapStateToProps = state => ({
    accessToken: state.authentication.accessToken,
    user: state.user
});

export default connect(mapStateToProps)(SpeciesRecord);