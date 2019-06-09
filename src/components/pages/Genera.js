import React from 'react';
import { connect } from 'react-redux';

import {
    Grid, Button, Glyphicon
} from 'react-bootstrap';

import BootstrapTable from 'react-bootstrap-table-next';
import filterFactory, { textFilter } from 'react-bootstrap-table2-filter';
import paginationFactory from 'react-bootstrap-table2-paginator';

import TabledPage from '../wrappers/TabledPageParent';
import GeneraModal from '../segments/modals/GeneraModal';
import Can from '../segments/auth/Can';

import config from '../../config/config';

const MODAL_GENUS = 'showModalGenera';

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
        filter: textFilter({ caseSensitive: true }),
        sort: true
    },
    {
        dataField: 'authors',
        text: 'Authors',
        filter: textFilter({ caseSensitive: true }),
        sort: true
    },
    {
        dataField: 'vernacular',
        text: 'Vernacular',
        filter: textFilter({ caseSensitive: true }),
        sort: true
    },
    {
        dataField: 'familyAPG',
        text: 'Family APG'
    },
    {
        dataField: 'family',
        text: 'Family'
    },
];

const defaultSorted = [{
    dataField: 'name',
    order: 'asc'
}];

class Genera extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            [MODAL_GENUS]: false,
            editId: 0
        }
    }

    showModal = id => {
        this.setState({
            [MODAL_GENUS]: true,
            editId: id
        });
    }

    hideModal = () => {
        this.props.onTableChange(undefined, {
            page: this.props.paginationOptions.page,
            sizePerPage: this.props.paginationOptions.sizePerPage,
            filters: {},
            sortField: 'name',
            sortOrder: 'asc'
        });
        this.setState({ [MODAL_GENUS]: false });
    }

    formatResult = data => {
        return data.map(g => ({
            id: g.id,
            action: (
                <Can
                    role={this.props.user.role}
                    perform="genus:edit"
                    yes={() => (
                        <Button bsSize='xsmall' bsStyle="warning" onClick={() => this.showModal(g.id)}>Edit</Button>
                    )}
                />),
            name: g.name,
            authors: g.authors,
            vernacular: g.vernacular,
            familyAPG: g.familyApg ? g.familyApg.name : "",
            family: g.family ? g.family.name : ""
        }));
    }

    render() {
        return (
            <div id='genera'>
                <Grid id='functions-panel'>
                    <div id="functions">
                        <Can
                            role={this.props.user.role}
                            perform="genus:edit"
                            yes={() => (
                                <Button bsStyle="success" onClick={() => this.showModal('')}><Glyphicon glyph="plus"></Glyphicon> Add new</Button>
                            )}
                        />
                    </div>
                </Grid>
                <hr />
                <Grid>
                    <h2>Genera</h2>
                    <p>All filters are case sensitive</p>
                </Grid>
                <Grid fluid={true}>
                    <BootstrapTable hover striped condensed
                        remote={{ filter: true, pagination: true }}
                        keyField='id'
                        data={this.formatResult(this.props.data)}
                        columns={columns}
                        defaultSorted={defaultSorted}
                        filter={filterFactory()}
                        onTableChange={this.props.onTableChange}
                        pagination={paginationFactory(this.props.paginationOptions)}
                    />
                </Grid>
                <GeneraModal id={this.state.editId} show={this.state[MODAL_GENUS]} onHide={this.hideModal} />
            </div>
        );
    }
}

const mapStateToProps = state => ({
    accessToken: state.authentication.accessToken,
    user: state.user
});

export default connect(mapStateToProps)(
    TabledPage({
        getAll: config.uris.generaUri.getAllWFilterUri,
        getCount: config.uris.generaUri.countUri,
    })(Genera)
);
