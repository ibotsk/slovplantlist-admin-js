import familiesService from '../services/families';
import utils from '../utils/utils';

const getFamilyByIdCurated = async ({ id, accessToken }) => {
    const data = await familiesService.getFamilyById({ id, accessToken });
    return utils.nullToEmpty(data);
}

const getAllFamilies = async ({ format, accessToken }) => {
    const data = await familiesService.getAllFamilies({ accessToken });

    if (!format) {
        return data;
    }
    return data.map(format);
}

const getFamilyApgByIdCurated = async ({ id, accessToken }) => {
    const data = await familiesService.getFamilyApgById({ id, accessToken });
    return utils.nullToEmpty(data);
}

const getAllFamiliesApg = async ({ format, accessToken }) => {
    const data = await familiesService.getAllFamiliesApg({ accessToken });

    if (!format) {
        return data;
    }
    return data.map(format);
}

const saveFamily = async ({ data, accessToken }) => {
    await familiesService.putFamily({ data, accessToken });
}

const saveFamilyApg = async ({ data, accessToken }) => {
    await familiesService.putFamilyApg({ data, accessToken });
}

export default {
    getFamilyByIdCurated,
    getAllFamilies,
    getFamilyApgByIdCurated,
    getAllFamiliesApg,
    saveFamily,
    saveFamilyApg
};

