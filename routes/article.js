const express = require('express');
const { validate } = require('express-validation');

const articleController = require('../controllers/article');
const { requireAuth } = require('../middlewares/auth');
const {
  articleValidation,
  getArticleValidation,
  commentValidation,
} = require('../validations/article.validation');

const router = express.Router();

router.get('/', validate(getArticleValidation), articleController.getArticles);

router.get('/:article_id', requireAuth, articleController.getArticle);

router.post(
  '/',
  requireAuth,
  validate(articleValidation, {
    context: false,
    statusCode: 400,
    keyByField: true,
  }),
  articleController.createArticle,
);

router.put(
  '/:article_id',
  requireAuth,
  validate(articleValidation, {
    context: false,
    statusCode: 400,
    keyByField: true,
  }),
  articleController.editArticle,
);

router.delete('/:article_id', requireAuth, articleController.deleteArticle);

router.post('/:article_id/like', requireAuth, articleController.likeArticle);

router.post(
  '/:article_id/unlike',
  requireAuth,
  articleController.cancelLikeArticle,
);

router.post(
  '/:article_id/favorite',
  requireAuth,
  articleController.favoriteArticle,
);

router.get(
  '/:article_id/comment',
  requireAuth,
  articleController.getArticleComments,
);

router.post(
  '/:article_id/comment',
  requireAuth,
  validate(commentValidation, {
    context: false,
    statusCode: 400,
    keyByField: true,
  }),
  articleController.createArticleComment,
);

router.put(
  '/:article_id/comment/:comment_id',
  requireAuth,
  validate(commentValidation, {
    context: false,
    statusCode: 400,
    keyByField: true,
  }),
  articleController.editArticleComment,
);

router.delete(
  '/:article_id/comment/:comment_id',
  requireAuth,
  articleController.deleteArticleComment,
);

module.exports = router;
