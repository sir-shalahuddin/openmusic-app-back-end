exports.up = (pgm) => {
  pgm.createTable('user_album_likes', {
    album_id: {
      type: 'varchar(50)',
      notNull: true,
      references: 'albums',
      referencesConstraintName: 'likes_album_fk',
      primaryKey: true,
      onDelete: 'cascade',
    },
    user_id: {
      type: 'varchar(50)',
      notNull: true,
      references: 'users',
      referencesConstraintName: 'likes_user_fk',
      primaryKey: true,
      onDelete: 'cascade',
    },
  });
};

exports.down = (pgm) => {
  pgm.dropTable('user_album_likes');
};
