/* eslint-disable no-underscore-dangle */
class ActivitiesHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;
  }

  async getActivitiesHandler(request) {
    const { id: credentialId } = request.auth.credentials;
    const { id: playlistId } = request.params;
    await this._service.verifyPlaylistEditor(playlistId, credentialId);
    const activities = await this._service.getActivities(playlistId, credentialId);
    return {
      status: 'success',
      data: {
        playlistId,
        activities,
      },
    };
  }
}
module.exports = ActivitiesHandler;
