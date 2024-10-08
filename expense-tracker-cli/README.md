# Expense Tracker CLI Application

## Overview
A simple expense tracker application to manage your finances. The application should allow users to add, update, filter, delete, and view their expenses. The application should also provide a summary of the expenses.

## Features
- **Add expenses**: Store expenses to the database.
- **View expenses**: Fetch all expenses from the database.
- **Filter expenses**: Filter expenses from the database by a given filter and value.
- **Sum all expenses**: Add all the prices of expenses together.
- **Sum expenses by month**: Add expenses together based on provided month.
- **Update an expense**: Update an expense in the database.
- **Delete expenses**: Delete an expense from the database.

## Installation
To install and set up the Expense Tracker Application, follow these steps:

1. **Clone the repository**:
   ```bash
   git clone https://github.com/PhilipOyelegbin/backend/tree/master/expense-tracker-cli.git
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

## Usage
After installation, you can use the following commands to manage your expense tracker:

- **Add an expense to the database**:
  ```javascript
  node index.js add
  ```
    or
  ```bash
  ./index.js add
  ```

- **View all expenses from the database**:
  ```javascript
  node index.js list
  ```
    or
  ```bash
  ./index.js list
  ```

- **Filter expenses from the database by a given filter and value**:
  ```javascript
  node index.js filterList
  ```
    or
  ```bash
  ./index.js filterList
  ```

- **Sum all the expenses**:
  ```javascript
  node index.js summarize
  ```
    or
  ```bash
  ./index.js sum
  ```

- **Sum expenses by month**:
  ```javascript
  node index.js summarizeByMonth
  ```
    or
  ```bash
  ./index.js summarizeByMonth
  ```

- **Update expenses in the database by a given filter and value**:
  ```javascript
  node index.js update
  ```
    or
  ```bash
  ./index.js update
  ```

- **Delete an expense from the database**:
  ```javascript
  node index.js remove
  ```
    or
  ```bash
  ./index.js reomve
  ```

## Example
Here's an example of how to use the Expense Tracker CLI Application:

```bash
# Add an expense
./index.js add

# List all expense 
./index.js list

# Filter expenses from the database by a given filter and value
./index.js filterList

# Sum all the expenses
./index.js summarize

# Sum expenses by month
./index.js summarizeByMonth

# Update expenses in the database by a given filter and value
./index.js update

# Remove an expense from the database
./index.js reomve
```

## Contributing
Contributions are welcome! If you have any ideas, suggestions, or bug reports, please open an issue or submit a pull request.

## License
This project is licensed under the ISC License. See the [LICENSE](LICENSE) file for more details.

## Contact
For any questions or inquiries, please contact [contact@philipoyelegbin.com.ng](mailto:contact@philipoyelegbin.com.ng).
