import React from 'react';

import TabledPage from './TabledPageParent';
import { ComponentsAvailable } from '../segments/Filter';

import config from '../../config/config';

const tableHeader = ["ID", "Name", "Vernacular"];
const searchFields = ["name", "vernacular"];

const FamiliesAPG = (props) => {

    return (
        <div id='families-apg'>
            <h2>Families APG</h2>
            {props.children}
        </div>
    )

}

const formatResult = (result) => {
    return result.data.map(d => {
        return {
            id: d.id,
            name: d.name,
            vernacular: d.vernacular
        }
    });
}

export default TabledPage({ 
    getAll: config.uris.familiesApgUri.getAll, 
    getCount: config.uris.familiesApgUri.count, 
    tableHeader,
    searchFields,
    formatResult,
    filterInclude: [ ComponentsAvailable.searchfield ]
})(FamiliesAPG);
