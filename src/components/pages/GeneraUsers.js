import React from 'react';
import { connect } from 'react-redux';

import {
    Button, Glyphicon
} from 'react-bootstrap';

import BootstrapTable from 'react-bootstrap-table-next';
import filterFactory, { textFilter } from 'react-bootstrap-table2-filter';

import TabledPage from '../wrappers/TabledPageParent';

import config from '../../config/config';
import GeneraList from '../segments/GeneraList';
import UsersGeneraModal from '../segments/modals/UsersGeneraModal';

const columns = [
    {
        dataField: 'id',
        text: 'ID'
    },
    {
        dataField: 'username',
        text: 'User Name',
        filter: textFilter(),
        sort: true
    },
    {
        dataField: 'genera',
        text: 'Assigned Genera'
    }
];

const defaultSorted = [{
    dataField: 'username',
    order: 'asc'
}];

const GenusButtonAddEdit = ({ onClick }) => {
    return (
        <Button
            bsSize='small'
            onClick={onClick}
            title='Add or edit'
        >
            <Glyphicon glyph="plus"></Glyphicon>/
            <Glyphicon glyph="pencil"></Glyphicon>
        </Button>
    );
}

class GeneraUsers extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            showModalUsersGenera: false,
            editId: undefined
        };
    }

    showModal = id => {
        this.setState({
            showModalUsersGenera: true,
            editId: id
        });
    }

    hideModal = () => {
        this.props.onTableChange(undefined, {
            page: this.props.paginationOptions.page,
            sizePerPage: this.props.paginationOptions.sizePerPage,
            filters: {},
            sortField: 'username',
            sortOrder: 'asc'
        });
        this.setState({ showModalUsersGenera: false });
    }

    formatResult = (data) => {
        return data.map(u => ({
            id: u.id,
            username: u.username,
            genera: (
                <div>
                    <GeneraList key={u.id} data={u.genera} /><GenusButtonAddEdit onClick={() => this.showModal(u.id)} />
                </div>
            )
        }));
    }

    render() {
        return (
            <div>
                <BootstrapTable hover striped condensed
                    keyField='id'
                    data={this.formatResult(this.props.data)}
                    columns={columns}
                    filter={filterFactory()}
                    defaultSorted={defaultSorted}
                    onTableChange={this.props.onTableChange}
                />
                <UsersGeneraModal
                    user={this.props.data.find(u => u.id === this.state.editId)}
                    show={this.state.showModalUsersGenera}
                    onHide={this.hideModal}
                />
            </div>
        );
    }

}

const mapStateToProps = state => ({
    accessToken: state.authentication.accessToken
});

export default connect(mapStateToProps)(
    TabledPage({
        getAll: config.uris.usersUri.getAllWGeneraUri,
        getCount: config.uris.usersUri.countUri,
    })(GeneraUsers)
);