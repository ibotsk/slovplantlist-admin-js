import React, { Component } from 'react';
import axios from 'axios';
import CTable from './CTable';
import LosName from './LosName';

class Checklist extends Component {

    state = {
        nomenclature: []
    };

    componentDidMount() {
        axios.get('http://localhost:3001/api/nomenclatures?filter={"limit":50,"include":"accepted"}').then(response => {
            const noms = response.data.map(d => {
                return {
                    id: d.id,
                    type: d.ntype,
                    name: <LosName key={d.id} nomen={d} format='plain' />,
                    publication: d.publication,
                    acceptedName: <LosName key={`acc${d.id}`} nomen={d.accepted} format='plain' />
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