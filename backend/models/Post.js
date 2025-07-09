const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  visibility: { type: String, enum: ['public', 'private'], default: 'public' },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  createdAt: { type: Date, default: Date.now },

  // ✅ Like system
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],

  // ✅ New: Image URL
  imageUrl: { type: String }, // optional image field

  // ✅ New: Comments
  comments: [
    {
      userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      text: { type: String, required: true },
      createdAt: { type: Date, default: Date.now },
    },
  ],
});

module.exports = mongoose.model('Post', PostSchema);
