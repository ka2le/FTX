import React, { useState, useEffect } from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import IconButton from '@mui/material/IconButton';
import InfoIcon from '@mui/icons-material/Info';
import initialIngredients from './initialIngredients.json';
import { updateGameState, getGameState } from "./Api";
import { checkCompleteCombos, TESTING } from "./App"

export const MAX_HAND_LIMIT = 15;

export const TradePage = ({ deck, setDeck, players, setPlayers, ingredients, setIngredients, currentPlayerId, hasLocalChanges }) => {
  useEffect(() => {
    const sortedPlayers = players.map(player => {
      // Clone the player object to avoid direct state mutation
      const newPlayer = { ...player };
      // Sort the cards array
      newPlayer.cards.sort();
      return newPlayer;
    });

    // Check if sorting is necessary to avoid unnecessary state updates
    if (JSON.stringify(players) !== JSON.stringify(sortedPlayers)) {
      setPlayers(sortedPlayers);
    }
  }, [players]);

  useEffect(() => {
    processIngredients(players, ingredients, currentPlayerId, setIngredients, hasLocalChanges);
  }, [players, currentPlayerId]);

  return (
    <div className="white trade-view-container">
      {/* Buttons Row */}

      {players.map((player) => (
        <Hand
          key={player.id}
          players={players}
          id={player.id}
          ingredients={ingredients}
          setPlayers={setPlayers}
          currentPlayerId={currentPlayerId}
        />
      ))}
    </div>
  );
};


const Hand = ({ players, setPlayers, id, ingredients, currentPlayerId }) => {
  const player = players?.find((player) => player.id === id);
  const [completeCombos, setCompleteCombos] = useState([]);
  const [score, setScore] = useState(0);
  const [totalIngredientCount, setTotalIngredientsCount] = useState(0);
  const [combinedLevel, setCombinedLevel] = useState(0);
  const [openInfoDialog, setOpenInfoDialog] = useState(false);
  const [openTradeDialog, setOpenTradeDialog] = useState(false);

  const handleInfoClick = () => {
    setOpenInfoDialog(true);
  };
  const handleTrade = () => {
    setOpenTradeDialog(true);
  };

  const [selectedCardsCurrentPlayer, setSelectedCardsCurrentPlayer] = useState([]);
  const [selectedCardsOtherPlayer, setSelectedCardsOtherPlayer] = useState([]);

  const handleTradeConfirm = async () => {
    // Fetch the current game state from the server
    const currentGameState = await getGameState();

    // Determine the source of truth for player data based on currentGameState
    const sourceOfTruthPlayers = (!currentGameState || currentGameState.players.length === 0) ? players : currentGameState.players;

    // Fetch the corresponding players from the source of truth
    const sourceCurrentPlayer = sourceOfTruthPlayers.find(player => player.id === currentPlayerId);
    const sourceOtherPlayer = sourceOfTruthPlayers.find(player => player.id === id);

    // Check if both players have the required cards for the trade
    const currentPlayerHasCards = selectedCardsCurrentPlayer.every(cardWithIndex =>
      sourceCurrentPlayer.cards.includes(cardWithIndex.split('-')[0]));
    const otherPlayerHasCards = selectedCardsOtherPlayer.every(cardWithIndex =>
      sourceOtherPlayer.cards.includes(cardWithIndex.split('-')[0]));

    if (currentPlayerHasCards && otherPlayerHasCards) {
      // Proceed with trade
      const updatedPlayers = JSON.parse(JSON.stringify(players));
      const currentPlayerIndex = updatedPlayers.findIndex(player => player.id === currentPlayerId);
      const otherPlayerIndex = updatedPlayers.findIndex(player => player.id === id);

      executeTrade(selectedCardsCurrentPlayer, currentPlayerIndex, updatedPlayers, otherPlayerIndex);
      executeTrade(selectedCardsOtherPlayer, otherPlayerIndex, updatedPlayers, currentPlayerIndex);

      // Prepare the trade history object
      const tradeHistory = {
        timestamp: new Date().toISOString(),
        playersInvolved: [currentPlayerId, id],
        trades: {
          currentPlayer: selectedCardsCurrentPlayer.map(cardWithIndex => cardWithIndex.split('-')[0]),
          otherPlayer: selectedCardsOtherPlayer.map(cardWithIndex => cardWithIndex.split('-')[0])
        }
      };

      // Update the state and send to server
      setPlayers(updatedPlayers);
      const updatedGameState = { players: updatedPlayers, tradeHistory };
      await updateGameState(updatedGameState);

      // Reset selected cards and close the trade dialog
      setSelectedCardsCurrentPlayer([]);
      setSelectedCardsOtherPlayer([]);
      console.log(updatedPlayers)
      setOpenTradeDialog(false);
    } else {
      alert("Trade invalid: One or both players do not have the required cards.");
    }
  };

  const executeTrade = (selectedCards, fromPlayerIndex, players, toPlayerIndex) => {
    selectedCards.forEach(cardWithIndex => {
      const [card] = cardWithIndex.split('-');
      const fromPlayerCards = players[fromPlayerIndex].cards;
      const toPlayerCards = players[toPlayerIndex].cards;

      // Remove the card from fromPlayer and add it to toPlayer
      fromPlayerCards.splice(fromPlayerCards.indexOf(card), 1);
      toPlayerCards.push(card);
    });
  };


  useEffect(() => {
    const ingredientsForPlayer = makeIngredientsArray(players, ingredients, player?.id);
    const [newCompleteCombos, newScore, newTotalIngredientCount,
      newCombinedLevel] = checkCompleteCombos(ingredientsForPlayer);
    setCompleteCombos(newCompleteCombos);
    setScore(newScore);
    setTotalIngredientsCount(newTotalIngredientCount)
    setCombinedLevel(newCombinedLevel)
  }, [player, ingredients, players]);


  return (
    <div className="hand" >
      <div>

        Player {player?.id}
        {!(player?.id == currentPlayerId) && <Button className="trade-with-player-button" onClick={handleTrade}>Trade</Button>}
        <div className="combo-info"> <b> S: {score} {TESTING ? `C: ${totalIngredientCount} L: ${combinedLevel}` : null} </b> {completeCombos.join(", ")} </div>
      </div>

      <div className="cards">
        {player?.cards?.join(" - ")}
      </div>
      {/* Info Dialog */}

      {/* Trade Dialog */}
      <Dialog open={openTradeDialog} className={`ingredient-dialog`} onClose={() => setOpenTradeDialog(false)}>
        <DialogTitle>Trade Cards</DialogTitle>
        <DialogContent>
          <TradeInterface
            currentPlayer={players.find(player => player.id === currentPlayerId)}
            otherPlayer={players.find(player => player.id === id)}
            setSelectedCardsCurrentPlayer={setSelectedCardsCurrentPlayer}
            setSelectedCardsOtherPlayer={setSelectedCardsOtherPlayer}
            selectedCardsCurrentPlayer={selectedCardsCurrentPlayer}
            selectedCardsOtherPlayer={selectedCardsOtherPlayer}
          />

        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenTradeDialog(false)}>Cancel</Button>
          <Button onClick={() => handleTradeConfirm()}>Trade</Button> {/* You'll need to implement this function */}
        </DialogActions>
      </Dialog>
    </div>
  );
};




const TradeInterface = ({ currentPlayer, otherPlayer, setSelectedCardsCurrentPlayer, setSelectedCardsOtherPlayer, selectedCardsCurrentPlayer, selectedCardsOtherPlayer }) => {

  const toggleCardSelection = (card, index, playerType) => {
    const selectedCards = playerType === 'current' ? selectedCardsCurrentPlayer : selectedCardsOtherPlayer;
    const setSelectedCards = playerType === 'current' ? setSelectedCardsCurrentPlayer : setSelectedCardsOtherPlayer;

    const cardWithIndex = `${card}-${index}`;

    if (selectedCards.includes(cardWithIndex)) {
      setSelectedCards(selectedCards.filter(c => c !== cardWithIndex));
    } else {
      setSelectedCards([...selectedCards, cardWithIndex]);
    }
  };

  return (
    <div >
      <div>
        <h3>Your Cards</h3>
        {currentPlayer.cards.map((card, index) => (
          <button
            key={index}
            onClick={() => toggleCardSelection(card, index, 'current')}
            className={selectedCardsCurrentPlayer.includes(`${card}-${index}`) ? 'selected' : ''}
          >
            {card}
          </button>
        ))}
      </div>
      <div>
        <h3>Player {otherPlayer.id}'s Cards</h3>
        {otherPlayer.cards.map((card, index) => (
          <button
            key={index}
            onClick={() => toggleCardSelection(card, index, 'other')}
            className={selectedCardsOtherPlayer.includes(`${card}-${index}`) ? 'selected' : ''}
          >
            {card}
          </button>
        ))}
      </div>
    </div>
  );
}

export const processIngredients = (players, ingredients, currentPlayerId, setIngredientsFn, hasLocalChanges) => {
  if (!hasLocalChanges) {
    let newIngredients = makeIngredientsArray(players, ingredients, currentPlayerId);
    newIngredients = newIngredients.sort((a, b) => a.name.localeCompare(b.name));
    setIngredientsFn([...newIngredients]);
  }
};

export const checkIngredientsMatch = (players, ingredients, currentPlayerId) => {
  const currentPlayer = players.find(p => p.id === currentPlayerId);
  if (!currentPlayer) return false;

  const currentPlayerIngredients = makeIngredientsArray(players, ingredients, currentPlayerId)
    .map(ing => ing.name)
    .sort();

  const currentIngredients = ingredients.map(ing => ing.name).sort();

  return JSON.stringify(currentPlayerIngredients) === JSON.stringify(currentIngredients);
};


export const makeIngredientsArray = (players, ingredients, playerIndex) => {
  // Clone the ingredients array
  const newIngredients = ingredients.map(ingredient => ({ ...ingredient }));

  // Reset all amounts to 0
  newIngredients.forEach((ingredient) => {
    ingredient.amount = 0;
  });

  // Find playerHand with given playerIndex
  const targetPlayer = players?.find((player) => player?.id === playerIndex);

  // If found, proceed
  if (targetPlayer) {
    targetPlayer.cards.forEach((card) => {
      // Find the matching ingredient
      const matchingIngredient = newIngredients.find(
        (ingredient) => ingredient.name === card
      );

      // If found, increment amount
      if (matchingIngredient) {
        matchingIngredient.amount += 1;
      }
    });
  }

  return newIngredients;
};



// Create and shuffle a deck based on initialIngredients
export const createDeck = () => {
  let uniqueDeck = [];
  let duplicateDeck = [];

  // Create unique and duplicate decks separately
  initialIngredients.forEach((ingredient) => {
    let isFirst = true;
    for (let i = 0; i < ingredient.copies; i++) {
      if (isFirst) {
        uniqueDeck.push(ingredient.name);
        isFirst = false;
      } else {
        duplicateDeck.push(ingredient.name);
      }
    }
  });

  // Shuffle each part
  uniqueDeck.sort(() => Math.random() - 0.5);
  duplicateDeck.sort(() => Math.random() - 0.5);
  //console.log(uniqueDeck);
  //console.log(duplicateDeck);
  // Combine them into one deck
  return [...uniqueDeck, ...duplicateDeck];
};


export const handleDealCards = async (setDeck, setPlayers, numberOfPlayers) => {
  const userConfirmed = window.confirm('Are you sure you want to deal new cards?');
  if (userConfirmed) {
    let newDeck = createDeck(); // Assuming createDeck is a function that creates a new shuffled deck
    const newPlayers = Array.from({ length: numberOfPlayers }, (_, i) => ({
      id: i + 1,
      cards: []
    }));

    newPlayers.forEach(player => {
      while (player.cards.length < MAX_HAND_LIMIT && newDeck.length > 0) {
        player.cards.push(newDeck.shift());
      }
    });

    setDeck(newDeck);
    setPlayers(newPlayers);

    // Update gameState with new players and reset tradeHistory
    const updatedGameState = {
      players: newPlayers,
      tradeHistory: [] // Reset trade history
    };

    // Send the updated gameState to the server
    await updateGameState(updatedGameState);
  }
};


export default TradePage;
