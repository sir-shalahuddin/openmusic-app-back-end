/* eslint-disable no-underscore-dangle */

class AlbumsHandler {
  constructor(service, songsService, storageService, validator) {
    this._service = service;
    this._songsService = songsService;
    this._storageService = storageService;
    this._validator = validator;
  }

  async postAlbumHandler(request, h) {
    this._validator.validateAlbumPayload(request.payload);

    const albumId = await this._service.addAlbum(request.payload);
    const response = h.response({
      status: 'success',
      message: 'Album berhasil ditambahkan',
      data: {
        albumId,
      },
    });
    response.code(201);
    return response;
  }

  async getAlbumByIdHandler(request) {
    const { id } = request.params;
    const album = await this._service.getAlbumById(id);
    album.songs = await this._songsService.getSongsByAlbumId(id);
    return {
      status: 'success',
      data: {
        album,
      },
    };
  }

  async putAlbumByIdHandler(request) {
    this._validator.validateAlbumPayload(request.payload);
    const { id } = request.params;

    await this._service.editAlbumById(id, request.payload);

    return {
      status: 'success',
      message: 'Catatan berhasil diperbarui',
    };
  }

  async deleteAlbumByIdHandler(request) {
    const { id } = request.params;
    await this._service.deleteAlbumById(id);

    return {
      status: 'success',
      message: 'Catatan berhasil dihapus',
    };
  }

  async postUploadAlbumCoverHandler(request, h) {
    const { cover } = request.payload;
    this._validator.validateImageHeaders(cover.hapi.headers);
    const fileLocation = await this._storageService.writeFile(cover, cover.hapi);
    await this._service.updateCoverUrl(fileLocation);
    const response = h.response({
      status: 'success',
      message: 'Sampul berhasil diunggah',
    });
    response.code(201);
    return response;
  }

  async postLikeAlbumHandler(request, h) {
    const { id: albumId } = request.params;
    const { id: userId } = request.auth.credentials;

    await this._service.getAlbumById(albumId);
    await this._service.likesAlbum(albumId, userId);

    const response = h.response({
      status: 'success',
      message: 'Likes berhasil ditambahkan',
    });
    response.code(201);
    return response;
  }

  async deleteLikeAlbumHandler(request, h) {
    const { id: albumId } = request.params;
    const { id: userId } = request.auth.credentials;
    await this._service.unlikesAlbum(albumId, userId);

    const response = h.response({
      status: 'success',
      message: 'Berhasil Unlikes',
    });
    response.code(200);
    return response;
  }

  async getLikeAlbumHandler(request, h) {
    const { id: albumId } = request.params;

    // const likes = await this._service.getLikesAlbum(albumId);
    const result = await this._service.getAlbumLikes(albumId);

    const response = h.response({
      status: 'success',
      data: { likes: parseInt(result.likes, 10) },
    });
    if (result.isCache) {
      h.response(response).header('X-Data-Source', 'cache');
    }
    response.code(200);
    return response;
  }
}

module.exports = AlbumsHandler;
