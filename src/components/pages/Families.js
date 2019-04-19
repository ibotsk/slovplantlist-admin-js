import React from 'react';

import { 
    Grid, Button, Glyphicon
} from 'react-bootstrap';

import BootstrapTable from 'react-bootstrap-table-next';
import filterFactory, { textFilter } from 'react-bootstrap-table2-filter';

import TabledPage from '../wrappers/TabledPageParent';
import FamiliesModal from '../segments/FamiliesModal';

import config from '../../config/config';

const MODAL_FAMILY = 'showModalFamily';

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

class Families extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            [MODAL_FAMILY]: false,
            editId: 0
        }
    }

    showModal = id => {
        this.setState({
            [MODAL_FAMILY]: true,
            editId: id
        });
    }

    hideModal = () => {
        this.props.onTableChange(undefined, { page: this.props.paginationOptions.page, sizePerPage: this.props.paginationOptions.sizePerPage, filters: {} });
        this.setState({ [MODAL_FAMILY]: false });
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
            <div id='families'>
                <Grid id='functions-panel'>
                    <div id="functions">
                        <Button bsStyle="success" onClick={() => this.showModal('')}><Glyphicon glyph="plus"></Glyphicon> Add new</Button>
                    </div>
                    <h2>Families</h2>
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
                <FamiliesModal id={this.state.editId} show={this.state[MODAL_FAMILY]} onHide={this.hideModal} />
            </div>
        );
    }
}

export default TabledPage({
    getAll: config.uris.familiesUri.getAllWOrderUri,
    getCount: config.uris.familiesUri.countUri,
})(Families);
