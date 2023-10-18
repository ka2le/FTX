import React, { useState, useEffect } from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import IconButton from '@mui/material/IconButton';
import InfoIcon from '@mui/icons-material/Info';
import initialIngredients from './initialIngredients.json';
import { checkCompleteCombos } from "./App"

export const MAX_HAND_LIMIT = 18;

export const TradePage = ({ deck, setDeck, players, setPlayers, ingredients, setIngredients, currentPlayerId }) => {
  useEffect(() => {
    const newIngredients = makeIngredientsArray(players, ingredients, currentPlayerId);
    setIngredients([...newIngredients]);
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

  const handleTradeConfirm = () => {
    // Deep clone the players array for immutability
    const updatedPlayers = JSON.parse(JSON.stringify(players));

    const currentPlayerIndex = updatedPlayers.findIndex(player => player.id === currentPlayerId);
    const otherPlayerIndex = updatedPlayers.findIndex(player => player.id === id);

    const currentPlayerCards = updatedPlayers[currentPlayerIndex].cards;
    const otherPlayerCards = updatedPlayers[otherPlayerIndex].cards;

    // Create copies of cards arrays for easy rollback and reference
    const currentPlayerCardsCopy = JSON.parse(JSON.stringify(currentPlayerCards));
    const otherPlayerCardsCopy = JSON.parse(JSON.stringify(otherPlayerCards));


    // Handle trades for the current player
    selectedCardsCurrentPlayer.forEach(cardWithIndex => {
      const [card, index] = cardWithIndex.split('-');
      if (currentPlayerCardsCopy[index] === card) {
        // Remove the card from currentPlayer
        currentPlayerCards.splice(currentPlayerCards.indexOf(card), 1);
        // Add it to otherPlayer
        otherPlayerCards.push(card);
        // Remove from copy for future reference
        currentPlayerCardsCopy[index] = null;
      }
    });

    // Handle trades for the other player
    selectedCardsOtherPlayer.forEach(cardWithIndex => {
      const [card, index] = cardWithIndex.split('-');
      if (otherPlayerCardsCopy[index] === card) {
        // Remove the card from otherPlayer
        otherPlayerCards.splice(otherPlayerCards.indexOf(card), 1);
        // Add it to currentPlayer
        currentPlayerCards.push(card);
        // Remove from copy for future reference
        otherPlayerCardsCopy[index] = null;
      }
    });

    // Update the cards back in the players array
    updatedPlayers[currentPlayerIndex].cards = currentPlayerCards;
    updatedPlayers[otherPlayerIndex].cards = otherPlayerCards;

    // Update the entire players array
    setPlayers(updatedPlayers);

    // Reset selected cards
    setSelectedCardsCurrentPlayer([]);
    setSelectedCardsOtherPlayer([]);

    // Close the trade dialog
    setOpenTradeDialog(false);
  };

  useEffect(() => {
    const ingredientsForPlayer = makeIngredientsArray(players, ingredients, player?.id);
    const [newCompleteCombos, newScore] = checkCompleteCombos(ingredientsForPlayer);
    setCompleteCombos(newCompleteCombos);
    setScore(newScore);
  }, [player, ingredients, players]);


  return (
    <div className="hand" >
      <div>

        Player {player?.id}
        {!(player?.id == currentPlayerId) && <Button className="trade-with-player-button" onClick={handleTrade}>Trade</Button>}
        <div className="combo-info"> <b> Score: {score} </b> {completeCombos.join(", ")} </div>
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
  let deck = [];
  initialIngredients.forEach((ingredient) => {
    for (let i = 0; i < ingredient.copies; i++) {
      deck.push(ingredient.name);
    }
  });
  // Shuffle deck
  deck.sort(() => Math.random() - 0.5);
  return deck;
};

export const handleDealCards = (setDeck, setPlayers, number_of_players) => {
  const userConfirmed = window.confirm('Are you sure you want to deal new cards?');
  if (userConfirmed) {
    let newDeck = createDeck();
    const newPlayers = Array.from({ length: number_of_players }, (v, i) => ({
      id: i + 1,
      cards: []
    }));
    newPlayers.forEach((player) => {
      while (player.cards.length < MAX_HAND_LIMIT && newDeck.length > 0) {
        player.cards.push(newDeck.pop());
      }
    });
    setDeck(newDeck);
    setPlayers(newPlayers);
  }
};



export default TradePage;
