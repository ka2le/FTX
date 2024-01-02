import React, { useRef, useState, useEffect, useMemo } from 'react';
import Slider from 'react-slick';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import Grid from '@mui/material/Grid';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Button from '@mui/material/Button';
import trucks from './trucks.json';
import TestApiComponent from './Api';
import { updateGameState, getGameState } from "./Api";
import initialIngredients from './initialIngredients.json';
import { TradePage, makeIngredientsArray, createDeck, handleDealCards, MAX_HAND_LIMIT, processIngredients } from './TradePage';
import { Cards } from './Cards';


import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import './App.css'; // your custom css

export const TESTING = true;
const WORKING_ON_CARDS = false;

const RARE_THRESHOLD = 2;
const UNCOMMON_THRESHOLD = 3;
const CARD_SCORE_VALUE = 2;


export default function App() {
  const [cardTesting, setCardTesting] = useState(WORKING_ON_CARDS);
  const loadTradeInterfaceFromLocalStorage = () => {
    const storedTradeInterface = localStorage.getItem('tradeInterface');
    return storedTradeInterface ? JSON.parse(storedTradeInterface) : false;
  };
  const loadPlayerIdFromLocalStorage = () => {
    const storedPlayerId = localStorage.getItem('currentPlayerId');
    return storedPlayerId ? JSON.parse(storedPlayerId) : 1;
  };

  const [testInterface, setTradeInterface] = useState(loadTradeInterfaceFromLocalStorage);
  const [currentPlayerId, setCurrentPlayerId] = useState(loadPlayerIdFromLocalStorage);
  const handlePlayerIdChange = (event) => {
    setCurrentPlayerId(event.target.value);
  };

  const [numberOfPlayers, setNumberOfPlayers] = useState(5);
  const handleNumberOfPlayersChange = (event) => {
    setNumberOfPlayers(event.target.value);
  };
  const playerList = Array.from({ length: numberOfPlayers }, (_, i) => i + 1);
  const toggleTradeInterface = () => {
    setTradeInterface(!testInterface);
  }
  const [deck, setDeck] = useState(createDeck());

  const slider1 = useRef(null);
  const slider2 = useRef(null);
  const [autoSlide, setAutoSlide] = useState(false);
  const [key, setKey] = useState(Math.random());
  const loadFromLocalStorage = () => {
    const storedIngredients = localStorage.getItem('ingredients');
    return storedIngredients ? JSON.parse(storedIngredients) : initialIngredients.map((ingredient) => ({ ...ingredient, amount: 0 }));
  };
  const loadPlayersFromLocalStorage = () => {
    const storedplayers = localStorage.getItem('players');
    return storedplayers ? JSON.parse(storedplayers) : [];
  };
  const [players, setPlayers] = useState(loadPlayersFromLocalStorage);

  useEffect(() => {
    if (testInterface) {
      const intervalId = setInterval(async () => {
        const gameState = await getGameState();
        if (gameState) {
          setPlayers(gameState.players);
        }
      }, 1000); // Set the interval to 1 second or as appropriate

      return () => clearInterval(intervalId); // Cleanup function to clear the interval
    }
  }, []);



  const [ingredients, setIngredients] = useState(loadFromLocalStorage);
  useEffect(() => {
    localStorage.setItem('ingredients', JSON.stringify(ingredients));
  }, [ingredients]);
  useEffect(() => {
    localStorage.setItem('players', JSON.stringify(players));
  }, [players]);
  useEffect(() => {
    localStorage.setItem('tradeInterface', JSON.stringify(testInterface));
  }, [testInterface]);
  useEffect(() => {
    localStorage.setItem('currentPlayerId', JSON.stringify(currentPlayerId));
  }, [currentPlayerId]);

  // console.log(trucks);
  // console.log(initialIngredients)
  // console.log(ingredients)
  // console.log(players[0])
  // const result = calculateTotalIngredients();

  // console.log("Total Ingredients: ", result.totalIngredients);
  // console.log("Ingredients by Level: ", result.levelCount);
  // console.log("Ingredients by Rarity: ", result.rarityCount);
  // console.log("Ingredients by rarityTypeCount: ", result.rarityTypeCount);
  // console.log("Split all card 5 players: ", result.totalIngredients / 5)
  // console.log("Split all card 9 players: ", result.totalIngredients / 9)
  // console.log("Cards left for max " + MAX_HAND_LIMIT + " cards 5 players: ", Math.floor((result.totalIngredients / 5 - MAX_HAND_LIMIT) * 5))


  const reset = () => {
    const userConfirmed = window.confirm('Are you sure you want to reset all ingredients?');
    if (userConfirmed) {
      localStorage.removeItem('ingredients');
      setIngredients(initialIngredients.map((ingredient) => ({ ...ingredient, amount: 0 })));
    }
  };
  const toggleIngredientAmount = (name) => {
    setIngredients((prevIngredients) =>
      prevIngredients.map((ingredient) =>
        ingredient.name === name
          ? { ...ingredient, amount: ingredient.amount > 0 ? 0 : 1 }
          : ingredient
      )
    );
  };
  const incrementAmount = (name) => {
    setIngredients((prevIngredients) =>
      prevIngredients.map((ingredient) =>
        ingredient.name === name
          ? { ...ingredient, amount: ingredient.amount + 1 }
          : ingredient
      )
    );
  };

  const decrementAmount = (name) => {
    setIngredients((prevIngredients) =>
      prevIngredients.map((ingredient) =>
        ingredient.name === name && ingredient.amount > 0
          ? { ...ingredient, amount: ingredient.amount - 1 }
          : ingredient
      )
    );
  };
  const [open, setOpen] = useState(false);
  const handleClose = () => {

    setOpen(false);
  };

  const countIngredients = () => {
    let totalCount = ingredients.length;
    let countWithAmount = 0;

    for (let i = 0; i < totalCount; i++) {
      if (ingredients[i].amount > 0) {
        countWithAmount++;
      }
    }

    return `${countWithAmount} / ${totalCount}`;
  }

  const [scoreDifferences, setScoreDifferences] = useState({});

  useEffect(() => {
    // Calculate the baseline score when the component mounts or ingredients change
    const [, initialScore] = checkCompleteCombos(ingredients);
    const newScoreDifferences = ingredients.reduce((acc, ingredient) => {
      acc[ingredient.name] = {
        scoreDifferenceIncrement: calculateScoreDifference(ingredient.name, true, initialScore),
        scoreDifferenceDecrement: calculateScoreDifference(ingredient.name, false, initialScore),
      };
      return acc;
    }, {});

    setScoreDifferences(newScoreDifferences);
  }, [ingredients]);


  const deepCopyIngredients = (original) => {
    return original.map(ing => ({ ...ing }));
  };

  const calculateScoreDifference = (name, isIncrement, initalScore) => {

    const modifiedIngredients = deepCopyIngredients(ingredients);
    const ingredient = modifiedIngredients.find(ing => ing.name === name);

    if (ingredient) {
      ingredient.amount += isIncrement ? 1 : -1;
      ingredient.amount = Math.max(ingredient.amount, 0); // Ensure amount doesn't go below zero
    }

    const [, modifiedScore] = checkCompleteCombos(modifiedIngredients);
    //console.log("calculateScoreDifference", name, isIncrement, modifiedScore, initalScore)
    return modifiedScore - initalScore;
  };


  const images = [
    'img/bao.jpg',
    'img/bbq.jpg',
    'img/burger.jpg',
    'img/indian.jpg',
    'img/pasta.jpg',
    'img/taco.jpg'
  ];

  const borderColors = [
    '#a8e4ff',
    '#dfa35b',
    '#cc4f33',
    '#ffc701',
    '#6788f8',
    '#fff065'
  ];

  const goTo = (index) => {
    slider1.current.slickGoTo(index);
  };
  const isLandscapeOrDesktop = window.innerWidth > window.innerHeight || window.innerWidth >= 768;
  const settings = useMemo(
    () => ({
      dots: false,
      infinite: true,
      speed: 500,
      slidesToShow: isLandscapeOrDesktop ? 3 : 1,
      slidesToScroll: isLandscapeOrDesktop ? 3 : 1,
      rows: isLandscapeOrDesktop ? 2 : 1,
      autoplay: autoSlide,
      autoplaySpeed: 20000,
      asNavFor: null, // Replace with slider2.current if needed
    }),
    [isLandscapeOrDesktop, autoSlide]
  );


  const thumbnailSettings = {
    infinite: true,
    focusOnSelect: true,
    slidesToShow: 7,
    swipeToSlide: true,
    arrows: false,
    asNavFor: slider1.current,
    autoplay: false
  };

  const [sortConfig, setSortConfig] = useState({ criteria: 'name', direction: 'asc' });

  const toggleSort = (criteria) => {
    setSortConfig((prevConfig) => {
      if (prevConfig.criteria === criteria) {
        // Toggle direction if the same criteria is clicked
        return { criteria, direction: prevConfig.direction === 'asc' ? 'desc' : 'asc' };
      } else {
        // Reset to descending for 'amount' and ascending for others when switching criteria
        return { criteria, direction: (criteria === 'amount' || criteria === "scoreDifferenceIncrement") ? 'desc' : 'asc' };
      }
    });
  };


  const toggleAutoSlide = () => {
    setAutoSlide(!autoSlide);
    setKey(Math.random()); // Force re-render by changing the key
  };

  const [completeCombos,
    totalScore,
    totalIngredientCount,
    combinedLevel,
    closeMissingIngredients] = checkCompleteCombos(ingredients);
  return (
    <> {cardTesting ? <Cards cardTesting={cardTesting} setCardTesting={setCardTesting} ></Cards> : <div className={`container ${isLandscapeOrDesktop ? "desktop" : null}`} >
      {/* <div className="title">FTX</div> */}
      <Slider key={key} ref={slider1} {...settings}>
        {trucks.map((truck, index) =>
          (<TruckMenu key={index} truckData={truck} ingredientsState={ingredients} decrementAmount={decrementAmount} incrementAmount={incrementAmount}></TruckMenu>)
        )}
        <MyTruckMenu key={trucks?.length} ingredientsState={ingredients} decrementAmount={decrementAmount} incrementAmount={incrementAmount}></MyTruckMenu>
      </Slider>
      <div className="score-row" >
        <b>Score: {totalScore}</b>
        {/* {TESTING ? `Cards: ${totalIngredientCount} Levels: ${combinedLevel}` : null}
        {closeMissingIngredients?.length > 0 ? " Need: " + closeMissingIngredients?.join(" - ") + "" : null} */}
        <br></br>
        {completeCombos.join(", ")}

        <Button variant="outline" className="open-dialog-button" onClick={() => {
          setOpen(true)

        }}>
          {testInterface ? null : <span className='ingredient-counter'>{countIngredients()}</span>}
          {testInterface ? <span >⬌</span> : "+"}

        </Button>
        <TestApiComponent></TestApiComponent>


      </div>
      <Dialog fullScreen={!isLandscapeOrDesktop} maxWidth={'lg'} fullWidth={true} open={open} onClose={handleClose} className={`ingredient-dialog ${testInterface ? "trade" : null}  ${isLandscapeOrDesktop ? "desktop" : null}`}>
        <div className="dialog-title-actions">


          <DialogTitle className="dialog-actions">
            {/* First Row */}
            <div className="dialog-row">
              <div className="dialog-title">{testInterface ? "Trade" : "Ingredients"}</div>
              <Button className="dialog-actions-button" onClick={handleClose}>
                x
              </Button>
            </div>

            {/* Second Row */}
            <div className="dialog-row">
              {false ? <Button className="dialog-actions-button" onClick={toggleAutoSlide} >
                {(autoSlide) ? 'Disable Auto-Slide' : 'Enable Auto-Slide'}
              </Button> : null}

              {testInterface ? <>
                <Select
                  labelId="player-label"
                  id="player-dropdown"
                  value={numberOfPlayers}
                  onChange={handleNumberOfPlayersChange}
                  className='white dialog-dropdown'
                >
                  {Array.from({ length: 8 }, (_, i) => i + 1).map((number) => (
                    <MenuItem key={number} value={number}>
                      {number}
                    </MenuItem>
                  ))}
                </Select>

                <Button className="dialog-actions-button" onClick={() => handleDealCards(setDeck, setPlayers, numberOfPlayers)} >
                  🂠
                </Button>


                <Select
                  labelId="player-label"
                  id="player-dropdown"
                  value={currentPlayerId}
                  onChange={handlePlayerIdChange}
                  className='white dialog-dropdown'
                >
                  {playerList.map((playerId) => (
                    <MenuItem key={playerId} value={playerId}>
                      {playerId}
                    </MenuItem>
                  ))}
                </Select></>

                : <> {TESTING ? <Button className="dialog-actions-button" onClick={() => { setCardTesting(!cardTesting) }} >
                  🖨️
                </Button> : null}
                  <Button className="dialog-actions-button" onClick={reset} >
                    🗑️
                  </Button>
                  <Button className="dialog-actions-button" onClick={() => { processIngredients(players, ingredients, currentPlayerId, setIngredients) }} >
                    Refresh
                  </Button>


                </>}
              <Button className="dialog-actions-button" onClick={toggleTradeInterface} >
                {(!testInterface) ? '👥' : "👤"}
              </Button>  </div>

            {/* Third Row */}
            <div className="dialog-row">
              {testInterface ? null : <div className="dialog-title-actions">

                <Button className="dialog-actions-button" onClick={() => toggleSort('name')}>
                  Name {sortConfig.criteria === 'name' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                </Button>
                <Button className="dialog-actions-button" onClick={() => toggleSort('copies')}>
                  Rarity {sortConfig.criteria === 'copies' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                </Button>
                <Button className="dialog-actions-button" onClick={() => toggleSort('amount')}>
                  Owned {sortConfig.criteria === 'amount' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                </Button>
                <Button className="dialog-actions-button" onClick={() => toggleSort('scoreDifferenceDecrement')}>
                  Lose {sortConfig.criteria === 'scoreDifferenceDecrement' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                </Button>
                <Button className="dialog-actions-button" onClick={() => toggleSort('scoreDifferenceIncrement')}>
                  Gain {sortConfig.criteria === 'scoreDifferenceIncrement' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                </Button>
              </div>}
            </div>
          </DialogTitle>


        </div>
        <DialogContent >

          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <IngredientList sortConfig={sortConfig} ingredients={ingredients} setIngredients={setIngredients} scoreDifferences={scoreDifferences} />
            </Grid>
            <Grid item xs={12} md={6}>
              {testInterface ? <TradePage ingredients={ingredients} setIngredients={setIngredients} deck={deck} setDeck={setDeck} players={players} setPlayers={setPlayers} currentPlayerId={currentPlayerId}></TradePage> : null}
            </Grid>
          </Grid>



         }
        </DialogContent>

      </Dialog>
      <div className="thumbnail-slider-wrap">
        {isLandscapeOrDesktop ? null : <Slider ref={slider2} {...thumbnailSettings}>
          {trucks.map((truck, index) => (
            <TruckThumbnail
              key={index}
              truckData={truck}
              goTo={goTo}
              index={index}
            />
          ))}
          < MyTruckThumbnail goTo={goTo}
            index={trucks?.length}></MyTruckThumbnail>


        </Slider>}
      </div>
    </div>}</>
  );
}





export const MyTruckMenu = ({ ingredientsState, incrementAmount, decrementAmount }) => {
  const [completeCombos, , , , , comboStatuses] = checkCompleteCombos(ingredientsState);
  //console.log(comboStatuses)

  const myTruckCombos = completeCombos.flatMap(comboName =>
    trucks.flatMap(truck =>
      truck.combos.filter(combo => combo.ComboName === comboName)
    )
  );

  // Construct the "MyTruck" object
  const myTruck = {
    TruckName: "Completed Combos",
    short: "mytruck",
    combos: myTruckCombos
  };

  const incompleteCombos = comboStatuses.filter(combo => !combo.isComplete);
  const groupedCombos = {
    shortfall1: [],
    shortfall2: [],
    shortfall3Plus: [],
    missingReq: [],
  };

  // Group incomplete combos
  incompleteCombos.forEach(combo => {
    if (combo.missingRequirement) {
      groupedCombos.missingReq.push(combo.name);
    } else if (combo.shortfall === 1) {
      groupedCombos.shortfall1.push(combo.name);
    } else if (combo.shortfall === 2) {
      groupedCombos.shortfall2.push(combo.name);
    } else {
      groupedCombos.shortfall3Plus.push(combo.name);
    }
  });

  // Create trucks for each group
  const createTruckWithCombos = (groupName, shortfallNumber) => ({
    TruckName: `Missing ${shortfallNumber} ${shortfallNumber == "Requirement" ? "" : "ingredient"}${shortfallNumber == 1 || shortfallNumber == "Requirement" ? "" : "s"} `,
    short: "mytruck",
    combos: groupedCombos[groupName].flatMap(comboName =>
      trucks.flatMap(truck =>
        truck.combos.filter(combo => combo.ComboName === comboName)
      )
    ),
  });

  const trucksForRendering = [
    createTruckWithCombos('shortfall1', 1),
    createTruckWithCombos('shortfall2', 2),
    createTruckWithCombos('shortfall3Plus', "3+"),
    createTruckWithCombos('missingReq', "Requirement"),
  ];

  // Render the TruckMenu component with the constructed "MyTruck"
  return (
    <>
      <div className='mytruck-container'>
        <TruckMenu
          truckData={myTruck}
          ingredientsState={ingredientsState}
          incrementAmount={incrementAmount}
          decrementAmount={decrementAmount}
        />
        {trucksForRendering.map(truckData => (
          <TruckMenu
            key={truckData.TruckName}
            truckData={truckData}
            ingredientsState={ingredientsState}
            incrementAmount={incrementAmount}
            decrementAmount={decrementAmount}
          />
        ))}

      </div>
    </>

  );
};

export const TruckMenu = ({ truckData, ingredientsState, incrementAmount, decrementAmount }) => {
  const currentStyle = truckStyles[truckData.short.toLowerCase()] || truckStyles.default;

  // Function to find matching ingredients
  const findMatchingIngredient = (ingredientName, availableIngredients) => {
    const ingredient = availableIngredients.find(ing => ing.name === ingredientName && ing.amount > 0);
    if (ingredient) {
      ingredient.amount--;  // Decrement the amount
    }
    return ingredient;
  };

  const handleComboLineClick = (event) => {
    const target = event.target;

    // Check if the clicked target or its parent is the desired clickable element
    if (target.classList.contains('ingredient') || target.parentNode.classList.contains('ingredient')) {
      const ingredientName = target.textContent.trim();
      // Logic to determine whether to increment or decrement
      const matchedIngredient = findMatchingIngredient(ingredientName, ingredientsState);
      if (matchedIngredient) {
        decrementAmount(ingredientName);
      } else {
        incrementAmount(ingredientName);
      }
    }
  };

  return (
    <div className={`truck-container ${currentStyle.mainFont} ${currentStyle.titleFont}-type`} onClick={handleComboLineClick}>
      <h1
        className={currentStyle.titleFont}
        style={{
          color: currentStyle.color,
        }}
      >{truckData.TruckName}</h1>
      {truckData.combos?.length < 1 ? <div style={{ textAlign: "center" }}>None</div> : truckData.combos.map((combo, index) => (
        <div key={index}>
          <h2 className={currentStyle.titleFont} style={{
            color: currentStyle.color,
          }}>{combo.ComboName}<span className='dependecy-indicator'>{combo.dependency ? "Requires: " + combo.dependency : null}</span></h2>
          <div className={'combo-score ' + currentStyle.titleFont} style={{
            color: currentStyle.color,
          }}>{calculateMinMaxScore(combo)}</div>
          {combo.ComboLines?.map((line, lineIndex) => {
            const workingIngredients = JSON.parse(JSON.stringify(ingredientsState));
            const comboLineState = getComboLineState(line, ingredientsState);
            const comboLineClass = `combo-line ${comboLineState ? 'fulfilled' : ''}`;
            return (
              <div key={lineIndex} className={comboLineClass}>
                <span className="requirements " style={{ color: comboLineState ? currentStyle.color : "white" }}>{line.requirements}</span>
                <span className="ingredients" >

                  {line.ingredients.map((ingredientName, ingIndex) => {
                    const matchedIngredient = findMatchingIngredient(ingredientName, workingIngredients);
                    const initalIngredient = initialIngredients.find(ing => ing.name === ingredientName);
                    const className = matchedIngredient ? 'ingredient-match' : '';
                    const color = matchedIngredient ? matchedIngredient.color : 'white'
                    return (
                      <span key={ingIndex}>
                        {/* {initalIngredient?.level} */}
                        <div key={ingIndex} className={`ingredient ${className}`} style={{ display: 'inline-block', color: color }}>
                          {ingredientName}
                        </div>
                        {ingIndex < line.ingredients.length - 1 && <span style={{ display: 'inline' }}> - </span>}
                      </span>
                    );
                  })}
                </span>

              </div>
            )
          })}
        </div>
      ))}
    </div>
  );
};



const TruckThumbnail = ({ truckData, goTo, index }) => {
  // Get the truck style or fallback to default
  const currentStyle = truckStyles[truckData.short.toLowerCase()] || truckStyles.default;

  return (
    <div
      className="thumbnail-container"
      style={{
        borderColor: currentStyle.color,
        color: currentStyle.color,
      }}
      onClick={() => goTo(index)}
    >
      {truckData.short}
    </div>
  );
};
const MyTruckThumbnail = ({ goTo, index }) => {
  // Get the truck style or fallback to default
  const currentStyle = truckStyles["MyTruck"] || truckStyles.default;

  return (
    <div
      className="thumbnail-container"
      style={{
        borderColor: currentStyle.color,
        color: myTruckColor,
      }}
      onClick={() => goTo(index)}
    >
      Stats
    </div>
  );
};


const IngredientList = ({ ingredients, setIngredients, scoreDifferences, sortConfig }) => {

  const sortedIngredients = useMemo(() => {
    return [...ingredients].sort((a, b) => {
      // Handle sorting for scoreDifferenceIncrement and scoreDifferenceDecrement
      if (sortConfig.criteria === 'scoreDifferenceIncrement' || sortConfig.criteria === 'scoreDifferenceDecrement') {
        const scoreA = scoreDifferences[a.name] ? scoreDifferences[a.name][sortConfig.criteria] : 0;
        const scoreB = scoreDifferences[b.name] ? scoreDifferences[b.name][sortConfig.criteria] : 0;

        if (scoreA < scoreB) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (scoreA > scoreB) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      }

      // Default sorting for other criteria
      if (a[sortConfig.criteria] < b[sortConfig.criteria]) {
        return sortConfig.direction === 'asc' ? -1 : 1;
      }
      if (a[sortConfig.criteria] > b[sortConfig.criteria]) {
        return sortConfig.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });
  }, [ingredients, scoreDifferences, sortConfig]);

  const incrementAmount = (name) => {
    setIngredients((prevIngredients) =>
      prevIngredients.map((ingredient) =>
        ingredient.name === name
          ? { ...ingredient, amount: ingredient.amount + 1 }
          : ingredient
      )
    );
  };

  const decrementAmount = (name) => {
    setIngredients((prevIngredients) =>
      prevIngredients.map((ingredient) =>
        ingredient.name === name && ingredient.amount > 0
          ? { ...ingredient, amount: ingredient.amount - 1 }
          : ingredient
      )
    );
  };
  //console.log("scoreDifferences", scoreDifferences)
  return (
    <div className="ingredient-container">
      {sortedIngredients.map((ingredient) => {

        const { scoreDifferenceIncrement, scoreDifferenceDecrement } = scoreDifferences[ingredient.name] || {};


        return (
          <div key={ingredient.name} className="ingredient-row" style={{ color: ingredient.color }}>
            <span className="ingredient-name">
              {ingredient.name}
              <RarityIcon copies={ingredient.copies} color={ingredient.color}></RarityIcon>
              {/* {'★'.repeat(ingredient.level)} */}
            </span>
            <div className="score-difference">

              {(scoreDifferenceDecrement !== 0 || (ingredient.amount > 0 && scoreDifferenceDecrement === 0)) && (
                <span className={scoreDifferenceDecrement === 0 ? "score-negative no-change" : "score-negative"}>
                  {scoreDifferenceDecrement === 0 ? '-0' : scoreDifferenceDecrement}
                </span>
              )}
            </div>
            <button className="amount-button" onClick={() => decrementAmount(ingredient.name)}>-</button>
            <span className={ingredient.amount === 0 ? "ingredient-amount amount-zero" : "ingredient-amount"}>
              {ingredient.amount === 0 ? '-' : ingredient.amount}
            </span>
            <button className="amount-button" onClick={() => incrementAmount(ingredient.name)}>+</button>
            <div className="score-difference">
              {scoreDifferenceIncrement !== 0 && (
                <span className={scoreDifferenceIncrement > 0 ? "score-positive" : "score-negative"}>
                  +{scoreDifferenceIncrement}
                </span>
              )}

            </div>
          </div>
        );
      })}
    </div>
  );
};
const RarityIcon = ({ copies, color }) => {
  let rarity = 1;
  if (copies <= RARE_THRESHOLD) {
    rarity = 3;
  } else if (copies <= UNCOMMON_THRESHOLD) {
    rarity = 2;
  }

  // Enhance color if needed (modify as per your requirement)
  const enhancedColor = enhanceColor(color); // Function to make color more saturated/darker

  return (
    <div
      style={{
        height: '20px',
        width: '20px',
        display: 'inline-block',
        backgroundImage: `url(/ftx/cards/lvl${rarity}.png)`,
        backgroundSize: 'cover',
        backgroundBlendMode: 'multiply', // Adjust blend mode
        WebkitMask: `url(/ftx/cards/lvl${rarity}.png) no-repeat center / contain`,
        mask: `url(/ftx/cards/lvl${rarity}.png) no-repeat center / contain`,
        backgroundColor: enhancedColor, // Use enhanced color
      }}
      alt={`Level ${rarity} icon`}
      className="level-icon"
    />
  );
};

// Function to enhance color saturation or darkness
const enhanceColor = (color) => {
  // Implement logic to return a more saturated or darker version of the color
  // This might involve color manipulation libraries or custom logic
  return color; // Placeholder for the actual enhanced color
};

//CALCULATE COMBO SCORE
//CALCULATE COMBO SCORE
//CALCULATE COMBO SCORE

function calculateComboScore(combo, ingredientDict) {
  let comboScore = combo.score;
  let totalShortfall = 0;
  let potentialMissingIngredients = [];
  let totalIngredients = new Set();

  for (let line of combo.ComboLines) {
    const { shortfall, missingIngredients, ingredientLevelSum } = processComboLine(line, ingredientDict);

    comboScore += ingredientLevelSum + parseInt(line.requirements) * 2;
    totalShortfall += shortfall;
    if (shortfall === 1) {
      potentialMissingIngredients.push(...missingIngredients);
    }

    // Add ingredients to the totalIngredients set
    for (let ingredient of line.ingredients) {
      totalIngredients.add(ingredient);
    }
  }

  // Reduce the combo score by the number of unique ingredients, ensuring it doesn't go negative
  comboScore = Math.max(0, comboScore - Math.floor(totalIngredients.size / 2));

  return [comboScore, totalShortfall, potentialMissingIngredients];
}



//CHECK ALL SCORES
export function checkCompleteCombos(ingredients) {
  const completeCombos = [];
  const comboStatuses = []; // Array to store the status of all combos
  let totalScore = 0;
  let totalIngredientCount = 0;
  let combinedLevel = 0;
  const nearCompleteCombosIngredients = new Set();

  // Convert the ingredients into a dictionary for faster lookup
  const originalIngredientDict = createIngredientDictionary(ingredients)

  // Function to check if a single combo is complete and to calculate its score
  const isSingleComboComplete = (combo) => {
    const [comboScore, totalShortfall, potentialMissingIngredients] = calculateComboScore(combo, originalIngredientDict);
    return [totalShortfall === 0, comboScore, totalShortfall, potentialMissingIngredients];
  };


  // First pass to check combos without dependencies
  for (let truck of trucks) {
    for (let combo of truck.combos) {
      if (!combo.dependency) {
        const [isComplete, comboScore, shortfall, missingIngredients] = isSingleComboComplete(combo);
        if (isComplete) {
          completeCombos.push(combo.ComboName);
          totalScore += comboScore;
        } else {
          missingIngredients.forEach(ing => nearCompleteCombosIngredients.add(ing));
          comboStatuses.push({
            name: combo.ComboName,
            isComplete,
            shortfall
          });
        }
      }
    }
  }

  // Second pass to check combos with dependencies
  for (let truck of trucks) {
    for (let combo of truck.combos) {
      if (combo.dependency) {
        let isDependencyMet = false;

        if (combo.dependency.includes(' or ')) {
          const dependencies = combo.dependency.split(' or ');
          isDependencyMet = dependencies.some(dep => completeCombos.includes(dep));
        } else if (combo.dependency.includes(' and ')) {
          const dependencies = combo.dependency.split(' and ');
          isDependencyMet = dependencies.every(dep => completeCombos.includes(dep));
        } else {
          // Single dependency
          isDependencyMet = completeCombos.includes(combo.dependency);
        }

        if (isDependencyMet) {
          const [isComplete, comboScore, shortfall, missingIngredients] = isSingleComboComplete(combo);
          if (isComplete) {
            completeCombos.push(combo.ComboName);
            totalScore += comboScore;
          } else {
            missingIngredients.forEach(ing => nearCompleteCombosIngredients.add(ing));
            comboStatuses.push({
              name: combo.ComboName,
              isComplete,
              shortfall
            });
          }
        } else {
          const [isComplete, comboScore, shortfall, missingIngredients] = isSingleComboComplete(combo);
          comboStatuses.push({
            name: combo.ComboName,
            isComplete: false,
            shortfall,
            missingRequirement: true,
          });
        }
      }
    }
  }

  // Convert Set to Array for the final return
  const uniqueNearCompleteIngredients = Array.from(nearCompleteCombosIngredients);


  return [
    completeCombos,
    totalScore,
    totalIngredientCount,
    combinedLevel,
    uniqueNearCompleteIngredients,
    comboStatuses
  ];
}




const processComboLine = (line, ingredientDict) => {
  const requirement = parseInt(line.requirements, 10);
  let count = 0;
  let ingredientLevelSum = 0;
  let updatedIngredientDict = JSON.parse(JSON.stringify(ingredientDict));

  for (let ingredient of line.ingredients) {
    if (updatedIngredientDict[ingredient] && updatedIngredientDict[ingredient].amount >= 1) {
      count++;
      updatedIngredientDict[ingredient].amount--;
      ingredientLevelSum += CARD_SCORE_VALUE ?? updatedIngredientDict[ingredient].level;
    }
  }
  const shortfall = Math.max(0, requirement - count);


  let missingIngredients = [];
  if (shortfall === 1) {
    missingIngredients = line.ingredients.filter(ing => !ingredientDict[ing] || ingredientDict[ing].amount < 1);
  }

  return {
    count,
    shortfall,
    missingIngredients,
    ingredientLevelSum
  };
};

export function createIngredientDictionary(ingredients) {
  const ingredientDict = {};
  ingredients.forEach((ingredient) => {
    ingredientDict[ingredient.name] = {
      amount: ingredient.amount,
      level: ingredient.level
    };
  });
  return ingredientDict;
}






const getComboLineState = (line, ingredientState) => {
  const ingredientDict = createIngredientDictionary(ingredientState);
  const { count, shortfall, missingIngredients } = processComboLine(line, ingredientDict);
  return shortfall === 0 ? true : false;
}







//CHECK SCORE RANGE FOR A COMBO
function calculateMinMaxScore(combo) {
  const ingredientDict = createIngredientDictionary(initialIngredients.map(ingredient => ({ ...ingredient, amount: 0 })));

  // Calculate Max Score
  let maxDict = createMaxDict(combo, ingredientDict);
  let maxScore = calculateComboScore(combo, maxDict)[0];

  // Calculate Min Score
  let minDict = createMinDict(combo, ingredientDict);
  let minScore = calculateComboScore(combo, minDict)[0];

  // Check if min and max scores are the same
  if (minScore === maxScore) {
    return `${minScore}$`;
  } else {
    return `${minScore}-${maxScore}$`;
  }
}
function createMaxDict(combo, ingredientDict) {
  let maxDict = { ...ingredientDict };

  combo.ComboLines.forEach(line => {
    line.ingredients.forEach(ingredient => {
      maxDict[ingredient].amount = 1;
    });
  });

  return maxDict;
}

function createMinDict(combo, ingredientDict) {
  let minDict = { ...ingredientDict };
  resetDictAmounts(minDict);

  for (const line of combo.ComboLines) {
    let requirements = line.requirements;

    for (let level = 1; level <= 3 && requirements > 0; level++) {
      for (const ingredient of line.ingredients) {
        if (ingredientDict[ingredient].level === level && minDict[ingredient].amount === 0) {
          minDict[ingredient].amount = 1;
          requirements--;
          if (requirements === 0) break;
        }
      }
    }
  }

  return minDict;
}

function resetDictAmounts(dict) {
  for (let key in dict) {
    dict[key].amount = 0;
  }
}

function createIngredientDictionaryFromIntials(initialIngredients) {
  const dict = {};
  initialIngredients.forEach(ingredient => {
    dict[ingredient.name] = { ...ingredient, amount: 0 };
  });
  return dict;
}



// {
//   "ComboName": "Polenta",
//   "dependency": null,
//   "score": 4,
//   "type": null,
//   "ComboLines": [
//     {
//       "ingredients": [
//         "corn",
//         "flour",
//         "cheese"
//       ],
//       "requirements": "3"
//     },
//     {
//       "ingredients": [
//         "sugar",
//         "bacon",
//         "mushrooms"
//       ],
//       "requirements": "1"
//     }

//   ]
// },




const defaultFont = "font-1";


const myTruckColor = '#4fe394';
const truckStyles = {
  taco: {
    titleFont: 'caveatBrush',
    mainFont: defaultFont,
    color: '#97d66b', // Lime Green
  },
  mytruck: {
    titleFont: 'mytruck',
    mainFont: 'mytruck',
    color: myTruckColor,
  },
  burger: {
    titleFont: "sedgwickAveDisplay",
    mainFont: defaultFont,
    color: '#d14b4b', // Ketchup Red
  },
  curry: {
    titleFont: "sedgwickAveDisplay",
    mainFont: defaultFont,
    color: '#FFA07A', // Curry Orange
  },
  pasta: {
    titleFont: "grechenFuemen",
    mainFont: defaultFont,
    color: '#e8d25a', // Pasta Yellow
  },
  bbq: {
    titleFont: "loveYaLikeASister",
    mainFont: defaultFont,
    color: '#9a7bdb', // Purple (Unchanged)
  },
  bao: {
    titleFont: "caveatBrush",
    mainFont: defaultFont,
    color: '#7bc8db', // Light Blue (Unchanged)
  },
  // Add more styles here
  default: {
    titleFont: defaultFont,
    mainFont: defaultFont,
    color: '#FFFFFF', // White
  },
};


function calculateTotalIngredients() {
  let totalIngredients = 0;
  const levelCount = {}; // Object to store counts per level
  const rarityCount = { rare: 0, uncommon: 0, common: 0 }; // Object to store rarity counts
  const rarityTypeCount = { rare: 0, uncommon: 0, common: 0 }; // Object to store unique rarity types

  for (let i = 0; i < initialIngredients.length; i++) {
    const ingredient = initialIngredients[i];
    totalIngredients += ingredient.copies;

    // Update level count
    if (!levelCount[ingredient.level]) {
      levelCount[ingredient.level] = 0;
    }
    levelCount[ingredient.level] += ingredient.copies;

    // Update rarity count and rarity type count
    if (ingredient.copies <= RARE_THRESHOLD) {
      rarityCount.rare += ingredient.copies;
      rarityTypeCount.rare += 1;
    } else if (ingredient.copies <= UNCOMMON_THRESHOLD) {
      rarityCount.uncommon += ingredient.copies;
      rarityTypeCount.uncommon += 1;
    } else {
      rarityCount.common += ingredient.copies;
      rarityTypeCount.common += 1;
    }
  }

  return { totalIngredients, levelCount, rarityCount, rarityTypeCount };
}
