import familiesService from '../services/families';
import utils from '../utils/utils';

const getFamilyByIdCurated = async ({ id, accessToken }) => {
    const data = await familiesService.getFamilyById({ id });
    return utils.nullToEmpty(data);
}

const saveFamily = async ({ data }) => {
    await familiesService.putFamily({ data });
}

export default {
    getFamilyByIdCurated,
    saveFamily
}