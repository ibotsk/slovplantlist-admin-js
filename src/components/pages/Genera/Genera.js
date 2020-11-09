import React, { useState } from 'react';
import { connect } from 'react-redux';

import {
  Grid, Button, Glyphicon,
} from 'react-bootstrap';

import filterFactory, {
  textFilter, multiSelectFilter, Comparator,
} from 'react-bootstrap-table2-filter';
import cellEditFactory from 'react-bootstrap-table2-editor';

import PropTypes from 'prop-types';
import LoggedUserType from 'components/propTypes/loggedUser';

import RemotePagination from 'components/segments/RemotePagination';
import Can from 'components/segments/auth/Can';

import config from 'config/config';
import {
  formatterUtils, helperUtils, notifications, miscUtils,
} from 'utils';

import commonHooks from 'components/segments/hooks';
import { genusFacade } from 'facades';

import GeneraModal from './Modals/GeneraModal';

const { mappings: { losType: { A, S } } } = config;
const ntypesOptions = helperUtils.buildOptionsFromKeys({ A, S });

const getAllUri = config.uris.generaUri.getAllWFilterUri;
const getCountUri = config.uris.generaUri.countUri;

const columns = [
  {
    dataField: 'id',
    text: 'ID',
    sort: true,
    editable: false,
  },
  {
    dataField: 'action',
    text: 'Actions',
    editable: false,
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
    editable: false,
  },
  {
    dataField: 'family',
    text: 'Family',
    editable: false,
  },
  {
    dataField: 'acceptedName',
    text: 'Accepted name',
    editable: false,
  },
];

const defaultSorted = [{
  dataField: 'name',
  order: 'asc',
}];

const formatResult = (records, userRole, handleShowModal) => (
  records.map((g) => ({
    id: g.id,
    action: (
      <Can
        role={userRole}
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
    ntype: g.ntype,
    name: g.name,
    authors: g.authors,
    vernacular: g.vernacular,
    familyApg: g['family-apg'] ? g['family-apg'].name : '',
    family: g.family ? g.family.name : '',
    acceptedName: g.accepted
      ? formatterUtils.genus(g.accepted.name, g.accepted.authors)
      : '',
  }))
);

const Genera = ({ user, accessToken }) => {
  const [forceChange, setForceChange] = useState(false);

  const {
    showModal, editId, handleShowModal, handleHideModal,
  } = commonHooks.useModal();

  const ownerId = user ? user.id : undefined;
  const {
    page, sizePerPage, where, order, setValues,
  } = commonHooks.useTableChange(ownerId, 1);

  const forceFetch = miscUtils.boolsToStr(showModal, forceChange);

  const { data, totalSize } = commonHooks.useTableData(
    getCountUri, getAllUri, accessToken, where, page,
    sizePerPage, order, forceFetch,
  );

  const onTableChange = (type, {
    page: pageTable,
    sizePerPage: sizePerPageTable,
    filters,
    sortField,
    sortOrder,
    cellEdit = {},
  }) => {
    const { rowId, dataField, newValue } = cellEdit;
    const patch = async () => {
      try {
        if (rowId && dataField && newValue) {
          await genusFacade.patchGenus(rowId, dataField, newValue, accessToken);
          setForceChange(!forceChange);
        }

        setValues({
          page: pageTable,
          sizePerPage: sizePerPageTable,
          filters,
          sortField,
          sortOrder,
        });
      } catch (error) {
        notifications.error('Error saving');
        throw error;
      }
    };

    patch();
  };

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
          data={formatResult(data, user.role, handleShowModal)}
          columns={columns}
          defaultSorted={defaultSorted}
          filter={filterFactory()}
          onTableChange={onTableChange}
          paginationOptions={paginationOptions}
          cellEdit={cellEditFactory({ mode: 'dbclick' })}
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
