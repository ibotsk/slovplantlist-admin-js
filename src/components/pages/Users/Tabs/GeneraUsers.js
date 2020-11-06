import React from 'react';
import { connect } from 'react-redux';

import {
  Button, Glyphicon,
} from 'react-bootstrap';

import BootstrapTable from 'react-bootstrap-table-next';
import filterFactory, { textFilter } from 'react-bootstrap-table2-filter';

import PropTypes from 'prop-types';

import GeneraList from 'components/segments/GeneraList';

import config from 'config/config';

import commonHooks from 'components/segments/hooks';

import UsersGeneraModal from './Modals/UsersGeneraModal';

const getAllUri = config.uris.usersUri.getAllWGeneraUri;
const getCountUri = config.uris.usersUri.countUri;

const columns = [
  {
    dataField: 'id',
    text: 'ID',
  },
  {
    dataField: 'username',
    text: 'User Name',
    filter: textFilter(),
    sort: true,
  },
  {
    dataField: 'genera',
    text: 'Assigned Genera',
  },
];

const defaultSorted = [{
  dataField: 'username',
  order: 'asc',
}];

const GenusButtonAddEdit = ({ onClick }) => (
  <Button
    bsSize="small"
    onClick={onClick}
    title="Add or edit"
  >
    <Glyphicon glyph="plus" />
    /
    <Glyphicon glyph="pencil" />
  </Button>
);

const GeneraUsers = ({ accessToken }) => {
  const {
    showModal, editId,
    handleShowModal, handleHideModal,
  } = commonHooks.useModal();

  const {
    where, order, setValues,
  } = commonHooks.useTableChange();

  const { data } = commonHooks.useTableData(
    getCountUri, getAllUri, accessToken, where, 0,
    undefined, order, showModal,
  );

  const formatResult = (records) => records.map((u) => ({
    id: u.id,
    username: u.username,
    genera: (
      <div>
        <GeneraList key={u.id} data={u.genera} />
        <GenusButtonAddEdit onClick={() => handleShowModal(u.id)} />
      </div>
    ),
  }));

  const onTableChange = (type, {
    filters,
    sortField,
    sortOrder,
  }) => (
    setValues({
      filters,
      sortField,
      sortOrder,
    })
  );

  return (
    <div>
      <BootstrapTable
        hover
        striped
        condensed
        keyField="id"
        data={formatResult(data)}
        columns={columns}
        filter={filterFactory()}
        defaultSorted={defaultSorted}
        onTableChange={onTableChange}
      />
      <UsersGeneraModal
        user={data.find((u) => u.id === editId)}
        show={showModal}
        onHide={() => handleHideModal()}
      />
    </div>
  );
};

const mapStateToProps = (state) => ({
  accessToken: state.authentication.accessToken,
});

export default connect(mapStateToProps)(GeneraUsers);

GenusButtonAddEdit.propTypes = {
  onClick: PropTypes.func.isRequired,
};

GeneraUsers.propTypes = {
  accessToken: PropTypes.string.isRequired,
};
