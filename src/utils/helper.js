import React from 'react';
import config from '../config/config';

const relocateSL = (string) => {

    const sl = config.nomenclature.name.sl;
    if (string.includes(sl)) {
        let modString = string.replace(sl, '');
        return `${modString} ${sl}`;
    }
    return string;
}

const it = (string, isItalic) => {
    if (isItalic) {
        return <i>{string}</i>;
    }
    return string;
}

const listOfSpieces = (nomenclature, opts = {}) => {

    const options = Object.assign({}, opts, {
        italic: false
    });

    const isItalic = options.italic
    let name = it(`${nomenclature.genus} ${nomenclature.species}`, isItalic);    

    return name;

}

export default { listOfSpieces };