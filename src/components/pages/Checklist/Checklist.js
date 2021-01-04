import React from 'react';
import { connect } from 'react-redux';

import {
  Grid, Row, Col,
  Button, Glyphicon,
} from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';

import filterFactory, {
  textFilter, multiSelectFilter, selectFilter, Comparator,
} from 'react-bootstrap-table2-filter';

import PropTypes from 'prop-types';
import LoggedUserType from 'components/propTypes/loggedUser';

import LosName from 'components/segments/Checklist/LosName';
import Can from 'components/segments/auth/Can';
import Ownership from 'components/segments/auth/Ownership';
import RemotePagination from 'components/segments/RemotePagination';

import config from 'config/config';
import { helperUtils } from 'utils';

import commonHooks from 'components/segments/hooks';

import SpeciesNameModal from './Modals/SpeciesNameModal';

const PAGE_DETAIL = '/checklist/detail/';
const EDIT_RECORD = '/checklist/edit/';
const NEW_RECORD = '/checklist/new';

const {
  constants: { listOfSpeciesColumn, ownership: ownershipColumn },
  mappings,
} = config;

const ntypesOptions = helperUtils.buildFilterOptionsFromKeys(mappings.losType);
const ownershipOptionsAdmin = helperUtils.buildFilterOptionsFromKeys(
  mappings.ownership,
);
const { unassigned, others, ...ownershipOptionsAuthor } = ownershipOptionsAdmin;

const getAllUri = config.uris.nomenclatureOwnersUri.getAllWFilterUri;
const getCountUri = config.uris.nomenclatureOwnersUri.countUri;

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

const Checklist = ({ user, accessToken }) => {
  const {
    showModal, editId,
    handleShowModal, handleHideModal,
  } = commonHooks.useModal();

  const ownerId = user ? user.id : undefined;
  const {
    page, sizePerPage, where, order, setValues,
  } = commonHooks.useTableChange(ownerId, 1);

  const { data, totalSize } = commonHooks.useTableData(
    getCountUri, getAllUri, accessToken, where, page,
    sizePerPage, order, showModal,
  );

  const rowEvents = {
    onDoubleClick: (e, row) => {
      if (user.role === mappings.userRole.author.name
        && !user.userGenera.includes(row.idGenus)) {
        return null;
      }
      return handleShowModal(row.id);
    },
  };

  const formatResult = (records) => records.map((d) => ({
    id: d.id,
    action: (
      <Can
        role={user.role}
        perform="species:edit"
        data={{
          speciesGenusId: d.idGenus,
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
          speciesGenusId: d.idGenus,
          userGeneraIds: user.userGenera,
        }}
        yes={() => (
          <Ownership role={user.role} isOwner owners={d.ownerNames} />
        )}
        no={() => (
          <Ownership
            role={user.role}
            isOwner={false}
            owners={d.ownerNames}
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
            speciesGenusId: d.idGenus,
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
    idGenus: d.idGenus,
  }));

  const onTableChange = (type, {
    page: pageTable,
    sizePerPage: sizePerPageTable,
    filters,
    sortField,
    sortOrder,
  }) => (
    setValues({
      page: pageTable,
      sizePerPage: sizePerPageTable,
      filters,
      sortField,
      sortOrder,
    })
  );

  const paginationOptions = { page, sizePerPage, totalSize };

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
                    onClick={() => handleShowModal(undefined)}
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
        <RemotePagination
          hover
          striped
          condensed
          remote
          keyField="id"
          data={formatResult(data)}
          columns={columns(user.role === mappings.userRole.author.name)}
          defaultSorted={defaultSorted}
          filter={filterFactory()}
          onTableChange={onTableChange}
          paginationOptions={paginationOptions}
          rowEvents={rowEvents}
        />
      </Grid>
      <SpeciesNameModal
        id={editId}
        show={showModal}
        onHide={() => handleHideModal()}
      />
    </div>
  );
};

const mapStateToProps = (state) => ({
  accessToken: state.authentication.accessToken,
  user: state.user,
});

export default connect(mapStateToProps)(Checklist);

Checklist.propTypes = {
  user: LoggedUserType.type.isRequired,
  accessToken: PropTypes.string.isRequired,
};
