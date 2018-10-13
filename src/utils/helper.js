import React from 'react';
import config from '../config/config';

const config_name = config.nomenclature.name;

const sl = (string) => {

    const sl = config_name.sl;
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

const subspecies = (subsp, isItalic = false) => {
    if (isItalic) {
        subsp = subsp.replace(/(?!(?:\[unranked\]|proles)$)(\w+)$/g, <i>{"$1"}</i>);
    }
    if (subsp.includes(config_name.proles) || subsp.includes(config_name.unranked)) {
        return ` ${subsp}`;
    }
    return ` ${config_name.subsp} ${subsp}`;
}

/*
    Nothosubsp and nothoforma not used
*/
const infras = (subsp, vari, subvar, forma, nothosubsp, nothoforma) => {
    let str = '';
    if (subsp) {
        str += subspecies(subsp, false);
    }
    if (vari) {
        str += ` ${config_name.var} ${vari}`;
    }
    if (subvar) {
        str += ` ${config_name.subvar} ${subvar}`;
    }
    if (forma) {
        str += ` ${config_name.forma} ${forma}`;
    }

    return str;
}

const listOfSpieces = (nomenclature, opts = {}) => {

    const options = Object.assign({}, {
        isItalic: false,
        isPublication: false,
        isTribus: false
    }, opts);

    console.log(nomenclature, options);

    const isItalic = options.isItalic;
    let isAuthorLast = true;

    let name = it(`${nomenclature.genus} ${nomenclature.species}`, isItalic);
    name = sl(name);

    if (nomenclature.species === nomenclature.subsp || nomenclature.species === nomenclature.var || nomenclature.species === nomenclature.forma) {
        name += ` ${nomenclature.authors}`;
        isAuthorLast = false;
    }

    name += infras(nomenclature.subsp, nomenclature.var, nomenclature.subvar, nomenclature.forma, nomenclature.nothosubsp, nomenclature.nothoforma);

    if (isAuthorLast) {
        name += ` ${nomenclature.authors}`;
    }
    if (nomenclature.syntype === '1') {
        name = `"${name}"`;
    }
    if (options.isPublication) {
        name += ` ${nomenclature.publication}`;
    }
    if (options.isTribus) {
        name += ` (${config_name.tribus} ${nomenclature.tribus})`;
    }
    return name;

}

export default { listOfSpieces };