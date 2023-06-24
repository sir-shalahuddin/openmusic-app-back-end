/* eslint-disable no-underscore-dangle */

class PlaylistsHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;
  }

  async postPlaylistHandler(request, h) {
    await this._validator.validatePlaylistPayload(request.payload);
    const { name } = request.payload;
    const { id: credentialId } = request.auth.credentials;

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

    await this._service.verifyPlaylistOwner(id, credentialId);
    await this._service.deletePlaylistsById(id);

    return {
      status: 'success',
      message: 'Catatan berhasil dihapus',
    };
  }

  async postPlaylistSongsHandler(request, h) {
    this._validator.validatePlaylistSongsPayload(request.payload);
    const { id: playlistId } = request.params;
    const { id: credentialId } = request.auth.credentials;
    const { songId } = request.payload;

    await this._service.verifyPlaylistSongs(songId);
    await this._service.verifyPlaylistEditor(playlistId, credentialId);

    const result = await this._service.addSongsToPlaylist(playlistId, songId, credentialId);

    const response = h.response({
      status: 'success',
      message: `Lagu ${result.song_id} berhasil ditambahkan ke playlist ${result.playlist_id}`,
      data: {
        result,
      },
    });
    response.code(201);
    return response;
  }

  async getPlaylistSongsHandler(request, h) {
    const { id: credentialId } = request.auth.credentials;
    const { id: playlistId } = request.params;
    await this._service.verifyPlaylistEditor(playlistId, credentialId);

    const playlist = await this._service.getPlaylistsById(playlistId);
    playlist.songs = await this._service.getSongsInPlaylist(playlistId);

    const response = h.response({
      status: 'success',
      data: {
        playlist,
      },
    });
    response.code(200);
    return response;
  }

  async deletePlaylistSongsHandler(request) {
    this._validator.validateDeletePlaylistSongsPayload(request.payload);
    const { id: credentialId } = request.auth.credentials;
    const { id: playlistId } = request.params;
    const { songId } = request.payload;

    await this._service.verifyPlaylistEditor(playlistId, credentialId);

    await this._service.deleteSongInPlaylist(playlistId, songId, credentialId);

    return {
      status: 'success',
      message: 'Catatan berhasil dihapus',
    };
  }
}

module.exports = PlaylistsHandler;
