/* eslint-disable no-underscore-dangle */

class ExportsHandler {
  constructor(service, playlistsService, validator) {
    this._service = service;
    this._playlistsService = playlistsService;
    this._validator = validator;
  }

  async postExportPlaylistsHandler(request, h) {
    this._validator.validateExportMusicsPayload(request.payload);

    // eslint-disable-next-line max-len
    await this._playlistsService.verifyPlaylistOwner(request.params.id, request.auth.credentials.id);
    const message = {
      playlistId: request.params.id,
      targetEmail: request.payload.targetEmail,
    };

    await this._service.sendMessage('export:playlists', JSON.stringify(message));

    const response = h.response({
      status: 'success',
      message: 'Permintaan Anda dalam antrean',
    });
    response.code(201);
    return response;
  }
}

module.exports = ExportsHandler;
