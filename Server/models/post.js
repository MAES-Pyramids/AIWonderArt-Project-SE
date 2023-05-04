const mongoose = require('mongoose');
//-------------------Schema----------------//
const postsSchema = new mongoose.Schema({
  name: { type: String, required: true },
  prompt: { type: String, required: true },
  photo: { type: String, required: true }
});
//--------------------Model------------------//
const Post = mongoose.model('Post', postsSchema);
//--------------------Export-----------------//
module.exports = Post;
