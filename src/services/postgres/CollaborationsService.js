/* eslint-disable no-underscore-dangle */
const { Pool } = require('pg');
const InvariantError = require('../../exceptions/InvariantError');
const AuthorizationError = require('../../exceptions/AuthorizationError');
const NotFoundError = require('../../exceptions/NotFoundError');

class CollaborationsService {
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

  async verifyValidUser(id) {
    const query = {
      text: 'SELECT * FROM users WHERE id = $1',
      values: [id],
    };

    const result = await this._pool.query(query);
    if (!result.rows.length) {
      throw new NotFoundError('User tidak ditemukan');
    }
  }

  async addCollaborations(playlistId, userId) {
    const query = {
      text: 'insert into collaborations values($1, $2) returning Concat(user_id,\'-\',playlist_id) AS "collaborationId" ',
      values: [playlistId, userId],
    };
    const result = await this._pool.query(query);
    if (!result.rows.length) {
      throw new InvariantError('gagal menambahkan collabs');
    }
    return (result.rows[0].collaborationId);
  }

  async deleteCollaborationsById(userId, playlistId) {
    const query = {
      text: 'delete from collaborations where user_id = $1 and playlist_id=$2',
      values: [userId, playlistId],
    };
    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('Collaboration gagal dihapus. Id tidak ditemukan');
    }
  }
}

module.exports = CollaborationsService;
