const { Joi } = require('express-validation');

module.exports = {
  create: {
    body: Joi.object({
      name: Joi.string().required().min(1).max(20),
    }),
  },
  edit: {
    body: Joi.object({
      name: Joi.string().required().min(1).max(20),
    }),
  },
};
