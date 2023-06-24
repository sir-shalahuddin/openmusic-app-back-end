/* eslint-disable no-underscore-dangle */

class CollaborationsHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;
  }

  async postCollaborationsHandler(request, h) {
    await this._validator.validateCollaborationPayload(request.payload);

    const { playlistId, userId } = request.payload;
    const { id: credentialId } = request.auth.credentials;

    await this._service.verifyPlaylistOwner(playlistId, credentialId);
    await this._service.verifyValidUser(userId);
    const collaborationId = await this._service.addCollaborations(playlistId, userId);
    const response = h.response({
      status: 'success',
      message: 'Collaboration berhasil ditambahkan',
      data: {
        collaborationId,
      },
    });
    response.code(201);
    return response;
  }

  async deleteCollaborationsHandler(request) {
    await this._validator.validateCollaborationPayload(request.payload);
    const { id: credentialId } = request.auth.credentials;

    const { playlistId, userId } = request.payload;

    await this._service.verifyPlaylistOwner(playlistId, credentialId);

    await this._service.deleteCollaborationsById(userId, playlistId);

    return {
      status: 'success',
      message: 'Catatan berhasil dihapus',
    };
  }
}

module.exports = CollaborationsHandler;
