import React from 'react';
import config from '../config/config';

const config_name = config.nomenclature.name;
const itf = config.format.italic;
const plf = config.format.plain;

const o = (string, format) => {
    return { string: string.trim(), format: format };
}

const It = (string) => o(string, itf);
const Pl = (string) => o(string, plf);

const sl = (string) => {

    const sl = config_name.sl;
    if (string.includes(sl)) {
        let modString = string.replace(sl, '');
        return { s: modString, hasSl: true};
    }
    return { s: string, hasSl: false };
}

const subspecies = (subsp) => {
    const result = [];
    let isUnrankedOrProles = false;
    if (subsp.includes(config_name.unranked)) {
        result.push(Pl(config_name.unranked));
        isUnrankedOrProles = true;
    }
    if (subsp.includes(config_name.proles)) {
        result.push(Pl(config_name.proles));
        isUnrankedOrProles = true;
    }
    subsp = subsp.replace(/\[unranked\]|proles/g, '');

    if (!isUnrankedOrProles) {
        result.push(Pl(config_name.subsp));
    }
    result.push(It(subsp));
    return result;
}

/*
    Nothosubsp and nothoforma not used
*/
const infraTaxa = (subsp, vari, subvar, forma, nothosubsp, nothoforma) => {
    let infs = [];
    if (subsp) {
        infs = infs.concat(subspecies(subsp));
    }
    if (vari) {
        infs = infs.concat([Pl(config_name.var), It(vari)]);
    }
    if (subvar) {
        infs = infs.concat([Pl(config_name.subvar), It(subvar)]);
    }
    if (forma) {
        infs = infs.concat([Pl(config_name.forma), It(forma)]);
    }

    return infs;
}

const invalidDesignation = (name, syntype) => {
    if (syntype === '1') {
        let newname = [];
        newname.push(Pl('"'));
        newname = newname.concat(name);
        newname.push(Pl('"'));
        return newname;
    }
    return name;
}

const listOfSpieces = (nomenclature, options = {}) => {

    let opts = Object.assign({}, {
        isPublication: false,
        isTribus: false,
    }, options);

    let isAuthorLast = true;

    let name = [];
    let slResult = sl(nomenclature.species);

    name.push(It(`${nomenclature.genus} ${slResult.s}`));
    if (slResult.hasSl) {
        name.push(Pl(config_name.sl));
    }

    const infras = infraTaxa(nomenclature.subsp, nomenclature.var, nomenclature.subvar, nomenclature.forma, nomenclature.nothosubsp, nomenclature.nothoforma);

    if (nomenclature.species === nomenclature.subsp || nomenclature.species === nomenclature.var || nomenclature.species === nomenclature.forma) {
        name.push(Pl(nomenclature.authors));
        isAuthorLast = false;
    }

    name = name.concat(infras);

    if (isAuthorLast) {
        name.push(Pl(nomenclature.authors));
    }

    name = invalidDesignation(name, options.syntype);

    if (opts.isPublication) {
        name.push(Pl(nomenclature.publication));
    }
    if (opts.isTribus) {
        name.push(Pl(nomenclature.tribus));
    }
    
    return name;

}

export default { listOfSpieces };