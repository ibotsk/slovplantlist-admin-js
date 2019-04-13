import familiesService from '../services/families';
import utils from '../utils/utils';

const getFamilyByIdCurated = async ({ id, accessToken }) => {
    const data = await familiesService.getFamilyById({ id });
    return utils.nullToEmpty(data);
}

const getFamilyApgByIdCurated = async ({ id, accessToken }) => {
    const data = await familiesService.getFamilyApgById({ id });
    return utils.nullToEmpty(data);
}

const saveFamily = async ({ data }) => {
    await familiesService.putFamily({ data });
}

const saveFamilyApg = async ({ data }) => {
    await familiesService.putFamilyApg({ data });
}

export default {
    getFamilyByIdCurated,
    getFamilyApgByIdCurated,
    saveFamily,
    saveFamilyApg
}