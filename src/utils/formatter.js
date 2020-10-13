import React from 'react';
import helper from './helper';
import config from '../config/config';

const italic = (subject) => {
    return <i>{subject}</i>;
}

const format = (subject, format) => {
    switch (format) {
        case 'italic': return italic(subject);
        default: return subject;
    }
}

const losToTypeaheadSelected = data => {
    if (!data) {
        return undefined;
    }
    return [{ 
        id: data.id, 
        label: helper.listOfSpeciesString(data) 
    }];
}

const userRole = (roles) => {
    if (!roles || roles.length === 0) {
        return undefined;
    }
    return roles.map((r, i) => {
        const mappedRole = config.mappings.userRole[r.name];
        return [
            i > 0 && ", ",
            <span key={r.name} style={{ color: mappedRole.colour }}>{mappedRole.text}</span>
        ]
    });
}

export default { 
    format, 
    losToTypeaheadSelected,
    userRole
};