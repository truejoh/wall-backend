const _ = require('lodash');
const User = require('../models/user');
const Article = require('../models/article');
const Comment = require('../models/comment');

const articlesPerPage = 50;

exports.getUserFavorites = async function (req, res) {
  try {
    const userId = req.user._id;
    const { page } = req.query;

    const user = await User.findOne({ _id: userId }, '-password')
      .populate([
        {
          path: 'favorites',
          model: 'Article',
          populate: [
            {
              path: 'comments',
              model: 'Comment',
              select: '_id content createdAt updatedAt',
              options: { sort: { createdAt: -1 } },
              populate: {
                path: 'commented_by',
                select: 'firstname lastname email',
              },
            },
            {
              path: 'posted_by',
              model: 'User',
              select: '_id email firstname lastname',
            },
            {
              path: 'liked_by',
              model: 'User',
              select: '_id email firstname lastname',
            },
          ],
          options: {
            sort: { createdAt: -1 },
            limit: articlesPerPage,
            skip: (parseInt(page) - 1) * articlesPerPage,
          },
        },
      ])
      .populate({
        path: 'liked_by',
        model: 'User',
        select: 'firstname lastname email',
      })
      .exec();

    if (user && user.favorites) {
      res.status(200).json({
        success: true,
        favorites: user.favorites,
      });
    } else {
      res.status(500).json({
        success: false,
        message: 'Could not get favorite articles',
      });
    }
  } catch (error) {
    res.status(400).send({
      success: false,
      message: 'Bad request',
    });
  }
};

exports.getUserArticles = async function (req, res) {
  try {
    const userId = req.user._id;
    const { page } = req.query;

    const articles = await Article.find({ posted_by: userId })
      .populate([
        {
          path: 'comments',
          model: 'Comment',
          select: '_id content createdAt updatedAt',
          options: { sort: { createdAt: -1 } },
          populate: {
            path: 'commented_by',
            select: 'firstname lastname email',
          },
        },
        {
          path: 'posted_by',
          model: 'User',
          select: '_id email firstname lastname',
        },
      ])
      .populate({
        path: 'liked_by',
        model: 'User',
        select: 'firstname lastname email',
      })
      .sort({ createdAt: -1 })
      .limit(articlesPerPage)
      .skip((parseInt(page) - 1) * articlesPerPage)
      .exec();

    if (articles) {
      res.status(200).json({
        success: true,
        articles,
      });
    } else {
      res.status(500).json({
        success: false,
        message: 'Could not get articles',
      });
    }
  } catch (error) {
    res.status(400).send({
      success: false,
      message: 'Bad request',
    });
  }
};

exports.getUserComments = async function (req, res) {
  try {
    const userId = req.user._id;

    const comments = await Comment.find({ commented_by: userId })
      .populate([
        {
          path: 'article',
          model: 'Article',
        },
      ])
      .exec();

    if (comments) {
      res.status(200).json({
        success: true,
        comments,
      });
    } else {
      res.status(500).json({
        success: false,
        message: 'Could not get article that you left comments',
      });
    }
  } catch (error) {
    res.status(400).send({
      success: false,
      message: 'Bad request',
    });
  }
};
