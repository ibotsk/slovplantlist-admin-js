import React, { Component } from 'react';
import { Grid } from 'react-bootstrap';
import axios from 'axios';
import template from 'url-template';

import CPaginator from '../segments/CPaginator';
import CTable from '../segments/CTable';

import config from '../../config/config';

class Genera extends Component {

    getAllUri = template.parse(config.uris.generaUri.getAll);
    getCountUri = template.parse(config.uris.generaUri.count);

    state = {
        records: [],
        numOfRecords: 0,
        activePage: 1,
        where: {}
    };

    handlePageChange(activePage) {
        this.handleChange(activePage, this.state.where);
        this.setState({ activePage: activePage });
    }

    handleChange(activePage, where) {
        return this.fetchCount(where).then(() => {
            const page = Math.max(activePage - 1, 0);
            const limit = config.format.recordsPerPage;
            const offset = page * limit;
            return this.fetchRecords(where, offset, limit);
        }).then(response => {
            const noms = this.formatResult(response);
            this.setState({ records: noms });
        }).catch(e => console.error(e));
    }

    formatResult(result) {
        return result.data.map(d => {
            return {
                id: d.id,
                name: d.name,
                authors: d.authors,
                vernacular: d.vernacular,
                familyAPG: "",
                family: ""
            }
        });
    }

    fetchRecords(where, offset, limit) {
        const uri = this.getAllUri.expand({ offset: offset, where: JSON.stringify(where), limit: limit});
        return axios.get(uri);
    }

    fetchCount(where) {
        const whereString = JSON.stringify(where);
        const uri = this.getCountUri.expand({ base: config.uris.backendBase, whereString: whereString });
        return axios.get(uri).then(response => this.setState({ numOfRecords: response.data.count }));
    }

    componentDidMount() {
        this.handleChange(this.state.activePage, this.state.where);
    }

    render() {
        const header = ["ID", "Name", "Authors", "Vernacular", "Family APG", "Family"];
        return (
            <div id="checklist">
                <Grid fluid={true}>
                    <CPaginator
                        totalItems={this.state.numOfRecords}
                        recordsPerPage={config.format.recordsPerPage}
                        displayRange={config.format.rangeDisplayed}
                        numOfElementsAtEnds={config.format.numOfElementsAtEnds}
                        onHandleSelect={(activePage) => this.handlePageChange(activePage)}
                    />
                    <CTable head={header} rows={this.state.records} />
                </Grid>
            </div>
        );
    }

}

export default Genera;
