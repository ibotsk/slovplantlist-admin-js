import React from 'react';

import TabledPage from './TabledPageParent';
import { ComponentsAvailable } from '../segments/Filter';

import config from '../../config/config';

const tableHeader = ["ID", "Name", "Authors", "Vernacular", "Family APG", "Family"];
const searchFields = ["name", "authors", "vernacular"];

const Genera = (props) => {

    return (
        <div id='genera'>
            <h2>Genera</h2>
            {props.children}
        </div>
    )

}

const formatResult = (result) => {
    return result.data.map(d => {
        return {
            id: d.id,
            name: d.name,
            authors: d.authors,
            vernacular: d.vernacular,
            familyAPG: d.familyApg ? d.familyApg.name : "",
            family: d.family ? d.family.name : ""
        }
    });
}

export default TabledPage({ 
    getAll: config.uris.generaUri.getAll, 
    getCount: config.uris.generaUri.count, 
    tableHeader,
    searchFields,
    formatResult,
    filterInclude: [ ComponentsAvailable.searchfield ]
})(Genera);
