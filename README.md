# Google Sheets Clone

## Overview

This project is a Google Sheets clone developed using **React.js** and **Ant Design**. The application provides an intuitive and functional spreadsheet experience similar to Google Sheets, allowing users to work with data, perform calculations, and apply various formatting options.

## Features

### 1. Cell Editing and Navigation

- Click on a cell to edit its content.
- Navigate through cells using arrow keys or mouse clicks.

### 2. Formatting Options

- **Bold**: Make text bold.
- **Italics**: Italicize text.
- **Font Size**:
  - Use a dropdown to select predefined font sizes.
  - Increment or decrement font size using `+` and `-` buttons.
- **Font Color**:
  - Select custom colors using a color picker.
  - Apply colors to specific cell content.

### 3. Undo and Redo

- Undo and redo changes, including text edits and formatting changes, to maintain version control of your data.

### 4. Drag Handle for Selection and Autofill

- Drag the handle in the bottom-right corner of a cell to copy or autofill data to adjacent cells.

### 6. Mathematical Functions

- Support for commonly used functions:
  - **SUM**: Calculates the sum of a range of cells.
  - **AVERAGE**: Calculates the average of a range of cells.
  - **MAX**: Returns the maximum value from a range of cells.
  - **MIN**: Returns the minimum value from a range of cells.
  - **COUNT**: Counts the number of cells containing numerical values.
- Enter functions directly into a cell (e.g., `=SUM(A1:A5)`) to calculate results dynamically.

### 7. Toolbar Integration

- Easy access to formatting and functionality via a toolbar with icons and tooltips.

### 8. Formula Parsing and Evaluation

- Support for cell references in formulas.
- Automatically calculate and display results for supported functions.

## Technologies Used

### 1. **React.js**

- Core framework for building the user interface.
- Manages the component-based architecture for the spreadsheet application.

### 2. **Ant Design**

- Provides a sleek and modern UI design for the application.
- Components such as buttons, tooltips, and input fields enhance usability and visual appeal.

### 3. **CSS**

- Custom styles to ensure responsive design and handle spreadsheet-specific layouts.

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
4. Open the application in your browser at `http://localhost:3000`.

## Future Enhancements

- Support for additional functions and formulas.
- Integration with cloud storage for saving and loading spreadsheets.
- Collaboration features for multiple users.

## License

This project is licensed under the MIT License. Feel free to use and modify it for your own needs.

---

Thank you for exploring this Google Sheets clone! We hope you enjoy using it as much as we enjoyed building it.
