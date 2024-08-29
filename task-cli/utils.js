const fs = require("fs");
const path = require("path");

const filePath = path.join(__dirname, "todos.json");

// laod task from file
const loadTodos = () => {
  try {
    const dataBuffer = fs.readFileSync(filePath);
    const dataJSON = dataBuffer.toString();
    return JSON.parse(dataJSON);
  } catch (e) {
    return [];
  }
};

// save task to file
const saveTodos = (todos) => {
  const dataJSON = JSON.stringify(todos);
  fs.writeFileSync(filePath, dataJSON);
};

// add task
const addTodo = (newTodo) => {
  const todos = loadTodos();
  const duplicateTodo = todos.find(
    (todo) => todo.description === newTodo.description
  );

  if (!duplicateTodo) {
    todos.push(newTodo);
    saveTodos(todos);
    console.log("New todo added!");
  } else {
    console.log("Todo title taken!");
  }
};

// list task
const listTodos = () => {
  const todos = loadTodos();
  console.log("Your todos:");
  todos.forEach((todo) => {
    console.log(todo);
  });
};

// remove task
const removeTodo = (id) => {
  const todos = loadTodos();
  const todosToKeep = todos.filter((todo) => todo.id !== id);

  if (todos.length > todosToKeep.length) {
    saveTodos(todosToKeep);
    console.log("Todo removed!");
  } else {
    console.log("No todo found!");
  }
};

// update task
const updateTodo = (id, status) => {
  const todos = loadTodos();
  const todo = todos.find((todo) => todo.id === id);

  if (todo) {
    todo.status = status;
    todo.updatedAt = new Date().toLocaleDateString();
    saveTodos(todos);
    console.log("Todo updated!");
  } else {
    console.log("No todo found!");
  }
};

module.exports = {
  addTodo,
  listTodos,
  removeTodo,
  updateTodo,
};
