import React from 'react';
import { connect } from 'react-redux';

import {
  Grid, Button, Glyphicon,
} from 'react-bootstrap';

import filterFactory, { textFilter } from 'react-bootstrap-table2-filter';

import PropTypes from 'prop-types';
import LoggedUserType from 'components/propTypes/loggedUser';

import Can from 'components/segments/auth/Can';
import RemotePagination from 'components/segments/RemotePagination';

import config from 'config/config';

import commonHooks from 'components/segments/hooks';

import FamiliesModal from './Modals/FamiliesModal';

const getAllUri = config.uris.familiesUri.getAllWFilterUri;
const getCountUri = config.uris.familiesUri.countUri;

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
    filter: textFilter(),
    sort: true,
  },
  {
    dataField: 'vernacular',
    text: 'Vernacular',
    filter: textFilter(),
    sort: true,
  },
];

const defaultSorted = [{
  dataField: 'name',
  order: 'asc',
}];

const Families = ({ user, accessToken }) => {
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

  const formatResult = (records) => records.map((d) => ({
    id: d.id,
    action: (
      <Can
        role={user.role}
        perform="family:edit"
        yes={() => (
          <Button
            bsSize="xsmall"
            bsStyle="warning"
            onClick={() => handleShowModal(d.id)}
          >
            Edit
          </Button>
        )}
      />
    ),
    name: d.name,
    vernacular: d.vernacular,
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
    <div id="families">
      <Grid id="functions-panel">
        <div id="functions">
          <Can
            role={user.role}
            perform="family:edit"
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
        <h2>Families</h2>
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
      <FamiliesModal
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

export default connect(mapStateToProps)(Families);

Families.propTypes = {
  user: LoggedUserType.type.isRequired,
  accessToken: PropTypes.string.isRequired,
};
