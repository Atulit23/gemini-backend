const mongoose = require("mongoose");
const { Schema } = mongoose;

const ChatSchema = new Schema({
  userId: {
    type: String, 
    required: true,
  },
  chatId: {
    type: String,
    required: true,
  },
  chats: {
    type: Array
  }
});

const Chat = mongoose.model('chat', ChatSchema);
Chat.createIndexes();
module.exports = Chat