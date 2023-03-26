/* eslint-disable camelcase */

exports.up = (pgm) => {
  pgm.createTable('playlists_song_activities', {
    playlist_id: {
      type: 'varchar(50)',
      notNull: true,
      references: 'playlists',
      referencesConstraintName: 'playlists_activities_song_fk',
      primaryKey: true,
    },
    song_id: {
      type: 'varchar(50)',
      notNull: true,
      references: 'songs',
      referencesConstraintName: 'song_playlists_activities_fk',
      primaryKey: true,
    },
    user_id: {
      type: 'varchar(50)',
      notNull: true,
      references: 'songs',
      referencesConstraintName: 'playlists_activities_users_fk',
      primaryKey: true,
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
