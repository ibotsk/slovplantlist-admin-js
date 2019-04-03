import speciesService from '../services/species';

const getRecordById = async id => {
    return speciesService.getSpeciesRecordByIdWithFilter(id);
}

export default {
    getRecordById
};