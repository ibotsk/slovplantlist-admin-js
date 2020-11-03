import React from 'react';

import config from 'config/config';

const italic = (subject) => <i>{subject}</i>;

const format = (subject, formatString) => {
  switch (formatString) {
    case 'italic':
      return italic(subject);
    default:
      return subject;
  }
};

const userRole = (roles) => {
  if (!roles || roles.length === 0) {
    return undefined;
  }
  return roles.map((r, i) => {
    const mappedRole = config.mappings.userRole[r.name];
    return [
      i > 0 && ', ',
      <span key={r.name} style={{ color: mappedRole.colour }}>
        {mappedRole.text}
      </span>,
    ];
  });
};

const genus = (name, authors) => (
  [name, authors].filter((e) => e).join(' ')
);

export default {
  format,
  userRole,
  genus,
};
