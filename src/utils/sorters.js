function listOfSpeciesSorterLex(losA, losB) {
  // a > b = 1
  if (losA.genus > losB.genus) {
    return 1;
  }
  if (losA.genus < losB.genus) {
    return -1;
  }
  if (losA.species > losB.species) {
    return 1;
  }
  if (losA.species < losB.species) {
    return -1;
  }
  if (losA.subsp > losB.subsp) {
    return 1;
  }
  if (losA.subsp < losB.subsp) {
    return -1;
  }
  if (losA.var > losB.var) {
    return 1;
  }
  if (losA.var < losB.var) {
    return -1;
  }
  if (losA.forma > losB.forma) {
    return 1;
  }
  if (losA.forma < losB.forma) {
    return -1;
  }
  if (losA.subvar > losB.subvar) {
    return 1;
  }
  if (losA.subvar < losB.subvar) {
    return -1;
  }
  if (losA.authors > losB.authors) {
    return 1;
  }
  if (losA.authors < losB.authors) {
    return -1;
  }
  // hybrid fields next
  if (losA.genusH > losB.genusH) {
    return 1;
  }
  if (losA.genusH < losB.genusH) {
    return -1;
  }
  if (losA.speciesH > losB.speciesH) {
    return 1;
  }
  if (losA.speciesH < losB.speciesH) {
    return -1;
  }
  if (losA.subspH > losB.subspH) {
    return 1;
  }
  if (losA.subspH < losB.subspH) {
    return -1;
  }
  if (losA.varH > losB.varH) {
    return 1;
  }
  if (losA.varH < losB.varH) {
    return -1;
  }
  if (losA.formaH > losB.formaH) {
    return 1;
  }
  if (losA.formaH < losB.formaH) {
    return -1;
  }
  if (losA.subvarH > losB.subvarH) {
    return 1;
  }
  if (losA.subvarH < losB.subvarH) {
    return -1;
  }
  if (losA.authorsH > losB.authorsH) {
    return 1;
  }
  if (losA.authorsH < losB.authorsH) {
    return -1;
  }
  return 0;
}

function genusSorterLex(genusA, genusB) {
  if (genusA.name > genusB.name) {
    return 1;
  }
  if (genusA.name < genusB.name) {
    return -1;
  }
  if (genusA.authors > genusB.authors) {
    return 1;
  }
  if (genusA.authors < genusB.authors) {
    return -1;
  }
  return 0;
}

function synonymSorterLex(synA, synB) {
  return listOfSpeciesSorterLex(synA.synonym, synB.synonym);
}

function generaSynonymSorterLex(synA, synB) {
  return genusSorterLex(synA.synonym, synB.synonym);
}

export default {
  listOfSpeciesSorterLex,
  genusSorterLex,
  synonymSorterLex,
  generaSynonymSorterLex,
};
