import familiesServiceModule from '../services/families';
import utils from '../utils/utils';

export default (accessToken) => {

    const familiesService = familiesServiceModule(accessToken);

    const getFamilyByIdCurated = async ({ id }) => {
        const data = await familiesService.getFamilyById({ id });
        return utils.nullToEmpty(data);
    }

    const getAllFamilies = async format => {
        const data = await familiesService.getAllFamilies();

        if (!format) {
            return data;
        }
        return data.map(format);
    }

    const getFamilyApgByIdCurated = async ({ id }) => {
        const data = await familiesService.getFamilyApgById({ id });
        return utils.nullToEmpty(data);
    }

    const getAllFamiliesApg = async format => {
        const data = await familiesService.getAllFamiliesApg();

        if (!format) {
            return data;
        }
        return data.map(format);
    }

    const saveFamily = async ({ data }) => {
        await familiesService.putFamily({ data });
    }

    const saveFamilyApg = async ({ data }) => {
        await familiesService.putFamilyApg({ data });
    }

    return {
        getFamilyByIdCurated,
        getAllFamilies,
        getFamilyApgByIdCurated,
        getAllFamiliesApg,
        saveFamily,
        saveFamilyApg
    };
}

// export default {
//     getFamilyByIdCurated,
//     getAllFamilies,
//     getFamilyApgByIdCurated,
//     getAllFamiliesApg,
//     saveFamily,
//     saveFamilyApg
// }