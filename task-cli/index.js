const { input, select, Separator } = require("@inquirer/prompts");

const { addTodo, listTodos, removeTodo, updateTodo } = require("./utils");

// create an id generator
function cuid() {
  const initials = "PKO";
  const addendum = new Date().getTime();
  const id = initials + addendum;

  return id.toString();
}

// create a todo object
const todo = {
  id: cuid(),
  description: "",
  status: "",
  createdAt: new Date().toLocaleDateString(),
  updatedAt: new Date().toLocaleDateString(),
};

// create add command
async function addCommand() {
  const description = await input({
    message: "Enter a new description: ",
  });
  const status = await select({
    message: "Select a status",
    choices: [
      {
        name: "todo",
        value: "todo",
        description: "Yet to start the project.",
      },
      new Separator(),
      {
        name: "in progress",
        value: "in progress",
        description: "Project in development phase.",
      },
      new Separator(),
      {
        name: "done",
        value: "done",
        description: "Project in completed.",
      },
    ],
  });

  const newTodo = { ...todo, description, status };
  addTodo(newTodo);
  process.exit(0);
}

// create list command
async function listCommand() {
  listTodos();
  process.exit(0);
}

// create remove command
async function removeCommand() {
  const id = await input({
    message: "Enter a valid id: ",
  });
  removeTodo(id);
  process.exit(0);
}

// create update command
async function updateCommand() {
  const id = await input({
    message: "Enter a valid id: ",
  });
  const status = await select({
    message: "Select a status",
    choices: [
      {
        name: "todo",
        value: "todo",
        description: "Yet to start the project.",
      },
      {
        name: "in progress",
        value: "in progress",
        description: "Project in development phase.",
      },
      {
        name: "done",
        value: "done",
        description: "Project in completed.",
      },
    ],
  });

  updateTodo(id, status);
  process.exit(0);
}

// group all commands
const commands = {
  add: addCommand,
  list: listCommand,
  remove: removeCommand,
  update: updateCommand,
};

// create an asynchronous terminal command
const args = process.argv.slice(2);

if (args.length > 0) {
  const command = args[0];
  if (commands[command]) {
    commands[command]();
  } else {
    console.error(`Unknown command: ${command}`);
    process.exit(1);
  }
} else {
  console.error("Usage: node index.js <command>");
  process.exit(1);
}
