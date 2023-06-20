/* eslint-disable no-underscore-dangle */
class ActivitiesHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;

    this.getActivitiesHandler = this.getActivitiesHandler.bind(this);
  }

  async getActivitiesHandler(request, h) {
    const { id: credentialId } = request.auth.credentials;
    const { id: playlistId } = request.params;
    await this._service.verifyPlaylistEditor(playlistId, credentialId);
    const activities = await this._service.getActivities(playlistId, credentialId);
    const response = h.response({
      status: 'success',
      data: {
        playlistId,
        activities,
      },
    });
    response.code(200);
    return response;
  }
}
module.exports = ActivitiesHandler;
