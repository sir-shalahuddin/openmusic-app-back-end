exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.createTable('playlists', {
    id: {
      type: 'varchar(50)',
      primaryKey: true,
    },
    name: {
      type: 'TEXT',
      notNull: true,
    },
    owner: {
      type: 'varchar(50)',
      notNull: true,
      references: 'users',
      referencesConstraintName: 'playlists_fk',
    },
  });
};

exports.down = (pgm) => {
  pgm.dropTable('playlists');
};
