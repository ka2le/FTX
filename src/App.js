import React, { useRef, useState, useEffect, useMemo } from 'react';
import Slider from 'react-slick';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Button from '@mui/material/Button';
import trucks from './trucks.json';
import initialIngredients from './initialIngredients.json';
import { TradePage, makeIngredientsArray, createDeck, handleDealCards, MAX_HAND_LIMIT } from './TradePage';
import { Cards } from './Cards';


import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import './App.css'; // your custom css

export const TESTING = true;
const WORKING_ON_CARDS = false;



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

  const [tradeInterface, setTradeInterface] = useState(loadTradeInterfaceFromLocalStorage);
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
    setTradeInterface(!tradeInterface);
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
  const [ingredients, setIngredients] = useState(loadFromLocalStorage);
  useEffect(() => {
    localStorage.setItem('ingredients', JSON.stringify(ingredients));
  }, [ingredients]);
  useEffect(() => {
    localStorage.setItem('players', JSON.stringify(players));
  }, [players]);
  useEffect(() => {
    localStorage.setItem('tradeInterface', JSON.stringify(tradeInterface));
  }, [tradeInterface]);
  useEffect(() => {
    localStorage.setItem('currentPlayerId', JSON.stringify(currentPlayerId));
  }, [currentPlayerId]);

  console.log(trucks);
  console.log(initialIngredients)
  console.log(ingredients)
  console.log(players[0])
  const result = calculateTotalIngredients();

  console.log("Total Ingredients: ", result.totalIngredients);
  console.log("Ingredients by Level: ", result.levelCount);
  console.log("Split all card 5 players: ", result.totalIngredients / 5)
  console.log("Split all card 9 players: ", result.totalIngredients / 9)
  console.log("Cards left for max " + MAX_HAND_LIMIT + " cards 5 players: ", Math.floor((result.totalIngredients / 5 - MAX_HAND_LIMIT) * 5))


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
    console.log("incrementAmount")
    setIngredients((prevIngredients) =>
      prevIngredients.map((ingredient) =>
        ingredient.name === name
          ? { ...ingredient, amount: ingredient.amount + 1 }
          : ingredient
      )
    );
  };

  const decrementAmount = (name) => {
    console.log("decrementAmount")
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
        scoreDifferenceIncrement: calculateScoreDifference(ingredient.name, true,initialScore),
        scoreDifferenceDecrement: calculateScoreDifference(ingredient.name, false,initialScore),
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
    console.log("calculateScoreDifference", name, isIncrement, modifiedScore, initalScore)
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
          {tradeInterface ? null : <span className='ingredient-counter'>{countIngredients()}</span>}
          {tradeInterface ? <span >⬌</span> : "+"}

        </Button>


      </div>
      <Dialog open={open} onClose={handleClose} className={`ingredient-dialog ${tradeInterface ? "trade" : null}`}>
        <div className="dialog-title-actions">

          <DialogTitle className="dialog-title">{tradeInterface ? "Trade" : "Ingredients"}</DialogTitle>
          <DialogActions className="dialog-actions">
            {false ? <Button className="dialog-actions-button" onClick={toggleAutoSlide} >
              {(autoSlide) ? 'Disable Auto-Slide' : 'Enable Auto-Slide'}
            </Button> : null}
            <Button className="dialog-actions-button" onClick={toggleTradeInterface} >
              {(!tradeInterface) ? '👥' : "👤"}
            </Button>
            {tradeInterface ? <>
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
                  Reset
                </Button>
                <Button className="dialog-actions-button" onClick={handleClose} >
                  x
                </Button></>}



          </DialogActions>
        </div>
        <DialogContent>
          {tradeInterface ?
            <TradePage ingredients={ingredients} setIngredients={setIngredients} deck={deck} setDeck={setDeck} players={players} setPlayers={setPlayers} currentPlayerId={currentPlayerId}></TradePage> :
            <IngredientList ingredients={ingredients} setIngredients={setIngredients} scoreDifferences={scoreDifferences} />}
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
            < MyTruckThumbnail  goTo={goTo}
              index={trucks?.length}></MyTruckThumbnail>
       

        </Slider>}
      </div>
    </div>}</>
  );
}



const getComboLineState = (line, ingredientState) => {
  const ingredientDict = createIngredientDictionary(ingredientState);
  const { count, shortfall, missingIngredients } = processComboLine(line, ingredientDict);
  return shortfall === 0 ? true : false;
}

export const MyTruckMenu = ({ ingredientsState, incrementAmount, decrementAmount }) => {
  // Assuming checkCompleteCombos and trucks array are available in this scope

  // Get the list of complete combo names
  const [completeCombos] = checkCompleteCombos(ingredientsState);

  // Find the combos details from the trucks array
  const myTruckCombos = completeCombos.flatMap(comboName => 
    trucks.flatMap(truck => 
      truck.combos.filter(combo => combo.ComboName === comboName)
    )
  );

  // Construct the "MyTruck" object
  const myTruck = {
    TruckName: "MyTruck",
    short: "MyTruck",
    combos: myTruckCombos
  };

  // Render the TruckMenu component with the constructed "MyTruck"
  return (
    <TruckMenu
      truckData={myTruck}
      ingredientsState={ingredientsState}
      incrementAmount={incrementAmount}
      decrementAmount={decrementAmount}
    />
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

  return (
    <div className={`truck-container ${currentStyle.mainFont}`}>
      <h1
        className={currentStyle.titleFont}
        style={{
          color: currentStyle.color,
        }}
      >{truckData.TruckName}</h1>
      {truckData.combos.map((combo, index) => (
        <div key={index}>
          <h2 className={currentStyle.titleFont} style={{
            color: currentStyle.color,
          }}>{combo.ComboName}<span className='dependecy-indicator'>{combo.dependency ? "Requires: " + combo.dependency : null}</span></h2>
          <div className='combo-score' style={{
            color: currentStyle.color,
          }}>{combo.score}$</div>
          {combo.ComboLines.map((line, lineIndex) => {
            const workingIngredients = JSON.parse(JSON.stringify(ingredientsState));
            const comboLineState = getComboLineState(line, ingredientsState);
            const comboLineClass = `combo-line ${comboLineState ? 'fulfilled' : ''}`;
            return (
              <div key={lineIndex} className={comboLineClass}>
                <span className="requirements " style={{ color: comboLineState ? currentStyle.color : "white" }}>{line.requirements}</span>
                <span className="ingredients">

                  {line.ingredients.map((ingredientName, ingIndex) => {
                    const matchedIngredient = findMatchingIngredient(ingredientName, workingIngredients);
                    const className = matchedIngredient ? 'ingredient-match' : '';
                    const color = matchedIngredient ? matchedIngredient.color : 'white'
                    return (
                      <span key={ingIndex}>
                        <div key={ingIndex} onClick={() => matchedIngredient ? decrementAmount(ingredientName) : incrementAmount(ingredientName)} className={`ingredient ${className}`} style={{ display: 'inline', color: color }}>
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
function calculateTotalIngredients() {
  let totalIngredients = 0;
  const levelCount = {}; // Object to store counts per level

  for (let i = 0; i < initialIngredients.length; i++) {
    const ingredient = initialIngredients[i];
    totalIngredients += ingredient.copies;

    // If the level doesn't exist in the object, initialize it with 0
    if (!levelCount[ingredient.level]) {
      levelCount[ingredient.level] = 0;
    }

    // Increment the count for the ingredient's level
    levelCount[ingredient.level] += ingredient.copies;
  }

  return { totalIngredients, levelCount };
}


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
const MyTruckThumbnail = ({  goTo, index }) => {
  // Get the truck style or fallback to default
  const currentStyle = truckStyles["MyTruck"] || truckStyles.default;

  return (
    <div
      className="thumbnail-container"
      style={{
        borderColor: currentStyle.color,
        color: currentStyle.color,
      }}
      onClick={() => goTo(index)}
    >
      MyTr
    </div>
  );
};


const IngredientList = ({ ingredients, setIngredients,scoreDifferences }) => {
  

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
  console.log("scoreDifferences", scoreDifferences)
  return (
    <div className="ingredient-container">
      {ingredients.map((ingredient) => {
        
         const { scoreDifferenceIncrement, scoreDifferenceDecrement } = scoreDifferences[ingredient.name] || {};


        return (
          <div key={ingredient.name} className="ingredient-row" style={{ color: ingredient.color }}>
            <span className="ingredient-name">{ingredient.name} {'★'.repeat(ingredient.level)}</span>
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


const defaultFont = "font-1";



const truckStyles = {
  taco: {
    titleFont: 'caveatBrush',
    mainFont: defaultFont,
    color: '#97d66b', // Lime Green
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

const processComboLine = (line, ingredientDict) => {
  const requirement = parseInt(line.requirements, 10);
  let count = 0;
  let ingredientLevelSum = 0;
  let updatedIngredientDict = JSON.parse(JSON.stringify(ingredientDict));

  for (let ingredient of line.ingredients) {
    if (updatedIngredientDict[ingredient] && updatedIngredientDict[ingredient].amount >= 1) {
      count++;
      updatedIngredientDict[ingredient].amount--;
      ingredientLevelSum += updatedIngredientDict[ingredient].level;
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


export function checkCompleteCombos(ingredients) {
  const completeCombos = [];
  let totalScore = 0;
  let totalIngredientCount = 0;
  let combinedLevel = 0;
  const nearCompleteCombosIngredients = new Set();

  // Convert the ingredients into a dictionary for faster lookup
  const originalIngredientDict = createIngredientDictionary(ingredients)

  // Function to check if a single combo is complete and to calculate its score
  const isSingleComboComplete = (combo) => {

    let comboScore = 0;
    let ingredientLevelSum = 0;
    let ingredientCount = 0;
    let totalShortfall = 0; // Total shortfall across all combo lines
    let potentialMissingIngredients = [];



    for (let line of combo.ComboLines) {
      const { shortfall, missingIngredients, ingredientLevelSum: lineSum } = processComboLine(line, originalIngredientDict);

      ingredientLevelSum += lineSum;
      totalShortfall += shortfall;
      if (shortfall === 1) {
        potentialMissingIngredients.push(...missingIngredients);
      }
    }

    comboScore = combo.score + ingredientLevelSum;
    //console.log(combo, totalShortfall, potentialMissingIngredients)
    if (totalShortfall === 1) {
      // The combo is exactly one ingredient away from being complete
      return [false, 0, true, potentialMissingIngredients];
    } else {
      return [totalShortfall === 0, comboScore, false, []];
    }
  };


  // First pass to check combos without dependencies
  for (let truck of trucks) {
    for (let combo of truck.combos) {
      if (!combo.dependency) {
        const [isComplete, comboScore, isNearComplete, missingIngredients] = isSingleComboComplete(combo);
        if (isComplete) {
          completeCombos.push(combo.ComboName);
          totalScore += comboScore;
        } else if (isNearComplete) {
          missingIngredients.forEach(ing => nearCompleteCombosIngredients.add(ing));
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
          const [isComplete, comboScore, isNearComplete, missingIngredients] = isSingleComboComplete(combo);
          if (isComplete) {
            completeCombos.push(combo.ComboName);
            totalScore += comboScore;
          } else if (isNearComplete) {
            missingIngredients.forEach(ing => nearCompleteCombosIngredients.add(ing));
          }
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
    uniqueNearCompleteIngredients
  ];
}









