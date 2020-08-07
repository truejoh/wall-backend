const express = require('express');
const { validate } = require('express-validation');

const tagController = require('../controllers/tag');
const { requireAuth } = require('../middlewares/auth');
const { create, edit } = require('../validations/tag.validation');

const router = express.Router();

router.get('/', tagController.getAllTags);

router.post(
  '/',
  [
    requireAuth,
    validate(create, { context: false, statusCode: 400, keyByField: true }),
  ],
  tagController.createTag,
);

router.put(
  '/:tag_id',
  [
    requireAuth,
    validate(edit, { context: false, statusCode: 400, keyByField: true }),
  ],
  tagController.editTag,
);

router.delete('/:tag_id', requireAuth, tagController.deleteTag);

module.exports = router;
