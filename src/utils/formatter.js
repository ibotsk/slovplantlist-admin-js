import React from 'react';
import helper from './helper';

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

export default { format, losToTypeaheadSelected };