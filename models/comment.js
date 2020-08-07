const mongoose = require('mongoose');

const { Schema } = mongoose;
const CommentSchema = new Schema(
  {
    content: {
      type: String,
      required: true,
    },
    article: {
      type: Schema.Types.ObjectId,
      ref: 'Article',
      required: true,
    },
    commented_by: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model('Comment', CommentSchema);
