import React from 'react';

import TabledPage from './TabledPageParent';
import { ComponentsAvailable } from '../segments/Filter';

import config from '../../config/config';

const tableHeader = ["ID", "Name", "Vernacular"];
const searchFields = ["name", "vernacular"];

const Families = (props) => {

    return (
        <div id='families'>
            <h2>Families</h2>
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
    getAll: config.uris.familiesUri.getAll, 
    getCount: config.uris.familiesUri.count, 
    tableHeader,
    searchFields,
    formatResult,
    filterInclude: [ ComponentsAvailable.searchfield ]
})(Families);
