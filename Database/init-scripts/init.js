// Initialize the todos database
db = db.getSiblingDB('todos');

// Create a collection and insert sample data
db.todos.insertMany([
  {
    title: "The boys of Oyarifa",
    description: "The boys are going to school today on 6/6/2025",
    isCompleted: false,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    title: "Building Okuani Adamfo", 
    description: "I recently developed an app that can detect crop prest infection on plants making farmers work easy",
    isCompleted: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    title: "Test", 
    description: "This is a submission test I am doing for Azubi Africa Program",
    isCompleted: true,
    createdAt: new Date(),
    updatedAt: new Date()
  }
]);

// Create indexes for better performance
db.todos.createIndex({ "title": "text", "description": "text" });
db.todos.createIndex({ "createdAt": -1 });

print("Database initialized successfully");
