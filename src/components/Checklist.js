import React, { Component } from 'react';
import { Grid, Well } from 'react-bootstrap';
import axios from 'axios';

import Filter from './Filter';
import CPaginator from './CPaginator';
import CTable from './CTable';
import LosName from './LosName';

import config from '../config/config';

const PAGE_DETAIL = "/checklist/detail/";
const searchFields = ["genus", "species", "genus", "species", "subsp", "var", "subvar", "forma",
    "nothosubsp", "nothoforma", "authors", "genus_h", "species_h", "subsp_h", "var_h", "subvar_h", "forma_h",
    "nothosubsp_h", "nothoforma_h", "authors_h", "publication", "tribus", "vernacular"];

class Checklist extends Component {

    state = {
        nomenclature: [],
        numOfRecords: 0,
        activePage: 1,
        where: {}
    };

    handlePageChange(activePage) {
        this.handleChange(activePage, this.state.where);
        this.setState({ activePage: activePage });
    }

    handleFilterChange(where) {
        this.handleChange(this.state.activePage, where);
        this.setState({ where: where });
    }

    handleChange(activePage, where) {
        return this.fetchCount(where).then(() => {
            const page = Math.max(activePage - 1, 0);
            const limit = config.format.recordsPerPage;
            const offset = page * limit;
            return this.fetchRecords(where, offset, limit);
        }).then(response => {
            const noms = this.formatResult(response);
            this.setState({ nomenclature: noms });
        }).catch(e => console.error(e));
    }

    formatResult(result) {
        return result.data.map(d => {
            return {
                id: d.id,
                type: d.ntype,
                name: <a href={`${PAGE_DETAIL}${d.id}`} ><LosName key={d.id} nomen={d} format='plain' /></a>,
                publication: d.publication,
                acceptedName: <a href={d.accepted ? `${PAGE_DETAIL}${d.accepted.id}` : ""}><LosName key={`acc${d.id}`} nomen={d.accepted} format='plain' /></a>
            }
        });
    }

    fetchRecords(where, offset, limit) {
        const uri = `http://localhost:3001/api/nomenclatures?filter={"offset":${offset},"where":${JSON.stringify(where)},"limit":${limit},"include":"accepted"}`;
        return axios.get(uri);
    }

    fetchCount(where) {
        const whereString = JSON.stringify(where);
        const uri = `http://localhost:3001/api/nomenclatures/count?where=${whereString}`;
        return axios.get(uri).then(response => this.setState({ numOfRecords: response.data.count }));
    }

    componentDidMount() {
        this.handleChange(this.state.activePage, this.state.where);
    }

    render() {
        const header = ["ID", "Type", "Name", "Publication", "Accepted name"];
        return (
            <div id="checklist">
                <Grid id="functions">
                    <Well>
                        <Filter
                            onHandleChange={(where) => this.handleFilterChange(where)}
                            searchFields={searchFields}
                            searchFieldMinLength={config.format.searchFieldMinLength}
                        />
                    </Well>
                </Grid>
                <Grid fluid={true}>
                    <CPaginator
                        totalItems={this.state.numOfRecords}
                        recordsPerPage={config.format.recordsPerPage}
                        displayRange={config.format.rangeDisplayed}
                        numOfElementsAtEnds={config.format.numOfElementsAtEnds}
                        onHandleSelect={(activePage) => this.handlePageChange(activePage)}
                    />
                    <CTable head={header} rows={this.state.nomenclature} />
                </Grid>
            </div>
        );
    }
}

export default Checklist;
