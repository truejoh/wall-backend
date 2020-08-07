const { Joi } = require('express-validation');

module.exports = {
  articleValidation: {
    body: Joi.object({
      content: Joi.string().required(),
      tag: Joi.string().required(),
    }),
  },
  getArticleValidation: {
    query: Joi.object({
      page: Joi.number().min(1),
      type: Joi.string(),
    }),
  },
  commentValidation: {
    body: Joi.object({
      content: Joi.string().required(),
    }),
  },
};
