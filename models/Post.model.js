const { Schema, model } = require('mongoose');


//child model
const commentSchema = new Schema(
  {
    content: String,
    authorId: {type : Schema.Types.ObjectId, ref: 'User'},
    images: [
      {
        imagePath: String,
        imageName: String
      }
    ]
  },
  {timestamps: true}
)


//parent model
const postSchema = new Schema(
  {
    content: String,
    creatorId: {type : Schema.Types.ObjectId, ref: 'User'},
    picPath: String,
    picName: String,
    comments: [commentSchema]
  },
  {timestamps: true}
)

module.exports = model('Post', postSchema);