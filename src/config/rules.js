const rules = {
  author: {
    dynamic: {
      'species:edit': ({ speciesGenusId, userGeneraIds }) => { // can edit only species fro genus assigned to user
        if (!speciesGenusId || !userGeneraIds) {
          return false;
        }
        return userGeneraIds.includes(speciesGenusId);
      },
    },
  },
  editor: {
    static: [
      'checklist:edit',
      'checklist:add',
      'species:edit',
      'genus:edit',
      'family:edit',
      'familyAPG:edit',
    ],
  },
  admin: {
    static: [
      'checklist:edit',
      'checklist:add',
      'species:edit',
      'genus:edit',
      'family:edit',
      'familyAPG:edit',
      'users',
    ],
  },
};

export default rules;
