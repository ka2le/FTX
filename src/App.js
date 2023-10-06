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
  styled  
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';

const SmallTabs = styled(Tabs)({
  fontSize: '0.7rem',
});

const SelectionField = styled('div')({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
});

const SmallIcon = styled('span')({
  fontSize: '1rem',
});

function App() {
  const [currentTab, setCurrentTab] = useState(0);
  const [showSelected, setShowSelected] = useState(false);
  const [tableHeight, setTableHeight] = useState(300); // Initial height in pixels
  // Sample Data for DataGrids

  const combos = [{
    combo: "Cheeseburger", items: ["Beef", "Cheese", "Lettuce", "Tomato",
      "Hamburger Buns"]
  }, { combo: "Chicken Burger", items: ["Chicken", "Onion", "Lettuce", "Hamburger Buns",] }, { combo: "BBQ Pork", items: ["Pork", "Onion", "Cheese", "Hamburger Buns",] }, {
    combo: "Vegan Burger",
    items: ["Tofu", "Mushroom", "Lettuce", "Hamburger Buns",]
  }, { combo: "Fish Burger", items: ["Fish", "Lemon", "Lettuce", "Hamburger Buns",] }, {
    combo: "Shrimp-Avocado", items: ["Shrimp", "Avocado", "Lettuce",
      "Hamburger Buns",]
  }, { combo: "Loaded Fries", items: ["Potato", "Cheese", "Garlic", "Oil",] }, { combo: "Carne Asada", items: ["Beef", "Onion", "Lime", "Tortilla",] }, {
    combo: "Chicken Taco", items: ["Chicken",
      "Avocado", "Cilantro", "Tortilla",]
  }, { combo: "Baja Fish", items: ["Fish", "Cabbage", "Lime", "Tortilla",] }, { combo: "Shrimp Taco", items: ["Shrimp", "Garlic", "Chili", "Tortilla", "Pineapple"] }, {
    combo: "Al Pastor",
    items: ["Pork", "Pineapple", "Cilantro", "Tortilla",]
  }, { combo: "Vegan Taco", items: ["Tofu", "Mushroom", "Avocado", "Tortilla",] }, { combo: "Bean Burrito", items: ["Beans", "Rice", "Cheese", "Tortilla", "Lime"] },
  { combo: "Elote", items: ["Corn", "Cheese", "Chili", "Lime",] }, { combo: "Smoky Pork", items: ["Pork", "Spices", "Garlic", "Corn Bread",] }, {
    combo: "Lemon Chicken",
    items: ["Chicken", "Lemon", "Spices", "Corn Bread",]
  }, { combo: "Beef Brisket", items: ["Beef", "Corn Bread", "Spices", "Corn",] }, {
    combo: "Grilled Fish",
    items: ["Fish", "Lemon", "Oil", "Corn Bread",]
  }, { combo: "Spicy Shrimp", items: ["Shrimp", "Chili", "Garlic", "Corn Bread", "Corn"] }, {
    combo: "Vegan Platter",
    items: ["Tofu", "Spices", "Mushroom", "Corn Bread", "Corn"]
  }, { combo: "Rice & Beans", items: ["Beans", "Rice", "Oil", ,] }, {
    combo: "Marinara",
    items: ["Pasta", "Beef", "Tomato", ,]
  }, { combo: "Alfredo", items: ["Pasta", "Chicken", "Garlic", ,] }, {
    combo: "Seafood Linguini",
    items: ["Pasta", "Fish", "Lemon", ,]
  }, { combo: "Scampi", items: ["Pasta", "Shrimp", "Tomato", ,] }, { combo: "Carbonara", items: ["Pasta", "Egg", "Cheese", "Pork",] },
  { combo: "Risotto", items: ["Rice", "Mushroom", "Cheese", ,] }, { combo: "Pancakes", items: ["Egg", "Flour", "Milk", ,] }, { combo: "Curry", items: ["Chicken", "Naan", "Spices", ,] },
  { combo: "Korma", items: ["Beef", "Naan", "Garlic", "Peanuts",] }, { combo: "Vindaloo", items: ["Pork", "Naan", "Chili", ,] }, { combo: "Seafood Curry", items: ["Fish", "Rice", "Spices", "Shrimp",] },
  { combo: "Tikka", items: ["Shrimp", "Naan", "Spices", ,] }, { combo: "Samosas", items: ["Flour", "Beans", "Spices", ,] }, { combo: "Bhurji", items: ["Egg", "Naan", "Onion", ,] },
  { combo: "Dal", items: ["Rice", "Beans", "Spices", ,] }, { combo: "Souvlaki", items: ["Chicken", "Pita", "Cucumber", ,] }, { combo: "Gyro", items: ["Beef", "Pita", "Tomato", "Cucumber", "Potato"] },
  { combo: "Pork Wrap", items: ["Pork", "Pita", "Onion", ,] }, { combo: "Fish Pita", items: ["Fish", "Pita", "Lemon", ,] }, { combo: "Saganaki", items: ["Shrimp", "Pita", "Garlic", ,] },
  { combo: "Vegan Pocket", items: ["Tofu", "Pita", "Lettuce", "Cucumber", "Basil"] }, { combo: "Ham Omelette", items: ["Egg", "Cheese", "Pork", ,] },
  { combo: "Tomato Omelette", items: ["Egg", "Cheese", "Tomato", ,] }, { combo: "Char Siu", items: ["Pork", "Bao Buns", "Soy Sauce", ,] },
  { combo: "Chicken Bao", items: ["Chicken", "Bao Buns", "Ginger", "Peanuts",] }, { combo: "Beef Bao", items: ["Beef", "Bao Buns", "Onion", "Ginger",] },
  { combo: "Fish Bao", items: ["Fish", "Bao Buns", "Lemon", "Cabbage",] }, { combo: "Shrimp Bao", items: ["Shrimp", "Bao Buns", "Garlic", ,] }
    , { combo: "Tofu Bao", items: ["Tofu", "Bao Buns", "Cucumber", "Soy Sauce", "Peanuts"] }, { combo: "Shitake Stir Fry", items: ["Rice", "Ginger", "Mushroom", "Oil", "Onion"] }];
  const ingredients = [
    { name: "Cheese", level: 2, copies: 4 }, { name: "Spices", level: 2, copies: 4 }, { name: "Pork", level: 1, copies: 4 }, { name: "Shrimp", level: 1, copies: 4 }, { name: "Garlic", level: 1, copies: 4 }, { name: "Beef", level: 2, copies: 3 }, { name: "Chicken", level: 2, copies: 3 }, { name: "Fish", level: 2, copies: 3 }, { name: "Onion", level: 2, copies: 3 }, { name: "Tortilla", level: 2, copies: 3 }, { name: "Rice", level: 3, copies: 2 }, { name: "Lemon", level: 3, copies: 2 }, { name: "Corn Bread", level: 3, copies: 2 }, { name: "Pita", level: 3, copies: 2 }, { name: "Bao Buns", level: 3, copies: 2 }, { name: "Lettuce", level: 3, copies: 2 }, { name: "Hamburger Buns", level: 3, copies: 2 }, { name: "Tofu", level: 2, copies: 2 }, { name: "Pasta", level: 2, copies: 2 }, { name: "Egg", level: 2, copies: 2 }, { name: "Mushroom", level: 2, copies: 2 }, { name: "Naan", level: 2, copies: 2 }, { name: "Tomato", level: 2, copies: 2 }, { name: "Beans", level: 1, copies: 2 }, { name: "Corn", level: 1, copies: 2 }, { name: "Chili", level: 1, copies: 2 }, { name: "Lime", level: 1, copies: 2 }, { name: "Oil", level: 1, copies: 2 }, { name: "Cucumber", level: 1, copies: 2 }, { name: "Peanuts", level: 1, copies: 2 }, { name: "Avocado", level: 1, copies: 2 }, { name: "Ginger", level: 1, copies: 2 }, { name: "Potato", level: 1, copies: 1 }, { name: "Flour", level: 1, copies: 1 }, { name: "Cabbage", level: 1, copies: 1 }, { name: "Pineapple", level: 1, copies: 1 }, { name: "Cilantro", level: 1, copies: 1 }, { name: "Soy Sauce", level: 1, copies: 1 }, { name: "Basil", level: 1, copies: 1 }, { name: "Milk", level: 1, copies: 1 }
    // ... more ingredients
  ];

  const handleDividerDrag = (e) => {
    // Logic for draggable divider
  };


  const tableSettings = {
    hideFooter: true,
    rowsPerPageOptions: [100],
    pageSize: 100,
    autoHeight: true,
    rowHeight: 30,
    disableExtendRowFullWidth: true,
    disableColumnMenu: true,
  };

  

  return (
    <div>
     {/* Fixed Section */}
     <AppBar position="sticky">
        {/* Selection-Tabs */}
        <SmallTabs value={currentTab} onChange={(e, newVal) => setCurrentTab(newVal)}>
          <Tab label="Tab 1" />
          <Tab label="Tab 2" />
          {/* Add Tab Button */}
          <Button color="inherit">Add Tab</Button>
        </SmallTabs>
        <SelectionField>
          {/* Selection-Field and "+" Button */}
          <div>
            <span>Selected Ingredients Here</span>
            <Button color="inherit">+</Button>
          </div>
          {/* Toggle Button */}
          <IconButton color="inherit" onClick={() => setShowSelected(!showSelected)}>
            {showSelected ? <VisibilityOffIcon fontSize="small" /> : <VisibilityIcon fontSize="small" />}
          </IconButton>
        </SelectionField>
      </AppBar>

      {/* Scrollable Section */}
      <div style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 128px)' }}>
        {/* Combos Table */}
        <Paper style={{ height: tableHeight, overflow: 'auto' }}>
          <DataGrid
           {...tableSettings}
            rows={combos.map(combo => ({ id: combo.combo, ...combo }))}
            columns={[{ field: 'combo', headerName: 'Name' }, { field: 'items', headerName: 'Ingredients' }]}
          />
        </Paper>
         {/* Draggable Divider */}
         <Divider orientation="horizontal" />
        <div>
          <IconButton onClick={() => setTableHeight(tableHeight - 20)}>
            <ArrowUpwardIcon fontSize="small" />
          </IconButton>
          <IconButton onClick={() => setTableHeight(tableHeight + 20)}>
            <ArrowDownwardIcon fontSize="small" />
          </IconButton>
        </div>

        {/* Ingredient Utility Table */}
        <Paper style={{ flex: 1, height: `calc(100vh - ${tableHeight + 128}px)`, overflow: 'auto' }}>
          <DataGrid
           {...tableSettings}
            rows={ingredients.map(ingredient => ({ id: ingredient.name, ...ingredient }))}
            columns={[{ field: 'name', headerName: 'Ingredient' }, { field: 'level', headerName: 'Lvl' }]}
          />
        </Paper>
      </div>
    </div>
  );
}

export default App;
