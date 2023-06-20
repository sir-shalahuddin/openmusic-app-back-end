/* eslint-disable no-underscore-dangle */
const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const InvariantError = require('../../exceptions/InvariantError');
const AuthorizationError = require('../../exceptions/AuthorizationError');
const NotFoundError = require('../../exceptions/NotFoundError');

class PlaylistsService {
  constructor() {
    this._pool = new Pool();
  }

  async verifyPlaylistOwner(id, owner) {
    const query = {
      text: 'SELECT * FROM playlists WHERE id = $1',
      values: [id],
    };

    const result = await this._pool.query(query);
    if (!result.rows.length) {
      throw new NotFoundError('Playlist tidak ditemukan');
    }
    const playlist = result.rows[0];
    if (playlist.owner !== owner) {
      throw new AuthorizationError('Anda tidak berhak mengakses playlist ini');
    }
  }

  async verifyPlaylistEditor(id, owner) {
    const query = {
      text: 'SELECT * FROM playlists LEFT JOIN collaborations ON playlists.id = collaborations.playlist_id WHERE playlists.id =$1 or (collaborations.user_id = $2 OR OWNER = $2 )',
      values: [id, owner],
    };
    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Playlist tidak ditemukan');
    }
    const playlist = result.rows[0];
    if (playlist.playlist_id == null && owner !== playlist.owner) {
      throw new AuthorizationError('Anda tidak berhak mengakses playlist ini');
    }
  }

  async verifyPlaylistSongs(id) {
    const query = {
      text: 'SELECT * FROM songs WHERE id = $1',
      values: [id],
    };

    const result = await this._pool.query(query);
    if (!result.rows.length) {
      throw new NotFoundError('Playlist tidak ditemukan');
    }
  }

  async addPlaylists(name, owner) {
    const id = `playlists-${nanoid(16)}`;
    const query = {
      text: 'INSERT INTO playlists VALUES($1, $2, $3) returning id',
      values: [id, name, owner],
    };

    const result = await this._pool.query(query);
    if (!result.rows[0].id) {
      throw new InvariantError('Playlist gagal ditambahkan');
    }

    return result.rows[0].id;
  }

  async getPlaylists(owner) {
    const query = {
      text: 'SELECT p.id,p.name,u.username from playlists AS p left JOIN collaborations AS c ON p.id = c.playlist_id JOIN users AS u on p.owner = u.id where OWNER = $1  OR c.user_id = $1',
      values: [owner],
    };
    const result = await this._pool.query(query);
    return result.rows;
  }

  async getPlaylistsById(id) {
    const query = {
      text: 'select playlists.id,name,username from playlists left join users on playlists.owner=users.id where playlists.id=$1',
      values: [id],
    };
    const result = await this._pool.query(query);
    if (!result.rows.length) {
      throw new NotFoundError('Playlist tidak ditemukan');
    }
    return result.rows[0];
  }

  async deletePlaylistsById(id) {
    const query = {
      text: 'delete from playlists where id = $1 returning id ',
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result) {
      throw new NotFoundError('Playlist gagal dihapus. Id tidak ditemukan');
    }
  }

  async addSongsToPlaylist(playlistId, songId, userId) {
    const query = {
      text: 'insert into playlists_songs values($1, $2) returning song_id,playlist_id',
      values: [playlistId, songId],
    };

    const result = await this._pool.query(query);

    if (!result.rows[0].song_id) {
      throw new InvariantError('Lagu gagal ditambahkan ke Playlist');
    }
    const trx = {
      text: 'insert into playlists_song_activities values($1,$2,$3,\'add\', NOW())',
      values: [playlistId, songId, userId],
    };

    await this._pool.query(trx);

    return (result.rows[0]);
  }

  async getSongsInPlaylist(playlistId) {
    const query = {
      text: 'SELECT id,title,performer FROM playlists_songs LEFT JOIN songs ON songs.id=playlists_songs.song_id WHERE playlists_songs.playlist_id =$1',
      values: [playlistId],
    };
    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Playlist tidak ditemukan');
    }
    return result.rows;
  }

  async deleteSongInPlaylist(playlistId, songId, userId) {
    const query = {
      text: 'delete from playlists_songs where playlist_id=$1 and song_id=$2 returning playlist_id',
      values: [playlistId, songId],
    };
    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('Lagu gagal dihapus. Id tidak ditemukan');
    }

    const trx = {
      text: 'insert into playlists_song_activities values($1,$2,$3,\'delete\', NOW())',
      values: [playlistId, songId, userId],
    };

    await this._pool.query(trx);
  }
}

module.exports = PlaylistsService;
