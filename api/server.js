const express = require('express');
const app = express();
const port = 4000; // You can choose any port
const host = '0.0.0.0'; 
const cors = require('cors');

// Middleware to parse JSON bodies
app.use(express.json());
app.use(cors());

// GameState object
let gameState = {
  players: [],
  tradeHistory: []
};

// GET endpoint to retrieve the game state
app.get('/game-state', (req, res) => {
  res.json(gameState);
});

// POST endpoint to update the game state
app.post('/update-game-state', (req, res) => {
  const { players, tradeHistory } = req.body;
  console.log('Updating game state...');
  console.log(req.body);
  if (players) gameState.players = players;
  if (tradeHistory) gameState.tradeHistory = tradeHistory;
  console.log('Game state updated successfully.')
  console.log(gameState);
  res.send('Game state updated successfully.');
});

app.get('/test-endpoint', (req, res) => {
    res.send({ message: 'Test endpoint reached successfully' });
});



// Start the server
app.listen(port, host, () => {
  console.log(`Server is running on port ${port}`);
});


