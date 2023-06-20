exports.up = (pgm) => {
  pgm.createTable('playlists_songs', {
    playlist_id: {
      type: 'varchar(50)',
      notNull: true,
      references: 'playlists',
      referencesConstraintName: 'playlists_songs_fk',
      onDelete: 'cascade',
      primaryKey: true,
    },
    song_id: {
      type: 'varchar(50)',
      notNull: true,
      references: 'songs',
      referencesConstraintName: 'songs_playlists_fk',
      onDelete: 'cascade',
      primaryKey: true,
    },
  });
};

exports.down = (pgm) => {
  pgm.dropTable('playlist_songs');
};
