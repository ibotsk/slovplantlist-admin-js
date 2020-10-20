import React from 'react';
import { connect } from 'react-redux';

import {
  Grid, Row, Col,
  Button, Glyphicon,
} from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';

import BootstrapTable from 'react-bootstrap-table-next';
import filterFactory, {
  textFilter, multiSelectFilter, selectFilter, Comparator,
} from 'react-bootstrap-table2-filter';
import paginationFactory from 'react-bootstrap-table2-paginator';

import PropTypes from 'prop-types';
import LoggedUserType from 'components/propTypes/loggedUser';
import SpeciesType from 'components/propTypes/species';

import LosName from 'components/segments/Checklist/LosName';
import TabledPage from 'components/wrappers/TabledPageParent';
import Can from 'components/segments/auth/Can';
import Ownership from 'components/segments/auth/Ownership';

import config from 'config/config';
import { helperUtils } from 'utils';

import SpeciesNameModal from './Modals/SpeciesNameModal';

const PAGE_DETAIL = '/checklist/detail/';
const EDIT_RECORD = '/checklist/edit/';
const NEW_RECORD = '/checklist/new';

const {
  constants: { listOfSpeciesColumn, ownership: ownershipColumn },
  mappings,
} = config;

const ntypesOptions = helperUtils.buildOptionsFromKeys(mappings.losType);
const ownershipOptionsAdmin = helperUtils.buildOptionsFromKeys(
  mappings.ownership,
);
const { unassigned, others, ...ownershipOptionsAuthor } = ownershipOptionsAdmin;

const columns = (isAuthor) => [
  {
    dataField: 'id',
    text: 'ID',
    sort: true,
  },
  {
    dataField: 'action',
    text: 'Action',
  },
  {
    dataField: ownershipColumn,
    text: 'Ownership',
    filter: selectFilter({
      options: isAuthor ? ownershipOptionsAuthor : ownershipOptionsAdmin,
      defaultValue: ownershipOptionsAdmin.all,
      withoutEmptyOption: true,
    }),
  },
  {
    dataField: 'ntype',
    text: 'Type',
    filter: multiSelectFilter({
      options: ntypesOptions,
      comparator: Comparator.EQ,
    }),
    sort: true,
  },
  {
    dataField: listOfSpeciesColumn,
    text: 'Name',
    filter: textFilter({ caseSensitive: true }),
    sort: true,
  },
  {
    dataField: 'publication',
    text: 'Publication',
    filter: textFilter({ caseSensitive: true }),
    sort: true,
  },
  {
    dataField: 'acceptedName',
    text: 'Accepted name',
  },
];

const defaultSorted = [{
  dataField: 'id',
  order: 'asc',
}];

class Checklist extends React.Component {
  rowEvents = {
    onDoubleClick: (e, row) => {
      const { user } = this.props;

      if (user.role === mappings.userRole.author.name
        && !user.userGenera.includes(row.idGenus)) {
        return null;
      }
      return this.showModal(row.id);
    },
  };

  constructor(props) {
    super(props);

    this.state = {
      showModalSpecies: false,
      editId: 0,
    };
  }

  showModal = (id) => {
    this.setState({
      showModalSpecies: true,
      editId: id,
    });
  }

  hideModal = () => {
    const {
      onTableChange, paginationOptions, filters, sorting,
    } = this.props;

    onTableChange(undefined, {
      page: paginationOptions.page,
      sizePerPage: paginationOptions.sizePerPage,
      filters,
      sortField: sorting.sortField,
      sortOrder: sorting.sortOrder,
    });
    this.setState({ showModalSpecies: false });
  }

  formatResult = (data) => data.map((d) => {
    const { user } = this.props;

    return {
      id: d.id,
      action: (
        <Can
          role={user.role}
          perform="species:edit"
          data={{
            speciesGenusId: d.id_genus,
            userGeneraIds: user.userGenera,
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
          role={user.role}
          perform="species:edit"
          data={{
            speciesGenusId: d.id_genus,
            userGeneraIds: user.userGenera,
          }}
          yes={() => (
            <Ownership role={user.role} isOwner owners={d.owner_names} />
          )}
          no={() => (
            <Ownership
              role={user.role}
              isOwner={false}
              owners={d.owner_names}
            />
          )}
        />
      ),
      ntype: d.ntype,
      [listOfSpeciesColumn]: (
        <span>
          <a href={`${PAGE_DETAIL}${d.id}`}>
            <LosName key={d.id} data={d} />
          </a>
          <Can
            role={user.role}
            perform="species:edit"
            data={{
              speciesGenusId: d.id_genus,
              userGeneraIds: user.userGenera,
            }}
            yes={() => (
              <small className="pull-right gray-text unselectable">
                Double click to quick edit
              </small>
            )}
          />
        </span>
      ),
      publication: d.publication,
      acceptedName: (
        <a
          href={d.accepted ? `${PAGE_DETAIL}${d.accepted.id}` : ''}
        >
          <LosName key={`acc${d.id}`} data={d.accepted} />
        </a>
      ),
      idGenus: d.id_genus,
    };
  });

  render() {
    const {
      user, data, onTableChange, paginationOptions,
    } = this.props;
    const { editId, showModalSpecies } = this.state;

    return (
      <div id="checklist">
        <Grid id="functions-panel">
          <div id="functions">
            <Can
              role={user.role}
              perform="checklist:add"
              yes={() => (
                <Row>
                  <Col md={2}>
                    <Button
                      bsStyle="success"
                      onClick={() => this.showModal('')}
                    >
                      <Glyphicon glyph="plus" />
                      {' '}
                      Add new quick
                    </Button>
                  </Col>
                  <Col md={2}>
                    <LinkContainer to={NEW_RECORD}>
                      <Button bsStyle="success">
                        <Glyphicon glyph="plus" />
                        {' '}
                        Add new full
                      </Button>
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
            <small>
              * A = Accepted, PA = Provisionally accepted, S = Synonym,
              {' '}
              DS = Doubtful synonym, U = Unresolved
            </small>
          </div>
        </Grid>
        <Grid fluid>
          <BootstrapTable
            hover
            striped
            condensed
            remote={{ filter: true, pagination: true }}
            keyField="id"
            data={this.formatResult(data)}
            columns={columns(user.role === mappings.userRole.author.name)}
            defaultSorted={defaultSorted}
            filter={filterFactory()}
            onTableChange={onTableChange}
            pagination={paginationFactory(paginationOptions)}
            rowEvents={this.rowEvents}
          />
        </Grid>
        <SpeciesNameModal
          id={editId}
          show={showModalSpecies}
          onHide={this.hideModal}
        />
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  accessToken: state.authentication.accessToken,
  user: state.user,
});

export default connect(mapStateToProps)(
  TabledPage({
    getAll: config.uris.nomenclatureOwnersUri.getAllWFilterUri,
    getCount: config.uris.nomenclatureOwnersUri.countUri,
  })(Checklist),
);

Checklist.propTypes = {
  user: LoggedUserType.type.isRequired,
  data: PropTypes.arrayOf(SpeciesType.type).isRequired,
  onTableChange: PropTypes.func.isRequired,
  paginationOptions: PropTypes.shape({
    page: PropTypes.number.isRequired,
    sizePerPage: PropTypes.number.isRequired,
  }).isRequired,
  filters: PropTypes.objectOf(PropTypes.shape({
    caseSensitive: PropTypes.bool.isRequired,
    comparator: PropTypes.string.isRequired,
    filterType: PropTypes.string.isRequired,
    filterVal: PropTypes.oneOfType([
      PropTypes.array,
      PropTypes.string,
    ]).isRequired,
  })),
  sorting: PropTypes.shape({
    sortField: PropTypes.string,
    sortOrder: PropTypes.string,
  }),
};

Checklist.defaultProps = {
  filters: undefined,
  sorting: undefined,
};
