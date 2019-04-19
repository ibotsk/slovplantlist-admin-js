import React from 'react';

import {
    Grid, Row, Col,
    Button, Glyphicon
} from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';

import BootstrapTable from 'react-bootstrap-table-next';
import filterFactory, { textFilter, multiSelectFilter, Comparator } from 'react-bootstrap-table2-filter';
import paginationFactory from 'react-bootstrap-table2-paginator';

import LosName from '../segments/LosName';
import TabledPage from '../wrappers/TabledPageParent';

import config from '../../config/config';
import helper from '../../utils/helper';
import SpeciesNameModal from '../segments/SpeciesNameModal';

const PAGE_DETAIL = "/checklist/detail/";
const EDIT_RECORD = "/checklist/edit/";
const NEW_RECORD = "/checklist/new";

const listOfSpeciesColumn = config.constants.listOfSpeciesColumn;
const ntypesOptions = helper.buildOptionsFromKeys(config.mappings.losType);

const MODAL_SPECIES = 'showModalSpecies';

const columns = [
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
            this.showModal(row.id);
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
                <LinkContainer to={`${EDIT_RECORD}${d.id}`}>
                    <Button bsStyle="warning" bsSize="xsmall">Edit</Button>
                </LinkContainer>
            ),
            ntype: d.ntype,
            [listOfSpeciesColumn]: (
                <span>
                    <a href={`${PAGE_DETAIL}${d.id}`} >
                        <LosName key={d.id} data={d} />
                    </a>
                    <small className="pull-right gray-text unselectable">Double click to quick edit</small>
                </span>
            ),
            publication: d.publication,
            acceptedName: <a href={d.accepted ? `${PAGE_DETAIL}${d.accepted.id}` : ""}><LosName key={`acc${d.id}`} data={d.accepted} /></a>
        }));
    }

    render() {
        return (
            <div id='checklist'>
                <Grid id='functions-panel'>
                    <div id="functions">
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
                    </div>
                    <h2>Checklist</h2>
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
                        rowEvents={this.rowEvents}
                    />
                </Grid>
                <SpeciesNameModal id={this.state.editId} show={this.state[MODAL_SPECIES]} onHide={this.hideModal} />
            </div>
        );
    }
}

export default TabledPage({
    getAll: config.uris.nomenclaturesUri.getAllWFilterUri,
    getCount: config.uris.nomenclaturesUri.countUri
})(Checklist);