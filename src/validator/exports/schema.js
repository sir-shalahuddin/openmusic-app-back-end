const Joi = require('joi');

const ExportMusicsPayloadSchema = Joi.object({
  targetEmail: Joi.string().email({ tlds: true }).required(),
});

module.exports = ExportMusicsPayloadSchema;
