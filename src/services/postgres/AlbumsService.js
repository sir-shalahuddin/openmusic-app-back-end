/* eslint-disable no-underscore-dangle */
const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');
const ClientError = require('../../exceptions/ClientError');

class AlbumsService {
  constructor(cacheService) {
    this._pool = new Pool();
    this._cacheService = cacheService;
  }

  async addAlbum({ name, year }) {
    const id = `album-${nanoid(16)}`;

    const query = {
      text: 'insert into albums values($1, $2, $3) returning id',
      values: [id, name, year],
    };

    const result = await this._pool.query(query);
    if (!result.rows[0].id) {
      throw new InvariantError('Album gagal ditambahkan');
    }
    return result.rows[0].id;
  }

  async getAlbumById(id) {
    const query = {
      text: 'SELECT id,name,year,cover as "coverUrl" FROM albums WHERE id = $1',
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('Album tidak ditemukan');
    }

    return result.rows[0];
  }

  async editAlbumById(id, { name, year }) {
    const query = {
      text: 'UPDATE albums SET name = $1, year = $2 WHERE id = $3 RETURNING id',
      values: [name, year, id],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('Gagal memperbarui album. Id tidak ditemukan');
    }
  }

  async deleteAlbumById(id) {
    const query = {
      text: 'DELETE FROM albums WHERE id = $1 RETURNING id',
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('Album gagal dihapus. Id tidak ditemukan');
    }
  }

  async updateCoverUrl(url) {
    const query = {
      text: 'UPDATE albums SET cover =$1',
      values: [url],
    };

    await this._pool.query(query);
  }

  async likesAlbum(albumId, userId) {
    const query = {
      text: 'INSERT INTO user_album_likes VALUES ($1,$2) returning *',
      values: [albumId, userId],
    };
    try {
      await this._pool.query(query);
    } catch (error) {
      throw new ClientError('gagal menambahkan likes');
    }
    await this._cacheService.delete(`albumlike:${albumId}`);
  }

  async getAlbumLikes(albumId) {
    const query = {
      text: 'SELECT COUNT(*) AS likes FROM user_album_likes WHERE album_id=$1',
      values: [albumId],
    };

    try {
      const likesCount = await this._cacheService.get(`albumlike:${albumId}`);
      const result = {
        likes: likesCount,
        isCache: true,
      };
      return result;
    } catch {
      const result = await this._pool.query(query);
      const likesCount = parseInt(result.rows[0].likes, 10);
      if (!result.rowCount) {
        throw new NotFoundError('Album tidak ditemukan');
      }
      await this._cacheService.set(
        `albumlike:${albumId}`,
        likesCount,
      );
      return {
        likes: likesCount,
        isCache: false,
      };
    }
  }

  async unlikesAlbum(albumId, userId) {
    const query = {
      text: 'DELETE FROM user_album_likes WHERE album_id=$1 AND user_id=$2 returning *',
      values: [albumId, userId],
    };
    const result = await this._pool.query(query);
    if (!result.rowCount) {
      throw new NotFoundError('Anda tidak menyukai album ini');
    }
    await this._cacheService.delete(`albumlike:${albumId}`);
  }
}

module.exports = AlbumsService;
