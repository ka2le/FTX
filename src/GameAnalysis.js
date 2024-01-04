import React, { useState } from 'react';
import initialIngredients from './initialIngredients.json';
import trucks from './trucks.json';
import { checkCompleteCombos, createIngredientDictionary, processComboLine } from './App.js';
import { Card, CardContent, Typography, List, ListItem, Grid } from '@mui/material';


export default function GameAnalysisComponent() {
    const [analysisResult, setAnalysisResult] = useState(null);

    const handleRunAnalysis = () => {
        const playerProfiles = createPlayerProfiles();
        console.log(playerProfiles)
        const result = runAnalysis(playerProfiles);
        console.log(result)
        setAnalysisResult(result);
    };

    return (
        <div style={{ color: "white", height: "90vh", overflow: "scroll" }}>
            <h2>Game Analysis</h2>
            <button onClick={handleRunAnalysis}>Run Analysis</button>
            <div>
            {analysisResult && <GameResultsDisplay gameResults={analysisResult} />}
                {analysisResult ? <pre>{JSON.stringify(analysisResult, null, 2)}</pre> : 'No analysis data yet.'}
            </div>
        </div>
    );
}

const GameResultsDisplay = ({ gameResults }) => {
    const renderItemsList = (items, isCombo = false) => (
      <Grid container spacing={2}>
        {items.map((item, index) => (
          <Grid item key={index} xs={isCombo ? 6 : 12} sm={isCombo ? 3 : 6} md={2}>
            <ListItem>
              {Object.keys(item)[0]}{isCombo ? '' : `: ${item[Object.keys(item)[0]]}`}
            </ListItem>
          </Grid>
        ))}
      </Grid>
    );
  
    const renderWishIngredients = ingredients => {
      const uniqueIngredients = new Set(ingredients);
      return (
        <Grid container spacing={2}>
          {[...uniqueIngredients].map((ingredient, index) => (
            <Grid item key={index} xs={6} sm={3} md={2}>
              <ListItem>{ingredient}</ListItem>
            </Grid>
          ))}
        </Grid>
      );
    };
  
    return (
      <div>
        <Card variant="outlined">
          <CardContent>
            <Typography variant="h5">Available Items in Deck</Typography>
            {renderItemsList(gameResults.availableItemsInDeck)}
          </CardContent>
        </Card>
        {gameResults.playerResults.map((player, index) => (
          <Card variant="outlined" key={index}>
            <CardContent>
              <Typography variant="h6">{player.profile.truckName}</Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Typography>Score: {player.totalScore}</Typography>
                  <Typography>Hand Count: {player.handCount}</Typography>
                  <Typography>Wish Ingredients:</Typography>
                  {renderWishIngredients(player.profile.wishIngredients)}
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography>Hand:</Typography>
                  {renderItemsList(player.hand.map(card => ({ [card]: '' })), true)}
                  <Typography>Completed Combos:</Typography>
                  {renderItemsList(player.completedCombos.map(combo => ({ [combo]: '' })), true)}
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  };
  
const createPlayerProfiles = () => {
    return [
        {
            truckName: "Sweet",
            strategy: ["Milskshake", "Gelato", "Chutney", "Chili Mayo", "Shrimp Skewers", "Coleslaw"]
        },
        {
            truckName: "Turbo Burgers",
            strategy: ["Burgers!", "Fries", "Flexitarian Burgers", "Pickles", "Onion Rings", "Milkshake"]
        },
        {
            truckName: "Taco o Plomo",
            strategy: ["Taco Mix", "Elotes", "Burrito", "Quesedilla", "Guacamole", "Pineapple Express", "Fish Taco"]
        },
        {
            truckName: "The Eat Indian Company",
            strategy: ["Curry Curry", "Samosas", "Tandoori Skewers", "Chutney"]
        },
        {
            truckName: "Bao East",
            strategy: ["Bao Dream", "Hoisin sauce", "Chili Mayo", "Spring Rolls"]
        },
        {
            truckName: "Bao East",
            strategy: ["Bao Dream", "Hoisin sauce", "Chili Mayo", "Spring Rolls"]
        },
        {
            truckName: "Grilluminati's BBQ",
            strategy: ["BBQ Platter", "BBQ Beans", "Vegan BBQ", "Creamy Sides", "Shrimp Skewers", "Coleslaw"]
        },

        {
            truckName: "Vini Vidi Pasta",
            strategy: ["Pasti", "Eggplant Parmesan", "Gelato"]
        },
        {
            truckName: "Vini Vidi Pasta",
            strategy: ["Pasti", "Eggplant Parmesan", "Gelato"]
        },
        {
            truckName: "Turbo Burgers",
            strategy: ["Burgers!", "Fries", "Flexitarian Burgers", "Pickles", "Onion Rings", "Milkshake"]
        },
        {
            truckName: "Taco o Plomo",
            strategy: ["Taco Mix", "Elotes", "Burrito", "Quesedilla", "Guacamole", "Pineapple Express", "Fish Taco"]
        },
    ];
};


export const runAnalysis = (playerProfiles) => {
    const deck = createDeck();
    console.log(deck)
    const gameResult = simulateGame(deck, playerProfiles);
    return gameResult;
};

export const createDeck = () => {
    let deck = {};
    initialIngredients.forEach(ingredient => {
        deck[ingredient.name] = ingredient.copies;
    });
    return deck;
};

export const removeCardFromDeck = (deck, cardName) => {
    if (deck[cardName] > 0) {
        deck[cardName]--;
    }
};

export const simulateGame = (deck, playerProfiles) => {
    let playersHands = playerProfiles.map(() => []);
    let roundNumber = 0;
    let gameInProgress = true;

    while (gameInProgress) {
        console.log("--------RoundNumber-------------------", roundNumber)
        playRound(deck, playersHands, playerProfiles, roundNumber);
        roundNumber++;
        if (roundNumber > 13) {
            gameInProgress = false;
        }
    }
    return generateGameResults(deck, playersHands, playerProfiles);
};

const playRound = (deck, playersHands, playerProfiles, roundNumber, comboData) => {
    playerProfiles.forEach((profile, index) => {
        console.log("profilename", profile.truckName)
        let { cardPicked, missingIngredients } = pickCard(deck, playersHands[index], profile.strategy, comboData);
        if (cardPicked) {
            playersHands[index].push(cardPicked);
            console.log("cardPicked", cardPicked)
            removeCardFromDeck(deck, cardPicked);

            // Optionally update combo completion and score here
        }
        if (missingIngredients && missingIngredients.length > 0) {
            profile.wishIngredients = (profile.wishIngredients || []).concat(missingIngredients);
        }
    });
    // Additional logic for a round
    // For example, check if the game is over or update round-specific data
};

export const pickCard = (deck, hand, strategy) => {
    // Convert hand to ingredient list format
    let ingredientList = handToIngredientList(hand);
    console.log("ingredientList", ingredientList)


    // Check which combos are completed
    let [completeCombos] = checkCompleteCombos(ingredientList);
    console.log("completeCombos", completeCombos)
    // Determine the best card to pick based on strategy and completed combos
    for (let comboName of strategy) {
        console.log("comboName", comboName)
        if (!completeCombos?.includes(comboName)) {
            let { bestIngredient, missingIngredients } = findBestCardForCombo(deck, comboName, ingredientList);
            if (bestIngredient) {
                return { cardPicked: bestIngredient };
            } else if (missingIngredients) {
                return { cardPicked: null, missingIngredients };
            }
        }
    }

    return { cardPicked: null };
};



const findBestCardForCombo = (deck, comboName, ingredientList) => {
    // Convert ingredientList to a dictionary for faster lookup
    const ingredientDict = createIngredientDictionary(ingredientList);
    console.log("ingredientDict", ingredientDict)
    // Find the combo object from the trucks.json data
    const combo = trucks.flatMap(truck => truck.combos)
        .find(c => c.ComboName === comboName);
    console.log("combo", combo)
    // If combo not found or no ComboLines, return null
    if (!combo || !combo.ComboLines) {
        return null;
    }

    for (let line of combo.ComboLines) {
        const { shortfall, missingIngredients } = processComboLine(line, ingredientDict);
        console.log("shortfall", shortfall, "missingIngredients", missingIngredients)
        // If there's a shortfall, find the missing ingredient with the most copies in the deck
        if (shortfall > 0 && missingIngredients.length > 0) {
            let maxCopies = 0;
            let bestIngredient = null;

            for (let ingredient of missingIngredients) {
                if (deck[ingredient] > maxCopies) {
                    maxCopies = deck[ingredient];
                    bestIngredient = ingredient;
                }
            }

            if (shortfall > 0 && missingIngredients.length > 0) {
                if (!bestIngredient) {
                    return { bestIngredient: null, missingIngredients };
                } else {
                    return { bestIngredient, missingIngredients: [] };
                }
            }
        }
    }

    // If no ingredient is found or no shortfall in any line, return null
    return { bestIngredient: null, missingIngredients: [] };
};
function generateGameResults(deck, playersHands, playerProfiles) {
    // Getting items with value > 0 and their quantities
    const availableItems = Object.entries(deck)
        .filter(([key, value]) => value > 0)
        .map(([key, value]) => ({ [key]: value }));

    const results = playerProfiles.map((profile, index) => {
        const hand = playersHands[index];
        const [completedCombos, totalScore] = combosFromHand(hand);
        return {
            profile,
            totalScore: totalScore,
            handCount: hand.length,
            hand,
            completedCombos
        };
    });

    // Add the availableItems to the results
    return {
        availableItemsInDeck: availableItems,
        playerResults: results,

    };
}


function combosFromHand(hand) {
    // Convert hand to ingredient list format
    let ingredientList = handToIngredientList(hand);
    // Check which combos are completed
    let [completeCombos, totalScore] = checkCompleteCombos(ingredientList);
    return [completeCombos, totalScore];
}


function handToIngredientList(hand) {
    // Create a new array based on initialIngredients, adjusting the amount based on the player's hand
    const ingredientsState = initialIngredients?.map(ingredient => ({
        ...ingredient,
        amount: hand?.includes(ingredient.name) ? 1 : 0
    }));
    console.log("ingredientsState", ingredientsState)
    return ingredientsState;
}
