import React, { useState, useEffect, useRef } from "react";
import {
  Input,
  Button,
  Row,
  Col,
  Space,
  Popover,
  Menu,
  Tooltip,
} from "antd";
import {
  BoldOutlined,
  ItalicOutlined,
  AlignLeftOutlined,
  AlignCenterOutlined,
  AlignRightOutlined,
  UndoOutlined,
  RedoOutlined,
  BgColorsOutlined,
  FontSizeOutlined,
  PlusOutlined,
  MinusOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import "./App.css";
import { SketchPicker } from "react-color"; // Import color picker

const Spreadsheet = () => {
  const [cells, setCells] = useState({});
  const [selectedCells, setSelectedCells] = useState([]); // Track selected cells
  const [fontStyle, setFontStyle] = useState({ bold: false, italic: false });
  const [alignment, setAlignment] = useState("left");
  const [focusCell, setFocusCell] = useState(null); // Track currently focused cell
  const startSelectionRef = useRef(null); // Ref to track the start of selection
  const [dragging, setDragging] = useState(false);
  const [dragStartCell, setDragStartCell] = useState(null);
  const [dragHandleActive, setDragHandleActive] = useState(false);
  const [undoStack, setUndoStack] = useState([]);
  const [redoStack, setRedoStack] = useState([]);
  const [fontSize, setFontSize] = useState(12);
  const [fontColor, setFontColor] = useState("#000000");
  const [selectedCell, setSelectedCell] = useState(null);

  const [maxRow, setMaxRow] = useState(10); // Number of rows
  const [maxCol, setMaxCol] = useState(10); // Number of columns (A-J)

  const initializeCells = (rows, cols) => {
    const initialCells = {};
    for (let row = 1; row <= rows; row++) {
      for (let col = 1; col <= cols; col++) {
        const cellId = `${String.fromCharCode(64 + col)}${row}`;
        initialCells[cellId] = {
          value: "",
          bold: false,
          italic: false,
          alignment: "left",
          fontSize: 12,
          fontColor: "#000000",
        };
      }
    }
    setCells(initialCells);
  };

  // Initialize the cells grid
  useEffect(() => {
    initializeCells(maxRow, maxCol);
  }, [maxRow, maxCol]);

  const saveState = () => {
    setUndoStack((prev) => [...prev, JSON.parse(JSON.stringify(cells))]);
    setRedoStack([]); // Clear redo stack on new changes
  };

  // Handle cell change
  const handleCellChange = (e, cellId) => {
    saveState(); // Save current state
    const value = e.target.value;
    setCells((prev) => ({
      ...prev,
      [cellId]: { ...prev[cellId], value },
    }));
  };

  const handleUndo = () => {
    if (undoStack.length === 0) return;
    setRedoStack((prev) => [...prev, JSON.parse(JSON.stringify(cells))]);
    const lastState = undoStack.pop();
    setUndoStack([...undoStack]);
    setCells(lastState);
  };

  const handleRedo = () => {
    if (redoStack.length === 0) return;
    setUndoStack((prev) => [...prev, JSON.parse(JSON.stringify(cells))]);
    const nextState = redoStack.pop();
    setRedoStack([...redoStack]);
    setCells(nextState);
  };

  // Handle keyboard navigation and multi-cell selection with shift
  const handleKeyDown = (e) => {
    if (!focusCell) return; // Exit if no cell is selected yet

    const [col, row] = focusCell.split("");
    const currentCol = col.charCodeAt(0);
    const currentRow = Number(row);

    let newSelection = [...selectedCells];

    if (e.key === "ArrowRight" && currentCol < 64 + maxCol) {
      // Ensure we do not exceed column 'J'
      const nextCell = `${String.fromCharCode(currentCol + 1)}${currentRow}`;
      if (e.shiftKey) {
        newSelection = getCellRange(startSelectionRef.current, nextCell);
      } else {
        newSelection = [nextCell];
      }
    } else if (e.key === "ArrowLeft" && currentCol > 65) {
      // Ensure we do not exceed column 'A'
      const prevCell = `${String.fromCharCode(currentCol - 1)}${currentRow}`;
      if (e.shiftKey) {
        newSelection = getCellRange(startSelectionRef.current, prevCell);
      } else {
        newSelection = [prevCell];
      }
    } else if (e.key === "ArrowDown" && currentRow < maxRow) {
      // Ensure we do not exceed row 10
      const nextRowCell = `${col}${currentRow + 1}`;
      if (e.shiftKey) {
        newSelection = getCellRange(startSelectionRef.current, nextRowCell);
      } else {
        newSelection = [nextRowCell];
      }
    } else if (e.key === "ArrowUp" && currentRow > 1) {
      // Ensure we do not go below row 1
      const prevRowCell = `${col}${currentRow - 1}`;
      if (e.shiftKey) {
        newSelection = getCellRange(startSelectionRef.current, prevRowCell);
      } else {
        newSelection = [prevRowCell];
      }
    }

    // Update selected cells
    setFocusCell(newSelection[newSelection.length - 1]);
    setSelectedCells(newSelection);
  };

  // Get the range of selected cells between two points
  const getCellRange = (start, end) => {
    const [startCol, startRow] = start.split("");
    const [endCol, endRow] = end.split("");

    const selectedRange = [];
    const colStart = Math.min(startCol.charCodeAt(0), endCol.charCodeAt(0));
    const colEnd = Math.max(startCol.charCodeAt(0), endCol.charCodeAt(0));
    const rowStart = Math.min(Number(startRow), Number(endRow));
    const rowEnd = Math.max(Number(startRow), Number(endRow));

    // Loop through columns and rows in the selected range
    for (let row = rowStart; row <= rowEnd; row++) {
      for (let col = colStart; col <= colEnd; col++) {
        const cellId = `${String.fromCharCode(col)}${row}`;
        if (row <= maxRow && col <= 64 + maxCol) {
          // Boundaries for rows and columns (1-10 rows and A-J columns)
          selectedRange.push(cellId);
        }
      }
    }

    return selectedRange;
  };

  const handleDragStart = (cellId) => {
    setDragStartCell(cellId);
    setDragging(true);
  };

  const handleDragMove = (endCell) => {
    if (!dragging || !dragStartCell) return;

    const range = getCellRange(dragStartCell, endCell);
    setSelectedCells(range);
  };

  const handleDragEnd = () => {
    if (!dragging || selectedCells.length === 0) return;

    const startValue = cells[dragStartCell]?.value || "";
    const updatedCells = { ...cells };

    selectedCells.forEach((cellId) => {
      updatedCells[cellId] = { ...updatedCells[cellId], value: startValue };
    });

    setCells(updatedCells);
    setDragging(false);
    setDragStartCell(null);
    setDragHandleActive(false);
  };

  // Handle mouse down to start selection
  const handleMouseDown = (cellId) => {
    startSelectionRef.current = cellId;
    setSelectedCells([cellId]);
  };

  // Handle cell selection and style application
  const handleCellSelect = (cellId) => {
    setFocusCell(cellId);
    setSelectedCells([cellId]);
    setSelectedCell(cellId);
  };

  // Apply formula and calculate the result when pressing Enter
  const handleKeyDownCheck = (e, cellId) => {
    if (e.key === "Enter") {
      const formula = cells[cellId]?.value;
      if (formula) {
        const result = calculateFormula(formula);
        setCells((prev) => ({
          ...prev,
          [cellId]: { ...prev[cellId], value: result },
        }));
      }
    }
  };

  // Apply formatting to all selected cells
  const applyFormatting = (newStyle) => {
    saveState(); // Save current state
    setSelectedCells((prevSelectedCells) => {
      const updatedCells = [...prevSelectedCells];
      updatedCells.forEach((cellId) => {
        setCells((prevCells) => ({
          ...prevCells,
          [cellId]: { ...prevCells[cellId], ...newStyle },
        }));
      });
      return updatedCells;
    });
  };

  // Toggle bold formatting for selected cells
  const handleBoldToggle = () => {
    const newBold = !fontStyle.bold;
    setFontStyle((prev) => ({ ...prev, bold: newBold }));
    applyFormatting({ bold: newBold });
  };

  // Toggle italic formatting for selected cells
  const handleItalicToggle = () => {
    const newItalic = !fontStyle.italic;
    setFontStyle((prev) => ({ ...prev, italic: newItalic }));
    applyFormatting({ italic: newItalic });
  };

  // Change text alignment for the selected cells
  const handleAlignmentChange = (align) => {
    setAlignment(align);
    applyFormatting({ alignment: align });
  };

  // Apply formatting on keyboard shortcut (Ctrl+B, Ctrl+I, etc.)
  const handleShortcut = (e) => {
    if (e.ctrlKey || e.metaKey) {
      switch (e.key) {
        case "b":
          handleBoldToggle();
          break;
        case "i":
          handleItalicToggle();
          break;
        case "l":
          handleAlignmentChange("left");
          break;
        case "c":
          handleAlignmentChange("center");
          break;
        case "r":
          handleAlignmentChange("right");
          break;
        default:
          break;
      }
    }
  };

  // Register the keyboard shortcut listeners
  useEffect(() => {
    window.addEventListener("keydown", handleShortcut);
    return () => {
      window.removeEventListener("keydown", handleShortcut);
    };
  }, []);

  const handleMouseEnter = (cellId) => {
    if (dragging) handleDragMove(cellId);
  };

  const handleFontSizeChange = (size) => {
    setFontSize(size);
    applyFormatting({ fontSize: size });
  };

  const increaseFontSize = () => {
    setFontSize((prevSize) => {
      const newSize = prevSize + 2;
      applyFormatting({ fontSize: newSize });
      return newSize;
    });
  };

  const decreaseFontSize = () => {
    setFontSize((prevSize) => {
      const newSize = prevSize > 6 ? prevSize - 2 : prevSize; // Min font size 6
      applyFormatting({ fontSize: newSize });
      return newSize;
    });
  };

  const handleFontColorChange = (color) => {
    setFontColor(color.hex); // Set color in HEX format
    applyFormatting({ fontColor: color.hex });
  };

  // Render the grid with applied formatting
  const renderGrid = () => {
    let grid = [];
    for (let row = 1; row <= maxRow; row++) {
      let rowCells = [];
      for (let col = 1; col <= maxCol; col++) {
        const cellId = `${String.fromCharCode(64 + col)}${row}`;
        const cell = cells[cellId] || {};
        const isSelected = selectedCells.includes(cellId);
        const showDragHandle =
          isSelected &&
          selectedCells[selectedCells.length - 1] === cellId &&
          selectedCells.length === 1;

        rowCells.push(
          <Col
            span={2}
            key={cellId}
            className={`cell-container ${isSelected ? "selected-cell" : ""}`}
            onClick={() => handleCellSelect(cellId)} // Toggle cell selection
            onMouseDown={() => handleMouseDown(cellId)} // Start selection with mouse
            onMouseUp={() => handleDragEnd()}
            onMouseEnter={() => handleMouseEnter(cellId)}
          >
            <Input
              value={cell.value || ""}
              onChange={(e) => handleCellChange(e, cellId)}
              onClick={() => handleCellSelect(cellId)}
              onKeyDown={(e) => handleKeyDownCheck(e, cellId)}
              placeholder={cellId}
              style={{
                fontWeight: cell.bold ? "bold" : "normal",
                fontStyle: cell.italic ? "italic" : "normal",
                textAlign: cell.alignment || "left",
                fontSize: cell.fontSize || fontSize, // Apply font size here
                color: cell.fontColor || fontColor, // Apply font color here
              }}
            />
            {/* Drag Handle */}
            {showDragHandle && (
              <div
                className="drag-handle"
                onMouseDown={() => handleDragStart(cellId)}
                onMouseUp={() => handleDragEnd()}
              ></div>
            )}
          </Col>
        );
      }
      grid.push(
        <Row
          key={row}
          gutter={[8, 0]}
          style={{ flexWrap: "noWrap", margin: 0 }}
        >
          {rowCells}
        </Row> // Ensure each row is separated here
      );
    }
    return grid;
  };

  const addRow = () => {
    setMaxRow(maxRow + 1);
    initializeCells(maxRow + 1, maxCol); // Reinitialize the grid with new row
  };

  const removeRow = () => {
    if (maxRow > 1) {
      setMaxRow(maxRow - 1);
      initializeCells(maxRow - 1, maxCol); // Reinitialize the grid with removed row
    }
  };

  const addColumn = () => {
    setMaxCol(maxCol + 1);
    initializeCells(maxRow, maxCol + 1); // Reinitialize the grid with new column
  };

  const removeColumn = () => {
    if (maxCol > 1) {
      setMaxCol(maxCol - 1);
      initializeCells(maxRow, maxCol - 1); // Reinitialize the grid with removed column
    }
  };

  // Parse a range like "A1:D1" and return an array of cell IDs
  const parseRange = (range) => {
    const [start, end] = range.split(":");
    const startCol = start.charCodeAt(0);
    const startRow = parseInt(start.slice(1));
    const endCol = end.charCodeAt(0);
    const endRow = parseInt(end.slice(1));

    const cellIds = [];
    for (let row = startRow; row <= endRow; row++) {
      for (let col = startCol; col <= endCol; col++) {
        cellIds.push(`${String.fromCharCode(col)}${row}`);
      }
    }
    return cellIds;
  };

  const calculateFormula = (formula) => {
    if (!formula.startsWith("=")) return formula;

    const match = formula.match(/=(\w+)\((.+)\)/);
    if (!match) return formula;

    const [, functionName, range] = match;

    const cellRefs = range.includes(":") ? parseRange(range) : range.split(",");
    const values = cellRefs
      .map((ref) => parseFloat(cells[ref.trim()]?.value) || NaN)
      .filter((value) => !isNaN(value));

    switch (functionName.toUpperCase()) {
      case "SUM":
        return values.reduce((sum, val) => sum + val, 0);

      case "AVERAGE":
        return values.length
          ? values.reduce((sum, val) => sum + val, 0) / values.length
          : 0;

      case "MAX":
        return values.length ? Math.max(...values) : 0;

      case "MIN":
        return values.length ? Math.min(...values) : 0;

      case "COUNT":
        return values.length;

      default:
        return formula; // Return the formula unchanged if unsupported
    }
  };

  const insertFormula = (functionName) => {
    if (selectedCell) {
      const col = selectedCell.charCodeAt(0) - 64;
      const newFormula = `=${functionName}(${String.fromCharCode(64 + col)}1,)`;
      setCells((prev) => ({
        ...prev,
        [selectedCell]: { ...prev[selectedCell], value: newFormula },
      }));
    }
  };

  const fontSizeMenu = (
    <Menu>
      {[6, 8, 10, 12, 14, 16, 18, 20].map((size) => (
        <Menu.Item key={size} onClick={() => handleFontSizeChange(size)}>
          {size}px
        </Menu.Item>
      ))}
    </Menu>
  );

  return (
    <div
      className="app-container"
      tabIndex="0"
      onKeyDown={handleKeyDown}
      style={{ outline: "none" }}
    >
      <div className="toolbar">
        <Space size={[8, 16]} wrap>
          <Tooltip title="Bold (Ctrl+B)">
            <Button
              type={fontStyle.bold ? "primary" : "default"}
              icon={<BoldOutlined />}
              onClick={handleBoldToggle}
            />
          </Tooltip>
          <Tooltip title="Italic (Ctrl+I)">
            <Button
              type={fontStyle.italic ? "primary" : "default"}
              icon={<ItalicOutlined />}
              onClick={handleItalicToggle}
            />
          </Tooltip>
          <Tooltip title="Align Left">
            <Button
              icon={<AlignLeftOutlined />}
              onClick={() => handleAlignmentChange("left")}
            />
          </Tooltip>
          <Tooltip title="Align Center">
            <Button
              icon={<AlignCenterOutlined />}
              onClick={() => handleAlignmentChange("center")}
            />
          </Tooltip>
          <Tooltip title="Align Right">
            <Button
              icon={<AlignRightOutlined />}
              onClick={() => handleAlignmentChange("right")}
            />
          </Tooltip>
          <Tooltip title="Increase Font Size">
            <Button icon={<PlusOutlined />} onClick={increaseFontSize} />
          </Tooltip>
          <Tooltip title="Decrease Font Size">
            <Button icon={<MinusOutlined />} onClick={decreaseFontSize} />
          </Tooltip>
          <Tooltip title="Select Font Size">
            <Popover content={fontSizeMenu} trigger="click">
              <Button icon={<FontSizeOutlined />} />
            </Popover>
          </Tooltip>
          <Tooltip title="Font Color">
            <Popover
              content={
                <SketchPicker
                  color={fontColor}
                  onChange={handleFontColorChange}
                />
              }
              trigger="click"
            >
              <Button icon={<BgColorsOutlined />} />
            </Popover>
          </Tooltip>
          <Space>
            <Tooltip title="Undo">
              <Button
                icon={<UndoOutlined />}
                onClick={handleUndo}
                disabled={undoStack.length === 0}
              />
            </Tooltip>
            <Tooltip title="Redo">
              <Button
                icon={<RedoOutlined />}
                onClick={handleRedo}
                disabled={redoStack.length === 0}
              />
            </Tooltip>
            <Tooltip title="Add Row">
              <Button icon={<PlusOutlined />} onClick={addRow} />
            </Tooltip>
            <Tooltip title="Remove Row">
              <Button icon={<DeleteOutlined />} onClick={removeRow} />
            </Tooltip>
            <Tooltip title="Add Column">
              <Button icon={<PlusOutlined />} onClick={addColumn} />
            </Tooltip>
            <Tooltip title="Remove Column">
              <Button icon={<DeleteOutlined />} onClick={removeColumn} />
            </Tooltip>
            <Tooltip title="SUM">
              <Button
                icon={<BoldOutlined />}
                onClick={() => insertFormula("SUM")}
              >
                SUM
              </Button>
            </Tooltip>
            <Tooltip title="AVERAGE">
              <Button
                icon={<BoldOutlined />}
                onClick={() => insertFormula("AVERAGE")}
              >
                AVERAGE
              </Button>
            </Tooltip>
            <Tooltip title="MAX">
              <Button
                icon={<BoldOutlined />}
                onClick={() => insertFormula("MAX")}
              >
                MAX
              </Button>
            </Tooltip>
            <Tooltip title="MIN">
              <Button
                icon={<BoldOutlined />}
                onClick={() => insertFormula("MIN")}
              >
                MIN
              </Button>
            </Tooltip>
            <Tooltip title="COUNT">
              <Button
                icon={<BoldOutlined />}
                onClick={() => insertFormula("COUNT")}
              >
                COUNT
              </Button>
            </Tooltip>
          </Space>
        </Space>
      </div>
      <div className="grid-container">{renderGrid()}</div>
    </div>
  );
};

export default Spreadsheet;
