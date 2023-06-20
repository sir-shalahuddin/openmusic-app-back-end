exports.up = (pgm) => {
  pgm.createTable('playlists_song_activities', {
    playlist_id: {
      type: 'varchar(50)',
      notNull: true,
      references: 'playlists',
      referencesConstraintName: 'playlists_activities_song_fk',
      onDelete: 'cascade',
    },
    song_id: {
      type: 'varchar(50)',
      notNull: true,
      references: 'songs',
      referencesConstraintName: 'song_playlists_activities_fk',
      onDelete: 'cascade',
    },
    user_id: {
      type: 'varchar(50)',
      notNull: true,
      references: 'users',
      referencesConstraintName: 'playlists_activities_users_fk',
      onDelete: 'cascade',

    },
    action: {
      type: 'varchar(50)',
      notNull: true,
    },
    time: {
      type: 'text',
      notNull: true,
    },
  });
};

exports.down = (pgm) => {
  pgm.dropTable('playlists_song_activities');
};
