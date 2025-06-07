import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";


dotenv.config();
// import initApp from "./src/modules/index.router.js";

// const app = express();
// const PORT = process.env.PORT || 6005;

// initApp(app, express);

// app.listen(PORT, () => {
//   console.log(`listening on port ${PORT}`);
// });


//const express = require('express');
//const mongoose = require('mongoose');
//const cors = require('cors'); // Import CORS

const app = express();
const PORT = 3000;

// Use CORS Middleware
// CORS Configuration - Make sure this allows your frontend
app.use(cors({
  origin: ['http://localhost:3000','http://localhost:5173', 'http://127.0.0.1:5173'],
  credentials: true
}));
// app.use(cors());

// Middleware to parse JSON data
app.use(express.json());

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  console.log('Body:', req.body);
  next();
});

// MongoDB Connection URI
const MONGO_URI = process.env.MONGODB_URI;
//const MONGO_URI = 'mongodb://mongo-shared-dev:fikTpih4U2!@20.218.241.192:27017/?directConnection=true&appName=mongosh+1.8.2&authMechanism=DEFAULT';

const dbname = 'todos';

// Connect to MongoDB
mongoose
  .connect(MONGO_URI, { dbname })
  .then(() => console.log('Connected to MongoDB'))
  .catch((error) => console.error('MongoDB connection error:', error));

// Mongoose Schema and Model
const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true },
  age: { type: Number, default: 18 },
});

const todoSchema = new mongoose.Schema({
  title: { type: String, },
  date: { type: String, },
  activity: { type: String, },
  description: { type: String, },
  strStatus: { type: String, }
});



const User = mongoose.model('User', userSchema);
const Todos = mongoose.model('Todos', todoSchema);

// Health check route
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'healthy', 
    timestamp: new Date().toISOString(),
    service: 'todo-backend'
  });
});

// Your existing code...


// Route: Fetch all users
app.get('/api/users', async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});
// Route: Fetch all users
app.post('/api/todos', async (req, res) => {
  const { title, description, activity, date, strStatus } = req.body;

  try {
    const todo = new Todos({
      title,
      description,
      activity,
      date,
      strStatus
    });
    await todo.save();

    return res.status(201).send({ todo });
  } catch (error) {
    // if (error.errors.title)
    //   return res.status(400).send({ message: "the Title field is required" });

    // if (error.errors.description)
    //   return res
    //     .status(400)
    //     .send({ message: "the Description field is required" });

    // return res.status(500).send({ message: "Internal server error" });
    console.log(error);
    return res.status(500).send({ message: error });
  }
});
// Route: Fetch all users
app.get('/api/gettodos', async (req, res) => {

  try {

    const todoList = await Todos.find();

    return res.status(201).send({ todoList });
  } catch (error) {
    // if (error.errors.title)
    //   return res.status(400).send({ message: "the Title field is required" });

    // if (error.errors.description)
    //   return res
    //     .status(400)
    //     .send({ message: "the Description field is required" });

    // return res.status(500).send({ message: "Internal server error" });
    console.log(error);
    return res.status(500).send({ message: error });
  }
});

// Route to Delete todo 
app.delete('/api/todos/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const deletedTodo = await Todos.deleteOne({ _id: id });
    
    if (deletedTodo.deletedCount === 0) {
      return res.status(404).json({ message: "No todo found with this id" });
    }
    
    return res.status(200).json({ message: "Todo deleted successfully" });
  } catch (error) {
    console.log('Delete error:', error);
    
    if (error.name === 'CastError') {
      return res.status(400).json({ message: "Invalid todo ID format" });
    }
    
    return res.status(500).json({ message: "Internal server error" });
  }
});

// Routes
app.get('/', async (req, res) => {
  try {
    //const Todo = await TodoModel.find();
    res.send("Todo");
  }
  catch (e) {
    console.log(e);
  }

});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

