const express = require('express');
const { validate } = require('express-validation');

const userController = require('../controllers/user');

const router = express.Router();

router.get('/favorites', userController.getUserFavorites);

router.get('/articles', userController.getUserArticles);

router.get('/comments', userController.getUserComments);

module.exports = router;
