const fs = require("fs");
const path = require("path");

const filePath = path.join(__dirname, "expenses.json");

// load expense from file
const loadExpenses = () => {
  try {
    const dataBuffer = fs.readFileSync(filePath);
    const dataJSON = dataBuffer.toString();
    return JSON.parse(dataJSON);
  } catch (e) {
    return [];
  }
};

// save expense to file
const saveExpenses = (expenses) => {
  const dataJSON = JSON.stringify(expenses);
  fs.writeFileSync(filePath, dataJSON);
};

// add expense
const addExpense = (newExpense) => {
  const expenses = loadExpenses();
  const duplicateExpense = expenses.find(
    (expense) => expense.description === newExpense.description
  );

  if (!duplicateExpense) {
    expenses.push(newExpense);
    saveExpenses(expenses);
    console.log("New expense added!");
  } else {
    console.log("Expense title taken!");
  }
};

// list expenses
const listExpenses = () => {
  const expenses = loadExpenses();
  expenses?.length === 0
    ? console.log("No expenses to list!")
    : console.log("Your expenses: ");

  expenses.forEach((expense) => {
    console.log(expense);
  });
};

// filter expenses
const filterExpenses = (filtering, value) => {
  const expenses = loadExpenses();
  const filteredExpenses = expenses?.filter(
    (expense) => expense[filtering] == value
  );
  filteredExpenses?.length === 0
    ? console.log("No expenses with the value provided to list!")
    : console.log("Your expenses: ");

  filteredExpenses.forEach((expense) => {
    console.log(expense);
  });
};

// summarize expense
const sumExpense = () => {
  console.log("Summarizing all expense!");
  const expenses = loadExpenses();
  const expense = expenses?.map((expense) => Number(expense.amount));

  const sum = expense.reduce((a, b) => a + b);
  console.log("Total expenses: $" + sum);
};

// summarize expense by month
const sumExpenseByMonth = (month) => {
  if (!month) {
    console.log("Please provide a month!");
    process.exit(0);
  }
  let newMonth;
  switch (month) {
    case "1":
      newMonth = "January";
      break;
    case "2":
      newMonth = "February";
      break;
    case "3":
      newMonth = "March";
      break;
    case "4":
      newMonth = "April";
      break;
    case "5":
      newMonth = "May";
      break;
    case "6":
      newMonth = "June";
      break;
    case "7":
      newMonth = "July";
      break;
    case "8":
      newMonth = "August";
      break;
    case "9":
      newMonth = "September";
      break;
    case "10":
      newMonth = "October";
      break;
    case "11":
      newMonth = "November";
      break;
    case "12":
      newMonth = "December";
      break;
    default:
      newMonth = "Invalid";
      break;
  }

  console.log(`Summarizing all expense in the month of ${newMonth}!`);
  const expenses = loadExpenses();
  const expense = expenses
    ?.filter((expense) => expense.date.split("-").slice(1, 2) == Number(month))
    ?.map((expense) => Number(expense.amount));

  if (expense.length <= 0) {
    console.log(`No expenses found in the month of ${newMonth}!`);
    process.exit(0);
  }

  const sum = expense?.reduce((a, b) => a + b);
  console.log(`Total expenses for month ${newMonth}: $${sum}`);
};

// remove expense
const removeExpense = (id) => {
  if (!id) {
    console.log("ID is required!");
  } else {
    const expenses = loadExpenses();
    const expensesToKeep = expenses.filter((expense) => expense.id !== id);

    if (expenses.length > expensesToKeep.length) {
      saveExpenses(expensesToKeep);
      console.log("Expense removed!");
    } else {
      console.log("No expense found!");
    }
  }
};

// update expense
const updateExpense = (id, amount, category) => {
  if (!id || !amount) {
    console.log("Please enter all fields.");
    process.exit(0);
  } else {
    const expenses = loadExpenses();
    const expense = expenses.find((expense) => expense.id === id);

    if (expense) {
      expense.amount = amount;
      expense.category = category;
      expense.updatedAt = new Date().toLocaleDateString();
      saveExpenses(expenses);
      console.log("Expense updated!");
    } else {
      console.log("No expense found!");
    }
  }
};

module.exports = {
  addExpense,
  listExpenses,
  filterExpenses,
  sumExpense,
  sumExpenseByMonth,
  removeExpense,
  updateExpense,
};
