/* eslint-disable no-underscore-dangle */
const { Pool } = require('pg');
const AuthorizationError = require('../../exceptions/AuthorizationError');
const NotFoundError = require('../../exceptions/NotFoundError');

class ActivitiesService {
  constructor() {
    this._pool = new Pool();
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

  async getActivities(playlistId, userId) {
    const query = {
      text: 'SELECT username,songs.title,ACTION,TIME FROM playlists JOIN playlists_song_activities AS pa ON playlists.id=pa.playlist_id JOIN users ON pa.user_id=users.id join songs on pa.song_id=songs.id WHERE playlists.id=$1 AND pa.user_id =$2',
      values: [playlistId, userId],
    };
    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('Album tidak ditemukan');
    }

    return result.rows;
  }
}

module.exports = ActivitiesService;
