# Google Sheets-Like Web Application

## Project Overview
This project is a web application designed to mimic the core functionalities and user interface of Google Sheets. The application enables users to perform data entry, apply basic formatting, and utilize essential mathematical and data quality functions. It aims to deliver a seamless, interactive experience similar to Google Sheets, focusing on usability, accuracy, and performance.

## Goals
- Create a spreadsheet interface with Google Sheets-like UI/UX.
- Provide essential mathematical and data quality functions.
- Ensure interactivity through features like drag-and-drop and cell dependency updates.
- Offer additional functionalities such as saving/loading spreadsheets and data visualization for a comprehensive user experience.

## Tech Stack

### Frontend
- **HTML, CSS, JavaScript**: Used for building the core structure, styling, and interactivity of the web application.
- **React.js (Optional)**: For creating a dynamic and efficient UI, enabling real-time updates and component-based design.

### Backend (Optional)
- **Node.js**: Can be used for handling server-side logic and data persistence if required.
- **LocalStorage**: Utilized for client-side storage of spreadsheets without requiring a backend.

### Visualization
- **Chart.js**: Integrated for data visualization to create charts and graphs.

## Features

### Implemented Functionalities

#### Spreadsheet Interface:
- Toolbar and formula bar resembling Google Sheets.
- Interactive grid structure with editable cells.
- Ability to add, delete, and resize rows/columns.
- Drag-and-drop functionality for formulas and cell values.

#### Mathematical Functions:
- **SUM**: Calculates the sum of a range of cells.
- **AVERAGE**: Calculates the average of a range of cells.
- **MAX**: Returns the maximum value from a range of cells.
- **MIN**: Returns the minimum value from a range of cells.
- **COUNT**: Counts the number of cells containing numerical values.

#### Data Quality Functions:
- **TRIM**: Removes leading and trailing whitespace from a cell.
- **UPPER**: Converts text in a cell to uppercase.
- **LOWER**: Converts text in a cell to lowercase.
- **REMOVE_DUPLICATES**: Removes duplicate rows from a selected range.
- **FIND_AND_REPLACE**: Allows users to find and replace specific text within a range of cells.

#### Data Entry and Validation:
- Supports numbers, text, and dates.
- Basic validation for numeric cells.

### Bonus Features
- Save and load spreadsheets as **JSON/CSV** files.
- Data visualization with graphs and charts.
- Advanced formula support with **relative and absolute referencing**.

## Installation and Setup
### Prerequisites
- Node.js and npm installed on your machine.

### Steps
1. Navigate to the project directory:
   ```bash
   cd google-sheets-clone
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm start
   ```
4. Open the application in your browser at:
   ```
   http://localhost:3000
   ```

## Future Enhancements
- Support for additional functions and formulas.
- Integration with cloud storage for saving and loading spreadsheets.
- Collaboration features for multiple users.

## License
This project is licensed under the MIT License. Feel free to use and modify it for your own needs.
