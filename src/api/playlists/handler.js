/* eslint-disable no-underscore-dangle */

class PlaylistsHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;

    this.postPlaylistHandler = this.postPlaylistHandler.bind(this);
    this.getPlaylistSongsHandler = this.getPlaylistSongsHandler.bind(this);
    this.deletePlaylistByIdHandler = this.deletePlaylistByIdHandler.bind(this);
    this.postPlaylistSongsHandler = this.postPlaylistSongsHandler.bind(this);
    this.getPlaylistSongsHandler = this.getPlaylistSongsHandler.bind(this);
    this.deletePlaylistSongsHandler = this.deletePlaylistSongsHandler.bind(this);
  }

  async postPlaylistHandler(request, h) {
    this._validator.validatePlaylistPayload(request.payload);
    const { id: credentialId } = request.auth.credentials;
    const { name } = request.payload;

    const playlistId = await this._service.addPlaylist(name, credentialId);
    const response = h.response({
      status: 'success',
      message: 'Playlist berhasil ditambahkan',
      data: {
        playlistId,
      },
    });
    response.code(201);
    return response;
  }

  async getPlaylistsHandler(request, h) {
    const { id: credentialId } = request.auth.credentials;
    const playlists = await this._service.getPlaylists(credentialId);
    const response = h.response({
      status: 'success',
      data: {
        playlists,
      },
    });
    response.code(200);
    return response;
  }

  async deletePlaylistByIdHandler(request) {
    const { id } = request.params;
    const { id: credentialId } = request.auth.credentials;

    await this._service.verifyNoteOwner(id, credentialId);
    await this._service.deletePlaylistById(id);

    return {
      status: 'success',
      message: 'Catatan berhasil dihapus',
    };
  }

  async postPlaylistSongsHandler(request, h) {
    this._validator.validatePlaylistPayload(request.payload);
    const playlistId = request.params;
    const { id: credentialId } = request.auth.credentials;
    const { songId } = request.payload;
    await this._service.verifyNoteOwner(playlistId, credentialId);
    const result = await this._service.addSongsToPlaylist(playlistId, songId);
    const response = h.response({
      status: 'success',
      message: 'Playlist berhasil ditambahkan',
      data: {
        result,
      },
    });
    response.code(201);
    return response;
  }

  async getPlaylistSongsHandler(request, h) {
    const { id: credentialId } = request.auth.credentials;
    const playlistId = request.params;
    await this._service.verifyNoteOwner(playlistId, credentialId);
    const playlists = await this._service.getPlaylists(credentialId);
    playlists.songs = await this._service.getSongsInPlaylist(playlistId);
    const response = h.response({
      status: 'success',
      data: {
        playlists,
      },
    });
    response.code(200);
    return response;
  }

  async deletePlaylistSongsHandler(request) {
    const { id: credentialId } = request.auth.credentials;
    const playlistId = request.params;
    const songId = request.payload;
    await this._service.verifyNoteOwner(playlistId, credentialId);
    await this._service.deleteSongInPlaylist(playlistId, songId);

    return {
      status: 'success',
      message: 'Catatan berhasil dihapus',
    };
  }
}

module.exports = PlaylistsHandler;
