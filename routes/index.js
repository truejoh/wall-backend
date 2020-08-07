const express = require('express');
const authRouter = require('./auth');
const articleRouter = require('./article');
const tagRouter = require('./tag');
const userRouter = require('./user');
const { requireAuth } = require('../middlewares/auth');

require('../config/passport');

const router = express.Router();

router.get('/', (req, res) => {
  res.json({ success: true, message: 'wall app rest api' });
});

router.use('/auth', authRouter);

router.use('/article', articleRouter);

router.use('/tag', tagRouter);

router.use('/user', requireAuth, userRouter);

module.exports = router;
