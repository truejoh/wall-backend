const _ = require('lodash');
const Article = require('../models/article');
const Comment = require('../models/comment');
const User = require('../models/user');

const articlesPerPage = 50;

exports.getArticles = async function (req, res) {
  try {
    const { page, type } = req.query;
    let sort = {
      createdAt: -1,
    };
    if (type === 'popular') {
      sort = {
        likes: -1,
      };
    }
    const articles = await Article.find()
      .populate({
        path: 'posted_by',
        model: 'User',
        select: '_id firstname lastname email',
      })
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
      ])
      .populate({
        path: 'liked_by',
        model: 'User',
        select: 'firstname lastname email',
      })
      .sort(sort)
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

exports.getArticle = async function (req, res) {
  const articleId = req.params.article_id;

  try {
    const article = await Article.findOne({ _id: articleId })
      .populate({
        path: 'posted_by',
        model: 'User',
        select: '_id firstname lastname email',
      })
      .populate([
        {
          path: 'comments',
          model: 'Comment',
          select: '_id content createdAt updatedAt',
          populate: {
            path: 'commented_by',
            select: 'firstname lastname email',
          },
        },
      ])
      .populate({
        path: 'liked_by',
        model: 'User',
        select: 'firstname lastname email',
      })
      .exec();

    if (article) {
      res.status(200).json({
        success: true,
        article,
      });
    } else {
      res.status(500).json({
        success: false,
        message: 'Could not get an article',
      });
    }
  } catch (error) {
    res.status(400).send({
      success: false,
      message: 'Bad request',
    });
  }
};

exports.createArticle = async function (req, res) {
  const { content, tag } = req.body;
  const posted_by = req.user._id;

  const newArticle = {
    content,
    tag,
    posted_by,
  };

  try {
    const article = await new Article(newArticle);
    const result = await article.save();
    const aaa = await Article.findOne({ _id: article._id })
      .populate({
        path: 'posted_by',
        model: 'User',
        select: '_id email firstname lastname',
      })
      .exec();

    if (result) {
      return res.status(200).json({
        success: true,
        message: 'Article created successfully',
        article: aaa,
      });
    } else {
      res.status(500).json({
        success: false,
        message: 'Could not create an article',
      });
    }
  } catch (error) {
    res.status(400).send({
      success: false,
      message: 'Bad request',
    });
  }
};

exports.editArticle = async function (req, res) {
  const articleId = req.params.article_id;
  const { content, tag } = req.body;

  const newArticle = {
    content,
    tag,
  };

  try {
    const result = await Article.update({ _id: articleId }, newArticle);

    if (result) {
      res.status(200).json({
        success: true,
        message: 'Article updated successfully',
      });
    } else {
      res.status(500).json({
        success: false,
        message: 'Could not update an article',
      });
    }
  } catch (error) {
    res.status(400).send({
      success: false,
      message: 'Bad request',
    });
  }
};

exports.deleteArticle = async function (req, res) {
  const articleId = req.params.article_id;

  try {
    const result = await Article.deleteOne({ _id: articleId });

    if (result) {
      return res.status(200).json({
        success: true,
        message: 'Article deleted successfully',
      });
    } else {
      res.status(500).json({
        success: false,
        message: 'Could not delete an article',
      });
    }
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Bad request',
    });
  }
};

exports.likeArticle = async function (req, res) {
  const userId = req.user._id;
  const articleId = req.params.article_id;

  try {
    const article = await Article.findOne({ _id: articleId });

    if (article.posted_by.toString() === userId.toString()) {
      return res.status(400).json({
        success: false,
        message: 'You can not like your own post.',
      });
    }

    if (article.liked_by.includes(userId)) {
      return res.status(400).json({
        success: false,
        message: 'You arleady liked this article',
      });
    }

    let likes = article.likes;
    let liked_by = article.liked_by;
    likes++;
    liked_by.push(userId);

    const result = await Article.update(
      { _id: articleId },
      { likes, liked_by },
    );

    if (result) {
      return res.status(200).json({
        success: true,
        message: 'You liked an article',
      });
    } else {
      res.status(500).json({
        success: false,
        message: 'Could not like an article',
      });
    }
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Bad request',
    });
  }
};

exports.cancelLikeArticle = async function (req, res) {
  const { type } = req.body;
  const userId = req.user._id;
  const articleId = req.params.article_id;

  try {
    const article = await Article.findOne({ _id: articleId });

    if (article.posted_by.toString() === userId.toString()) {
      return res.status(400).json({
        success: false,
        message: 'You can not unlike your own post.',
      });
    }

    if (!article.liked_by.includes(userId)) {
      return res.status(400).json({
        success: false,
        message: 'You already unliked this article',
      });
    }

    let likes = article.likes;
    let liked_by = article.liked_by;
    likes--;

    const result = await Article.update(
      { _id: articleId },
      {
        likes,
        liked_by: liked_by.filter(
          item => item.toString() !== userId.toString(),
        ),
      },
    );

    if (result) {
      return res.status(200).json({
        success: true,
        message: 'You removed this article from as liked',
      });
    } else {
      res.status(500).json({
        success: false,
        message: 'Could not like an article',
      });
    }
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Bad request',
    });
  }
};

exports.favoriteArticle = async function (req, res) {
  const { type } = req.body;
  const userId = req.user._id;
  const articleId = req.params.article_id;

  try {
    let result;
    if (type) {
      result = await User.findOneAndUpdate(
        { _id: userId },
        {
          $addToSet: { favorites: articleId },
        },
      );
    } else if (!type) {
      result = await User.findOneAndUpdate(
        { _id: userId },
        {
          $pull: { favorites: articleId },
        },
      );
    }

    if (result) {
      return res.status(200).json({
        success: true,
        message: type
          ? 'Added this article as favorite'
          : 'Removed this article from favorites',
      });
    } else {
      res.status(500).json({
        success: false,
        message: type
          ? 'Could not add this article as favorite'
          : 'Could not remove this article from favorites',
      });
    }
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Bad request',
    });
  }
};

exports.getArticleComments = async function (req, res) {
  const articleId = req.params.article_id;

  try {
    const article = await Article.findOne({ _id: articleId })
      .populate({
        path: 'posted_by',
        model: 'User',
        select: '_id firstname lastname email',
      })
      .populate([
        {
          path: 'comments',
          model: 'Comment',
          select: '_id content createdAt updatedAt',
          populate: {
            path: 'commented_by',
            select: 'firstname lastname email',
          },
        },
      ])
      .populate({
        path: 'liked_by',
        model: 'User',
        select: 'firstname lastname email',
      })
      .exec();

    if (article) {
      res.status(200).json({
        success: true,
        article,
      });
    } else {
      res.status(500).json({
        success: false,
        message: 'Could not get an article',
      });
    }
  } catch (error) {
    res.status(400).send({
      success: false,
      message: 'Bad request',
    });
  }
};

exports.createArticleComment = async function (req, res) {
  const articleId = req.params.article_id;
  const userId = req.user._id;
  const { content } = req.body;
  const newComment = {
    content,
    article: articleId,
    commented_by: userId,
  };

  try {
    const comment = await new Comment(newComment);
    const commentResult = await comment.save();

    const result = await Article.findOneAndUpdate(
      { _id: articleId },

      {
        $addToSet: { comments: commentResult._id },
      },
    );

    const aaa = await Comment.findOne({ _id: comment._id })
      .populate({
        path: 'commented_by',
        model: 'User',
        select: '_id email firstname lastname',
      })
      .exec();

    if (result) {
      res.status(200).json({
        success: true,
        message: 'Comment added successfully',
        comment: aaa,
      });
    } else {
      res.status(500).json({
        success: false,
        message: 'Could not add comment',
      });
    }
  } catch (error) {
    res.status(400).send({
      success: false,
      message: 'Bad request',
    });
  }
};

exports.editArticleComment = async function (req, res) {
  const commentId = req.params.comment_id;
  const { content } = req.body;

  try {
    const result = await Comment.findOneAndUpdate(
      { _id: commentId },
      { content },
    );

    if (result) {
      res.status(200).json({
        success: true,
        message: 'Comment updated successfully',
      });
    } else {
      res.status(500).json({
        success: false,
        message: 'Could not update comment',
      });
    }
  } catch (error) {
    res.status(400).send({
      success: false,
      message: 'Bad request',
    });
  }
};

exports.deleteArticleComment = async function (req, res) {
  const commentId = req.params.comment_id;

  try {
    const result = await Comment.deleteOne({ _id: commentId });

    if (result) {
      return res.status(200).json({
        success: true,
        message: 'Comment removed successfully',
      });
    } else {
      res.status(500).json({
        success: false,
        message: 'Could not remove a comment',
      });
    }
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Bad request',
    });
  }
};
