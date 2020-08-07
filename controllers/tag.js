const _ = require('lodash');
const Tag = require('../models/tag');

exports.getAllTags = async function (req, res) {
  try {
    const tags = await Tag.find();

    if (tags) {
      res.status(200).json({
        success: true,
        tags,
      });
    } else {
      res.status(500).json({
        success: false,
        message: 'Could not get tags',
      });
    }
  } catch (error) {
    res.status(400).send({
      success: false,
      message: 'Bad request',
    });
  }
};

exports.createTag = async function (req, res) {
  const { name } = req.body;

  try {
    const isExist = await Tag.findOne({ name });
    if (isExist) {
      return res.status(400).send({
        success: false,
        message: 'Tag already exists!',
      });
    }

    const tag = await new Tag({ name });
    const result = await tag.save();

    if (result) {
      return res.status(200).json({
        success: true,
        message: 'Tag created successfully',
      });
    } else {
      res.status(500).json({
        success: false,
        message: 'Could not create a tag',
      });
    }
  } catch (error) {
    res.status(400).send({
      success: false,
      message: 'Bad request',
    });
  }
};

exports.editTag = async function (req, res) {
  const tagId = req.params.tag_id;
  const { name } = req.body;

  try {
    const result = await Tag.update({ _id: tagId }, { name });

    if (result) {
      res.status(200).json({
        success: true,
        message: 'Tag updated successfully',
      });
    } else {
      res.status(500).json({
        success: false,
        message: 'Could not update a tag',
      });
    }
  } catch (error) {
    res.status(400).send({
      success: false,
      message: 'Bad request',
    });
  }
};

exports.deleteTag = async function (req, res) {
  const tagId = req.params.tag_id;

  try {
    const result = await Tag.deleteOne({ _id: tagId });

    if (result) {
      return res.status(200).json({
        success: true,
        message: 'Tag removed successfully',
      });
    } else {
      res.status(500).json({
        success: false,
        message: 'Could not remove a tag',
      });
    }
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Bad request',
    });
  }
};
