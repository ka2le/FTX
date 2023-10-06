import React, { useState } from 'react';
import {
  AppBar,
  Tabs,
  Tab,
  Button,
  Paper,
  Dialog,
  DialogActions,
  DialogContent,
  Divider,
  IconButton,
  DialogTitle,
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';

function App() {
  const [currentTab, setCurrentTab] = useState(0);
  const [showSelected, setShowSelected] = useState(false);
  const [tableHeight, setTableHeight] = useState(300); // Initial height in pixels

  // Sample Data for DataGrids
  const combos = [
    { id: 1, combo: 'Avocado Toast', ingredients: ['Avocado', 'Bread'] },
    // ... more combos
  ];
  const ingredients = [
    { id: 1, ingredient: 'Avocado', utility: 'High' },
    // ... more ingredients
  ];

  const handleDividerDrag = (e) => {
    // Logic for draggable divider
  };

  return (
    <div>
      {/* Fixed Section */}
      <AppBar position="sticky">
        {/* Selection-Tabs */}
        <Tabs value={currentTab} onChange={(e, newVal) => setCurrentTab(newVal)}>
          <Tab label="Tab 1" />
          <Tab label="Tab 2" />
          {/* Add Tab Button */}
          <Button color="inherit">Add Tab</Button>
        </Tabs>
        {/* Selection-Field and "+" Button */}
        <div>
          <span>Selected Ingredients Here</span>
          <Button color="inherit">+</Button>
        </div>
        {/* Toggle Button */}
        <Button color="inherit" onClick={() => setShowSelected(!showSelected)}>
          {showSelected ? 'Show All' : 'Show Only Selected'}
        </Button>
      </AppBar>

      {/* Scrollable Section */}
      <div style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 64px)' }}>
        {/* Combos Table */}
        <Paper style={{ height: tableHeight, overflow: 'auto' }}>
          <DataGrid rows={combos} columns={[{ field: 'combo', headerName: 'Combo' }, { field: 'ingredients', headerName: 'Ingredients' }]} />
        </Paper>
        {/* Draggable Divider */}
        <Divider orientation="horizontal" />
        <div>
          <IconButton onClick={() => setTableHeight(tableHeight - 20)}>
            <ArrowUpwardIcon />
          </IconButton>
          <IconButton onClick={() => setTableHeight(tableHeight + 20)}>
            <ArrowDownwardIcon />
          </IconButton>
        </div>
        {/* Ingredient Utility Table */}
        <Paper style={{ flex: 1, height: `calc(100vh - ${tableHeight + 64}px)`, overflow: 'auto' }}>
          <DataGrid rows={ingredients} columns={[{ field: 'ingredient', headerName: 'Ingredient' }, { field: 'utility', headerName: 'Utility' }]} />
        </Paper>
      </div>
    </div>
  );
}

export default App;
