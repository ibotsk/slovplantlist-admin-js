import React from 'react';
import { connect } from 'react-redux';

import {
    Grid, Button, Glyphicon
} from 'react-bootstrap';

import BootstrapTable from 'react-bootstrap-table-next';
import filterFactory, { textFilter } from 'react-bootstrap-table2-filter';

import TabledPage from '../wrappers/TabledPageParent';
import FamiliesApgModal from '../segments/FamiliesApgModal';

import config from '../../config/config';

const MODAL_FAMILY_APG = 'showModalFamilyApg';

const columns = [
    {
        dataField: 'id',
        text: 'ID',
        sort: true
    },
    {
        dataField: 'action',
        text: 'Actions'
    },
    {
        dataField: 'name',
        text: 'Name',
        filter: textFilter(),
        sort: true
    },
    {
        dataField: 'vernacular',
        text: 'Vernacular',
        filter: textFilter(),
        sort: true
    }
];

const defaultSorted = [{
    dataField: 'name',
    order: 'asc'
}];

class FamiliesAPG extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            [MODAL_FAMILY_APG]: false,
            editId: 0
        }
    }

    showModal = id => {
        this.setState({
            [MODAL_FAMILY_APG]: true,
            editId: id
        });
    }

    hideModal = () => {
        this.props.onTableChange(undefined, { page: this.props.paginationOptions.page, sizePerPage: this.props.paginationOptions.sizePerPage, filters: {} });
        this.setState({ [MODAL_FAMILY_APG]: false });
    }

    formatResult = data => {
        return data.map(d => ({
            id: d.id,
            action: <Button bsSize='xsmall' bsStyle="warning" onClick={() => this.showModal(d.id)}>Edit</Button>,
            name: d.name,
            vernacular: d.vernacular
        }));
    }

    render() {
        return (
            <div id='families-apg'>
                <Grid id='functions-panel'>
                    <div id="functions">
                        <Button bsStyle="success" onClick={() => this.showModal('')}><Glyphicon glyph="plus"></Glyphicon> Add new</Button>
                    </div>
                    <h2>Families APG</h2>
                    <p>All filters are case sensitive</p>
                </Grid>
                <Grid fluid={true}>
                    <BootstrapTable hover striped condensed
                        keyField='id'
                        data={this.formatResult(this.props.data)}
                        columns={columns}
                        defaultSorted={defaultSorted}
                        filter={filterFactory()}
                        onTableChange={this.props.onTableChange}
                    />
                </Grid>
                <FamiliesApgModal id={this.state.editId} show={this.state[MODAL_FAMILY_APG]} onHide={this.hideModal} />
            </div>
        );
    }
}

const mapStateToProps = state => ({
    accessToken: state.authentication.accessToken
});

export default connect(mapStateToProps)(
    TabledPage({
        getAll: config.uris.familiesApgUri.getAllWOrderUri,
        getCount: config.uris.familiesApgUri.countUri,
    })(FamiliesAPG)
);
