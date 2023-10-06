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
  DialogTitle,
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';

const App = () => {
  const [selectedTab, setSelectedTab] = useState(0);
  const [showOnlySelected, setShowOnlySelected] = useState(false);
  const [openPopup, setOpenPopup] = useState(false);
  
  const toggleShowOnlySelected = () => {
    // Placeholder function for toggling show only selected
  };

  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
  };

  const handleOpenPopup = () => {
    setOpenPopup(true);
  };

  const handleClosePopup = () => {
    setOpenPopup(false);
  };

  const columns = [
    { field: 'id', headerName: 'ID', width: 70 },
    { field: 'name', headerName: 'Name', width: 130 },
  ];

  const rows = [
    { id: 1, name: 'Combo 1' },
    { id: 2, name: 'Combo 2' },
    // Add more dummy data here
  ];

  return (
    <div>
      <AppBar position="static">
        <Tabs value={selectedTab} onChange={handleTabChange}>
          <Tab label="Combos" />
          <Tab label="Ingredients" />
        </Tabs>
      </AppBar>
      
      <Button onClick={handleOpenPopup}>+</Button>
      <Button onClick={toggleShowOnlySelected}>Show Only Selected</Button>
      
      {selectedTab === 0 && (
        <Paper style={{ height: 400, width: '100%' }}>
          <DataGrid rows={rows} columns={columns} pageSize={5} />
        </Paper>
      )}

      {selectedTab === 1 && (
        <Paper style={{ height: 400, width: '100%' }}>
          <DataGrid rows={rows} columns={columns} pageSize={5} />
        </Paper>
      )}

      <Dialog open={openPopup} onClose={handleClosePopup}>
        <DialogTitle>Select Ingredients</DialogTitle>
        <DialogContent>
          {/* Add ingredient selection UI here */}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClosePopup}>Close</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default App;
