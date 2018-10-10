import React, { Component } from 'react';
import axios from 'axios';
import CTable from './CTable';

import helper from '../utils/helper';

class Checklist extends Component {

    state = {
        nomenclature: []
    };

    componentDidMount() {
        axios.get('http://localhost:3001/api/nomenclatures?filter={"limit":5}').then(response => {
            const noms = response.data.map(d => {
                return {
                    id: d.id,
                    type: d.ntype,
                    name: helper.listOfSpieces(d, {italic: true}) ,
                    publication: d.publication,
                    acceptedName: ''
                }
            });
            
            const newState = Object.assign({}, this.state, {
                nomenclature: noms
            });

            // store the new state object in the component's state
            this.setState(newState);
        }).catch(e => console.error(e));
    }

    render() {
        const header = ["ID", "Type", "Name", "Publication", "Accepted name"];
        return (
            <CTable head={header} rows={this.state.nomenclature} />
        );
    }
}

export default Checklist;