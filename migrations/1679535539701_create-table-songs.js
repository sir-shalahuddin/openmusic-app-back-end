exports.up = (pgm) => {
  pgm.createTable('songs', {
    id: {
      type: 'varchar(50)',
      primaryKey: true,
    },
    title: {
      type: 'TEXT',
      notNull: true,
    },
    year: {
      type: 'int',
      notNull: true,
    },
    genre: {
      type: 'text',
      notNull: true,
    },
    performer: {
      type: 'text',
      notNull: true,
    },
    duration: {
      type: 'int',
      notNull: false,
    },
    albumid: {
      type: 'varchar(50)',
      notNull: false,
      references: 'albums',
      referencesConstraintName: 'song_fk',
    },
  });
};

exports.down = (pgm) => {
  pgm.dropTable('songs');
};
