import React from 'react';
import { connect } from 'react-redux';

import {
  Grid, Button, Glyphicon,
} from 'react-bootstrap';

import filterFactory, { textFilter } from 'react-bootstrap-table2-filter';

import PropTypes from 'prop-types';
import LoggedUserType from 'components/propTypes/loggedUser';

import RemotePagination from 'components/segments/RemotePagination';
import Can from 'components/segments/auth/Can';

import config from 'config/config';

import commonHooks from 'components/segments/hooks';

import GeneraModal from './Modals/GeneraModal';

const getAllUri = config.uris.generaUri.getAllWFilterUri;
const getCountUri = config.uris.generaUri.countUri;

const columns = [
  {
    dataField: 'id',
    text: 'ID',
    sort: true,
  },
  {
    dataField: 'action',
    text: 'Actions',
  },
  {
    dataField: 'name',
    text: 'Name',
    filter: textFilter({ caseSensitive: true }),
    sort: true,
  },
  {
    dataField: 'authors',
    text: 'Authors',
    filter: textFilter({ caseSensitive: true }),
    sort: true,
  },
  {
    dataField: 'vernacular',
    text: 'Vernacular',
    filter: textFilter({ caseSensitive: true }),
    sort: true,
  },
  {
    dataField: 'familyApg',
    text: 'Family APG',
  },
  {
    dataField: 'family',
    text: 'Family',
  },
];

const defaultSorted = [{
  dataField: 'name',
  order: 'asc',
}];

const Genera = ({ user, accessToken }) => {
  const {
    showModal, editId,
    handleShowModal, handleHideModal,
  } = commonHooks.useModal();

  const ownerId = user ? user.id : undefined;
  const {
    page, sizePerPage, where, order, setValues,
  } = commonHooks.useTableChange(ownerId, 1);

  const offset = (page - 1) * sizePerPage;

  const { data, totalSize } = commonHooks.useTableData(
    getCountUri, getAllUri, accessToken, where, offset,
    sizePerPage, order, showModal,
  );

  const formatResult = (records) => records.map((g) => ({
    id: g.id,
    action: (
      <Can
        role={user.role}
        perform="genus:edit"
        yes={() => (
          <Button
            bsSize="xsmall"
            bsStyle="warning"
            onClick={() => handleShowModal(g.id)}
          >
            Edit
          </Button>
        )}
      />),
    name: g.name,
    authors: g.authors,
    vernacular: g.vernacular,
    familyApg: g['family-apg'] ? g['family-apg'].name : '',
    family: g.family ? g.family.name : '',
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
    <div id="genera">
      <Grid id="functions-panel">
        <div id="functions">
          <Can
            role={user.role}
            perform="genus:edit"
            yes={() => (
              <Button
                bsStyle="success"
                onClick={() => handleShowModal(undefined)}
              >
                <Glyphicon glyph="plus" />
                {' '}
                Add new
              </Button>
            )}
          />
        </div>
      </Grid>
      <hr />
      <Grid>
        <h2>Genera</h2>
        <p>All filters are case sensitive</p>
      </Grid>
      <Grid fluid>
        <RemotePagination
          hover
          striped
          condensed
          remote
          keyField="id"
          data={formatResult(data)}
          columns={columns}
          defaultSorted={defaultSorted}
          filter={filterFactory()}
          onTableChange={onTableChange}
          paginationOptions={paginationOptions}
        />
      </Grid>
      <GeneraModal
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

export default connect(mapStateToProps)(Genera);

Genera.propTypes = {
  user: LoggedUserType.type.isRequired,
  accessToken: PropTypes.string.isRequired,
};
