exports.up = (pgm) => {
  pgm.createTable('collaborations', {
    playlist_id: {
      type: 'varchar(50)',
      notNull: true,
      references: 'playlists',
      referencesConstraintName: 'playlist_collaborations_fk',
      primaryKey: true,
      onDelete: 'cascade',
    },
    user_id: {
      type: 'varchar(50)',
      notNull: true,
      references: 'users',
      referencesConstraintName: 'playlists__user_fk',
      primaryKey: true,
      onDelete: 'cascade',
    },
  });
};

exports.down = (pgm) => {
  pgm.dropTable('collaborations');
};
