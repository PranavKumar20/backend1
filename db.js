const mongoose = require("mongoose");
const uri = "mongodb+srv://pranav:password0155@cluster0.mtaa3ai.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

mongoose.connect(uri);

const userSchema = mongoose.Schema({
  email: {
    type: String,
    required: true,
    trim: true,
  },
  fullname: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
});
const Users = mongoose.model("User", userSchema);

const todosSchema = mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  status:{
    type:String,
    required:true,
  },
  priority:{
    type: String,
  },
  deadline:{
    type:Date,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Users",
    required: true,
  },
});
const Todos = mongoose.model("Todos", todosSchema);


module.exports = {
  Users,
  Todos,
};
