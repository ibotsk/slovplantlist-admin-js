import genusService from '../services/genus';

const getAllGeneraBySearchTerm = async (term, format) => {
    const genera = await genusService.getAllGeneraBySearchTerm(term);

    if (!format) {
        return genera;
    }
    return genera.map(format);
}

export default {
    getAllGeneraBySearchTerm
}