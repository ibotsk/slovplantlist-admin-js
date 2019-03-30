import React from 'react';

import LosName from '../segments/LosName';
import TabledPage from './TabledPageParent';
import { ComponentsAvailable } from '../segments/Filter';

import config from '../../config/config';

const PAGE_DETAIL = "/checklist/detail/";
const searchFields = ["genus", "species", "genus", "species", "subsp", "var", "subvar", "forma",
    "nothosubsp", "nothoforma", "authors", "genus_h", "species_h", "subsp_h", "var_h", "subvar_h", "forma_h",
    "nothosubsp_h", "nothoforma_h", "authors_h", "publication", "tribus", "vernacular"];
const tableHeader = ["ID", "Type", "Name", "Publication", "Accepted name"];

const formatResult = (result) => {
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

const Checklist = (props) => {

    return (
        <div id='checklist'>
            <h2>Checklist</h2>
            {props.children}
        </div>
    )

}

export default TabledPage({ 
    getAll: config.uris.nomenclaturesUri.getAll, 
    getCount: config.uris.nomenclaturesUri.count, 
    tableHeader,
    searchFields,
    formatResult,
    filterInclude: [ ComponentsAvailable.ownership, ComponentsAvailable.ntypes, ComponentsAvailable.searchfield ]
})(Checklist);
