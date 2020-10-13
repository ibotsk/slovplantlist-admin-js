import config from '../../../config/config';

const Ownership = ({ role, isOwner, owners }) => {
    if (role === config.mappings.userRole.author.name) {
        return isOwner ? 'YES' : 'NO';
    }
    if (owners && owners.length) {
        return owners.join(', ');
    }
    return '-';

};

export default Ownership;