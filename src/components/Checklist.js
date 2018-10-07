import React, { Component } from 'react';
import axios from 'axios';
import CTable from './CTable';

class Checklist extends Component {

    state = {
        nomenclature: []
    };

    componentDidMount() {
        axios.get('http://localhost:3001/api/nomenclatures?filter={"limit":5}').then(response => {
            const noms = response.data.map(d => {
                return {
                    id: d.id,
                    genus: d.genus,
                    species: d.species,
                    type: d.ntype
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
        return (
            <CTable rows={this.state.nomenclature} />
        );
    }
}

export default Checklist;