# Markdown Note-taking App

## Overview
A simple note-taking app that lets users upload markdown files, check the grammar, save the note, and render it in HTML. The goal of this project is to help you learn how to handle file uploads in a RESTful API, parse and render markdown files using libraries, and check the grammar of the notes.

## Features
- Created an endpoint to check the grammar of the note.
- Created an endpoint to save the note that can be passed in as Markdown text.
- Created an endpoint to list the saved notes (i.e. uploaded markdown files).
- Return the HTML version of the Markdown note (rendered note) through another endpoint.

## Installation
To install and set up the Markdown Note-taking App, follow these steps:

1. **Clone the repository**:
   ```bash
   git clone https://github.com/PhilipOyelegbin/backend/tree/master/markdown-note-taking.git
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

## Usage
After installation, you can use the following commands to manage your Markdown Note-taking App:

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
Here's an example of how to use the Markdown Note-taking App:

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
