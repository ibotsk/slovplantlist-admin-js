import React from 'react';
import { connect } from 'react-redux';

import {
    Grid, Row, Col,
    Button, Glyphicon
} from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';

import BootstrapTable from 'react-bootstrap-table-next';
import filterFactory, { textFilter, multiSelectFilter, selectFilter, Comparator } from 'react-bootstrap-table2-filter';
import paginationFactory from 'react-bootstrap-table2-paginator';

import LosName from '../segments/LosName';
import SpeciesNameModal from '../segments/modals/SpeciesNameModal';
import TabledPage from '../wrappers/TabledPageParent';
import Can from '../segments/auth/Can';
import Ownership from '../segments/auth/Ownership';

import config from '../../config/config';
import helper from '../../utils/helper';

const PAGE_DETAIL = "/checklist/detail/";
const EDIT_RECORD = "/checklist/edit/";
const NEW_RECORD = "/checklist/new";

const listOfSpeciesColumn = config.constants.listOfSpeciesColumn;
const ownershipColumn = config.constants.ownership;
const ntypesOptions = helper.buildOptionsFromKeys(config.mappings.losType);
const ownershipOptionsAdmin = helper.buildOptionsFromKeys(config.mappings.ownership);
const { unassigned, others, ...ownershipOptionsAuthor } = ownershipOptionsAdmin;

const MODAL_SPECIES = 'showModalSpecies';

const columns = (isAuthor) => [
    {
        dataField: 'id',
        text: 'ID',
        sort: true
    },
    {
        dataField: 'action',
        text: 'Action'
    },
    {
        dataField: ownershipColumn,
        text: 'Ownership',
        filter: selectFilter({
            options: isAuthor ? ownershipOptionsAuthor : ownershipOptionsAdmin,
            defaultValue: ownershipOptionsAdmin.all,
            withoutEmptyOption: true
        })
    },
    {
        dataField: 'ntype',
        text: 'Type',
        filter: multiSelectFilter({
            options: ntypesOptions,
            comparator: Comparator.EQ
        }),
        sort: true
    },
    {
        dataField: listOfSpeciesColumn,
        text: 'Name',
        filter: textFilter({ caseSensitive: true }),
        sort: true
    },
    {
        dataField: 'publication',
        text: 'Publication',
        filter: textFilter({ caseSensitive: true }),
        sort: true
    },
    {
        dataField: 'acceptedName',
        text: 'Accepted name'
    }
];

const defaultSorted = [{
    dataField: 'id',
    order: 'asc'
}];

class Checklist extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            [MODAL_SPECIES]: false,
            editId: 0
        }
    }

    rowEvents = {
        onDoubleClick: (e, row, rowIndex) => {
            if (this.props.user.role === config.mappings.userRole.author.name
                && !this.props.user.userGenera.includes(row.idGenus)) {
                return null;
            }
            return this.showModal(row.id);
        }
    };

    showModal = id => {
        this.setState({
            [MODAL_SPECIES]: true,
            editId: id
        });
    }

    hideModal = () => {
        this.props.onTableChange(undefined, {
            page: this.props.paginationOptions.page,
            sizePerPage: this.props.paginationOptions.sizePerPage,
            filters: this.props.filters,
            sortField: this.props.sorting.sortField,
            sortOrder: this.props.sorting.sortOrder
        });
        this.setState({ [MODAL_SPECIES]: false });
    }

    formatResult = data => {
        return data.map(d => ({
            id: d.id,
            action: (
                <Can
                    role={this.props.user.role}
                    perform="species:edit"
                    data={{
                        speciesGenusId: d.id_genus,
                        userGeneraIds: this.props.user.userGenera
                    }}
                    yes={() => (
                        <LinkContainer to={`${EDIT_RECORD}${d.id}`}>
                            <Button bsStyle="warning" bsSize="xsmall">Edit</Button>
                        </LinkContainer>
                    )}
                />
            ),
            [ownershipColumn]: (
                <Can
                    role={this.props.user.role}
                    perform="species:edit"
                    data={{
                        speciesGenusId: d.id_genus,
                        userGeneraIds: this.props.user.userGenera
                    }}
                    yes={() => <Ownership role={this.props.user.role} isOwner={true} owners={d.owner_names} />}
                    no={() => <Ownership role={this.props.user.role} isOwner={false} owners={d.owner_names} />}
                />
            ),
            ntype: d.ntype,
            [listOfSpeciesColumn]: (
                <span>
                    <a href={`${PAGE_DETAIL}${d.id}`} >
                        <LosName key={d.id} data={d} />
                    </a>
                    <Can
                        role={this.props.user.role}
                        perform="species:edit"
                        data={{
                            speciesGenusId: d.id_genus,
                            userGeneraIds: this.props.user.userGenera
                        }}
                        yes={() => (
                            <small className="pull-right gray-text unselectable">Double click to quick edit</small>
                        )}
                    />
                </span>
            ),
            publication: d.publication,
            acceptedName: <a href={d.accepted ? `${PAGE_DETAIL}${d.accepted.id}` : ""}><LosName key={`acc${d.id}`} data={d.accepted} /></a>,
            idGenus: d.id_genus
        }));
    }

    render() {
        return (
            <div id='checklist'>
                <Grid id='functions-panel'>
                    <div id="functions">
                        <Can
                            role={this.props.user.role}
                            perform="checklist:add"
                            yes={() => (
                                <Row>
                                    <Col md={2}>
                                        <Button bsStyle="success" onClick={() => this.showModal('')}><Glyphicon glyph="plus"></Glyphicon> Add new quick</Button>
                                    </Col>
                                    <Col md={2}>
                                        <LinkContainer to={NEW_RECORD}>
                                            <Button bsStyle="success"><Glyphicon glyph="plus"></Glyphicon> Add new full</Button>
                                        </LinkContainer>
                                    </Col>
                                </Row>
                            )}
                        />
                    </div>
                </Grid>
                <hr />
                <Grid>
                    <h2>Checklist</h2>
                    <p>All filters are case sensitive</p>
                    <div>
                        <small>* A = Accepted, PA = Provisionally accepted, S = Synonym, DS = Doubtful synonym, U = Unresolved</small>
                    </div>
                </Grid>
                <Grid fluid={true}>
                    <BootstrapTable hover striped condensed
                        remote={{ filter: true, pagination: true }}
                        keyField='id'
                        data={this.formatResult(this.props.data)}
                        columns={columns(this.props.user.role === config.mappings.userRole.author.name)}
                        defaultSorted={defaultSorted}
                        filter={filterFactory()}
                        onTableChange={this.props.onTableChange}
                        pagination={paginationFactory(this.props.paginationOptions)}
                        rowEvents={this.rowEvents}
                    />
                </Grid>
                <SpeciesNameModal id={this.state.editId} show={this.state[MODAL_SPECIES]} onHide={this.hideModal} />
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
        getAll: config.uris.nomenclatureOwnersUri.getAllWFilterUri,
        getCount: config.uris.nomenclatureOwnersUri.countUri
    })(Checklist)
);