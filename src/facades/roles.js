import rolesService from '../services/roles';
import roleMappingsService from '../services/roleMappings';

import config from '../config/config';

const getAllRoles = async ({ accessToken, format }) => {
    const roles = await rolesService.getAll({ accessToken });

    if (!format) {
        return roles;
    }
    return roles.map(format);
}

/**
 * Replaces existing role mapping or creates new.
 * User can have only one role.
 * @param {*} param0 
 */
const saveRoleForUser = async ({ userId, roleId, accessToken }) => {
    const roleMappings = await roleMappingsService.getRoleMappingByUser({ userId, accessToken });
    const roleMappingOfUser = roleMappings[0];
    const data = {
        ...roleMappingOfUser,
        principalType: config.constants.userPrincipalType,
        principalId: userId,
        roleId
    };
    
    await roleMappingsService.putRoleMapping({ data, accessToken });
}

export default {
    getAllRoles,
    saveRoleForUser
}