#!/usr/bin/env node

const { input, select } = require("@inquirer/prompts");
const {
  addExpense,
  listExpenses,
  filterExpenses,
  updateExpense,
  sumExpense,
  sumExpenseByMonth,
  removeExpense,
} = require("./utils");

// create an id generator
function cuid() {
  const initials = "PKO";
  const addendum = new Date().getTime();
  const id = initials + addendum;

  return id.toString();
}

// create a expense object
const expense = {
  id: cuid(),
  date: "",
  description: "",
  amount: "",
  category: "",
  createdAt: new Date().toLocaleDateString(),
  updatedAt: new Date().toLocaleDateString(),
};

// terminal command
const commands = {
  add: async () => {
    console.log("Creating a new expense!");
    const date = await input({
      message: "Enter the date (y-m-d): ",
    });
    const description = await input({
      message: "Enter the description: ",
    });
    const amount = await input({
      message: "Enter the amount ($): ",
    });
    const category = await select({
      message: "Select the category: ",
      choices: [
        { name: "Food", value: "Food" },
        { name: "Gadget", value: "Gadget" },
        { name: "Accessories", value: "Accessories" },
        { name: "Others", value: "Others" },
      ],
    });

    if (!date || !description || !amount) {
      console.log("Please enter all fields.");
      process.exit(0);
    } else {
      const newExpense = {
        ...expense,
        date,
        description,
        amount,
        category,
      };
      addExpense(newExpense);
      process.exit(0);
    }
  },

  list: async () => {
    listExpenses();
    process.exit(0);
  },

  filteredList: async () => {
    const filter = await select({
      message: "How do you wish to filter?",
      choices: [
        { name: "Category", value: "category" },
        { name: "Date", value: "date" },
        { name: "Amount", value: "amount" },
      ],
    });
    const value = await input({
      message: "Enter the filter value: ",
    });
    filterExpenses(filter, value);
    process.exit(0);
  },

  summarize: async () => {
    sumExpense();
    process.exit(0);
  },

  summarizeByMonth: async () => {
    const month = await input({
      message: "Enter the month to query (eg: 8): ",
    });
    sumExpenseByMonth(month);
    process.exit(0);
  },

  update: async () => {
    console.log("Updating an expense!");
    const id = await input({
      message: "Enter the expence ID: ",
    });
    const amount = await input({
      message: "Enter the amount ($): ",
    });
    const category = await select({
      message: "Select the category: ",
      choices: [
        { name: "Food", value: "Food" },
        { name: "Gadget", value: "Gadget" },
        { name: "Accessories", value: "Accessories" },
        { name: "Others", value: "Others" },
      ],
    });

    updateExpense(id, amount, category);
    process.exit(0);
  },

  remove: async () => {
    console.log("Removing an expense!");
    const id = await input({
      message: "Enter the ID of the expense: ",
    });

    removeExpense(id);
    process.exit(0);
  },
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
