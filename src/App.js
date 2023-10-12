import React, { useRef, useState, useEffect, useMemo} from 'react';
import Slider from 'react-slick';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import  trucks  from './trucks.json';
import  initialIngredients  from './initialIngredients.json';

import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import './App.css'; // your custom css


export default function App() {
  const slider1 = useRef(null);
  const slider2 = useRef(null);
  const [autoSlide, setAutoSlide] = useState(false);
  const [key, setKey] = useState(Math.random());
  const loadFromLocalStorage = () => {
    const storedIngredients = localStorage.getItem('ingredients');
    return storedIngredients ? JSON.parse(storedIngredients) : initialIngredients.map((ingredient) => ({ ...ingredient, amount: 0 }));
  };

  const [ingredients, setIngredients] = useState(loadFromLocalStorage);
  useEffect(() => {
    localStorage.setItem('ingredients', JSON.stringify(ingredients));
  }, [ingredients]);

  console.log(trucks);
  console.log(initialIngredients)
  console.log(ingredients)
  console.log("Totalt copies: " +calculateTotalIngredients());


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
      autoplay: autoSlide,
      autoplaySpeed: 20000,
      asNavFor: null, // Replace with slider2.current if needed
    }),
    [isLandscapeOrDesktop, autoSlide]
  );


  const thumbnailSettings = {
    infinite: true,
    focusOnSelect: true,
    slidesToShow: 6,
    swipeToSlide: true,
    arrows: false,
    asNavFor: slider1.current,
    autoplay:false
  };
  console.log(trucks)


  const toggleAutoSlide = () => {
    setAutoSlide(!autoSlide);
    setKey(Math.random()); // Force re-render by changing the key
  };
  const [completeCombos, totalScore] = checkCompleteCombos(ingredients);
  return (
    <div className={`container ${isLandscapeOrDesktop ? "desktop" : null }`} >
      {/* <div className="title">FTX</div> */}
      <Slider key={key} ref={slider1} {...settings}>
        {trucks.map((truck, index) =>
          (<TruckMenu key={index} truckData={truck} ingredientsState={ingredients} decrementAmount={decrementAmount} incrementAmount={incrementAmount}></TruckMenu>)
        )}

      </Slider>
      <div className="score-row" >
        <b>Score: {totalScore}</b><br></br> {completeCombos.join(", ")}
        <Button variant="outline" className="open-dialog-button" onClick={() => {
          setOpen(true)

        }}>
          <span className='ingredient-counter'>{countIngredients()}</span>
          +
        </Button>
        
        
      </div>
      <Dialog open={open} onClose={handleClose} className="ingredient-dialog">
        <div className="dialog-title-actions">
          <DialogTitle className="dialog-title">Ingredients</DialogTitle>
          <DialogActions className="dialog-actions">
            { isLandscapeOrDesktop ? <Button className="dialog-actions-button" onClick={toggleAutoSlide} >
            {autoSlide ? 'Disable Auto-Slide' : 'Enable Auto-Slide'}
            </Button> : null}
            <Button className="dialog-actions-button" onClick={reset} >
              Reset
            </Button>
            <Button className="dialog-actions-button" onClick={handleClose} >
              x
            </Button>

          </DialogActions>
        </div>
        <DialogContent>
          <IngredientList ingredients={ingredients} setIngredients={setIngredients} />
        </DialogContent>

      </Dialog>
      <div className="thumbnail-slider-wrap">
        <Slider ref={slider2} {...thumbnailSettings}>
          {trucks.map((truck, index) => (
            <TruckThumbnail
              key={index}
              truckData={truck}
              goTo={goTo}
              index={index}
            />
          ))}
        </Slider>
      </div>
    </div>
  );
}

const TruckMenu = ({ truckData, ingredientsState, incrementAmount,decrementAmount }) => {
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
             return (
              <div key={lineIndex} className="combo-line">
                <span className="requirements">{line.requirements}</span>
                <span className="ingredients">
                 
                  {line.ingredients.map((ingredientName, ingIndex) => {
                    const matchedIngredient = findMatchingIngredient(ingredientName, workingIngredients);
                    const className = matchedIngredient ? 'ingredient-match' : '';
                    const color = matchedIngredient ? matchedIngredient.color : 'white'
                    return (
                      <>
                        <div key={ingIndex} onClick={() => matchedIngredient ? decrementAmount(ingredientName) : incrementAmount(ingredientName)} className={`ingredient ${className}`} style={{ display: 'inline', color: color }}>
                          {ingredientName}
                        </div>
                        {ingIndex < line.ingredients.length - 1 && <span style={{ display: 'inline' }}> - </span>}
                      </>
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
  for (let i = 0; i < initialIngredients.length; i++) {
    totalIngredients += initialIngredients[i].copies;
  }
  return totalIngredients;
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

const IngredientList = ({ ingredients, setIngredients }) => {
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
  return (
    <div className="ingredient-container">

      {ingredients.map((ingredient) => (
        <div key={ingredient.name} className="ingredient-row" style={{ color: ingredient.color }}>
          <span className="ingredient-name">{ingredient.name} {'★'.repeat(ingredient.level)}</span>
          <button className="amount-button" onClick={() => decrementAmount(ingredient.name)}>-</button>
          <span className="ingredient-amount">{ingredient.amount}</span>
          <button className="amount-button" onClick={() => incrementAmount(ingredient.name)}>+</button>
        </div>
      ))}
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


function checkCompleteCombos(ingredients) {
  const completeCombos = [];
  let totalScore = 0;

  // Convert the ingredients into a dictionary for faster lookup
  const originalIngredientDict = {};
  ingredients.forEach((ingredient) => {
    originalIngredientDict[ingredient.name] = { amount: ingredient.amount, level: ingredient.level };
  });

  // Function to check if a single combo is complete and to calculate its score
  const isSingleComboComplete = (combo) => {
    let comboScore = 0;
    let ingredientLevelSum = 0;
    let ingredientCount = 0;

    // Create a working copy of the ingredient dictionary
    const ingredientDict = JSON.parse(JSON.stringify(originalIngredientDict));

    for (let line of combo.ComboLines) {
      const requirement = parseInt(line.requirements, 10);
      const isPlus = line.requirements.includes('+');

      let count = 0;

      for (let ingredient of line.ingredients) {
        if (ingredientDict[ingredient] && ingredientDict[ingredient].amount >= 1) {
          count++;
          ingredientDict[ingredient].amount--; // Decrement the amount
          ingredientLevelSum += ingredientDict[ingredient].level;
          ingredientCount++;
        }
      }

      if (!((isPlus && count >= requirement) || (!isPlus && count === requirement))) {
        return [false, 0];
      }
    }

    comboScore = combo.score + ingredientCount + ingredientLevelSum;
    return [true, comboScore];
  };

  // First pass to check combos without dependencies
  for (let truck of trucks) {
    for (let combo of truck.combos) {
      if (!combo.dependency) {
        const [isComplete, comboScore] = isSingleComboComplete(combo);
        if (isComplete) {
          completeCombos.push(combo.ComboName);
          totalScore += comboScore;
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
        const [isComplete, comboScore] = isSingleComboComplete(combo);
        if (isComplete) {
          completeCombos.push(combo.ComboName);
          totalScore += comboScore;
        }
      }
    }
  }
}

  return [completeCombos, totalScore];
}









