import React, { useRef, useState, useEffect } from 'react';
import Slider from 'react-slick';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';

import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import './App.css'; // your custom css

export default function App() {
  const slider1 = useRef(null);
  const slider2 = useRef(null);
  const loadFromLocalStorage = () => {
    const storedIngredients = localStorage.getItem('ingredients');
    return storedIngredients ? JSON.parse(storedIngredients) : initialIngredients.map((ingredient) => ({ ...ingredient, amount: 0 }));
  };

  const [ingredients, setIngredients] = useState(loadFromLocalStorage);
  useEffect(() => {
    localStorage.setItem('ingredients', JSON.stringify(ingredients));
  }, [ingredients]);
  const reset = () => {
    const userConfirmed = window.confirm('Are you sure you want to reset all ingredients?');
    if (userConfirmed) {
      localStorage.removeItem('ingredients');
      setIngredients(initialIngredients.map((ingredient) => ({ ...ingredient, amount: 0 })));
    }
  };

  const [open, setOpen] = useState(false);
  const handleClose = () => {

    setOpen(false);
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
  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    asNavFor: slider2.current
  };

  const thumbnailSettings = {
    infinite: true,
    focusOnSelect: true,
    slidesToShow: 6,
    swipeToSlide: true,
    arrows: false,
    asNavFor: slider1.current
  };
  console.log(combos)

  const [completeCombos, totalScore] = checkCompleteCombos(ingredients, combos);
  return (
    <div className="container" >
      {/* <div className="title">FTX</div> */}
      <Slider ref={slider1} {...settings}>
        {combos.map((truck, index) =>
          (<TruckMenu key={index} truckData={truck} ingredientsState={ingredients}></TruckMenu>)
        )}

      </Slider>
      <div className="score-row" >
      <b>Score: {totalScore}</b><br></br> {completeCombos.join(", ")}
        <Button variant="outline" className="open-dialog-button" onClick={() => {
          setOpen(true)

        }}>
          +
        </Button>
      </div>
      <Dialog open={open} onClose={handleClose} className="ingredient-dialog">
        <div className="dialog-title-actions">
          <DialogTitle className="dialog-title">Ingredients</DialogTitle>
          <DialogActions className="dialog-actions">
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
          {combos.map((truck, index) => (
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

const TruckMenu = ({ truckData, ingredientsState }) => {
  const currentStyle = truckStyles[truckData.short.toLowerCase()] || truckStyles.default;

  // Function to find matching ingredients
  const findMatchingIngredient = (ingredientName, availableIngredients) => {
    return availableIngredients.find(ing => ing.name === ingredientName && ing.amount > 0);
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
          }}>{combo.ComboName}<span className='dependecy-indicator'>{combo.dependency ? "Requires: "+combo.dependency: null }</span></h2>
          <div className='combo-score'  style={{
            color: currentStyle.color,
          }}>{combo.score}$</div>
          {combo.ComboLines.map((line, lineIndex) => (
            <div key={lineIndex} className="combo-line">
              <span className="requirements">{line.requirements}</span>
              <span className="ingredients">
                {line.ingredients.map((ingredientName, ingIndex) => {
                  const matchedIngredient = findMatchingIngredient(ingredientName, ingredientsState);
                  const className = matchedIngredient ? 'ingredient-match' : '';
                  const color = matchedIngredient ? matchedIngredient.color : 'white'
                  return (
                    <>
                      <div key={ingIndex} className={`ingredient ${className}`} style={{ display: 'inline', color: color }}>
                        {ingredientName}
                      </div>
                      {ingIndex < line.ingredients.length - 1 && <span style={{ display: 'inline' }}> - </span>}
                    </>
                  );
                })}
              </span>
              
            </div>
          ))}
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
        backgroundColor: 'black',
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
          <span className="ingredient-name">{ingredient.name}</span>
          <button className="amount-button" onClick={() => decrementAmount(ingredient.name)}>-</button>
          <span className="ingredient-amount">{ingredient.amount}</span>
          <button className="amount-button" onClick={() => incrementAmount(ingredient.name)}>+</button>
        </div>
      ))}
    </div>
  );
};


const defaultFont = "font-1";

// .permanentMarker
// .hallelujah
// .caveatBrush
// .grechenFuemen
// .loveYaLikeASister
// .mrsSheppards
// .sedgwickAveDisplay

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


function checkCompleteCombos(ingredients, foodTrucks) {
  const completeCombos = [];
  let totalScore = 0;

  // Convert the ingredients into a dictionary for faster lookup
  const ingredientDict = {};
  ingredients.forEach((ingredient) => {
    ingredientDict[ingredient.name] = ingredient.amount;
  });

  // Function to check if a single combo is complete
  const isSingleComboComplete = (combo) => {
    for (let line of combo.ComboLines) {
      const requirement = parseInt(line.requirements, 10);
      const isPlus = line.requirements.includes('+');

      let count = 0;
      let ingredientCount = {};
      line.ingredients.forEach((ingredient) => {
        ingredientCount[ingredient] = (ingredientCount[ingredient] || 0) + 1;
      });

      for (let ingredient in ingredientCount) {
        if (ingredientDict[ingredient] && ingredientDict[ingredient] >= ingredientCount[ingredient]) {
          count += ingredientCount[ingredient];
        }
      }

      if (!((isPlus && count >= requirement) || (!isPlus && count === requirement))) {
        return false;
      }
    }
    return true;
  };

  // First pass to check combos without dependencies
  for (let truck of foodTrucks) {
    for (let combo of truck.combos) {
      if (!combo.dependency && isSingleComboComplete(combo)) {
        completeCombos.push(combo.ComboName);
        totalScore += combo.score;
      }
    }
  }

  // Second pass to check combos with dependencies
  for (let truck of foodTrucks) {
    for (let combo of truck.combos) {
      if (combo.dependency && completeCombos.includes(combo.dependency)) {
        if (isSingleComboComplete(combo)) {
          completeCombos.push(combo.ComboName);
          totalScore += combo.score;
        }
      }
    }
  }

  return [completeCombos, totalScore];
}


const initialIngredients = [
  { "name": "aubergine", "color": "#B085B7" },
  { "name": "avocado", "color": "#B2EABD" },
  { "name": "banana", "color": "#FFF58D" },
  { "name": "bao buns", "color": "#F2F2F2" },
  { "name": "basil", "color": "#75E050" },
  { "name": "beans", "color": "#D4B68D" },
  { "name": "beef", "color": "#F28580" },
  { "name": "cabbage", "color": "#BAE8A3" },
  { "name": "carrot", "color": "#FFC55B" },
  { "name": "cheese", "color": "#FFF78D" },
  { "name": "chicken", "color": "#FFE16D" },
  { "name": "chili", "color": "#FF9270" },
  { "name": "chili mayo", "color": "#FFC575" },
  { "name": "cilantro", "color": "#75E050" },
  { "name": "corn", "color": "#FFF78D" },
  { "name": "cornbread", "color": "#FFE16D" },
  { "name": "cucumber", "color": "#8AE6A1" },
  { "name": "dairy", "color": "#FFFDC5" },
  { "name": "egg", "color": "#FFF78D" },
  { "name": "fish", "color": "#8DDCFF" },
  { "name": "flour", "color": "#F2F2F2" },
  { "name": "fries", "color": "#FFC55B" },
  { "name": "garlic", "color": "#FFFDC5" },
  { "name": "ginger", "color": "#FFE16D" },
  { "name": "hamburger buns", "color": "#FFE16D" },
  { "name": "hoisin sauce", "color": "#B39D8D" },
  { "name": "lemon", "color": "#FFF78D" },
  { "name": "lettuce", "color": "#B2EABD" },
  { "name": "lime", "color": "#D4F585" },
  { "name": "mango", "color": "#FFD48D" },
  { "name": "mushroom", "color": "#EAB4A1" },
  { "name": "mushrooms", "color": "#EAB4A1" },
  { "name": "naan", "color": "#FFE6C0" },
  { "name": "oil", "color": "#F2F2F2" },
  { "name": "onion", "color": "#EFC5F0" },
  { "name": "pasta", "color": "#FFEB85" },
  { "name": "peanuts", "color": "#E1C5A8" },
  { "name": "pineapple", "color": "#FFFAB0" },
  { "name": "pork", "color": "#FFB2A0" },
  { "name": "potato", "color": "#FFD48D" },
  { "name": "rice", "color": "#FFEB85" },
  { "name": "salt", "color": "#F2F2F2" },
  { "name": "shrimp", "color": "#FFB2A0" },
  { "name": "soy sauce", "color": "#B39D8D" },
  { "name": "spices", "color": "#E6B22D" },
  { "name": "strawberries", "color": "#FF90B5" },
  { "name": "sugar", "color": "#FFFDC5" },
  { "name": "tofu", "color": "#F7F7F7" },
  { "name": "tomato", "color": "#FF9B90" },
  { "name": "tortilla", "color": "#FFEB85" }
]



const combos = [
  {
    "TruckName": "Turbo Burgers",
    "short": "Burger",
    "combos": [
      {
        "ComboName": "Burgers!",
        "dependency": null,
        "score": 3,
        "type": null,
        "ComboLines": [
          {
            "ingredients": [
              "hamburger buns",
              "beef"
            ],
            "requirements": "2"
          },
          {
            "ingredients": [
              "chicken",
              "fish",
              "mushrooms"
            ],
            "requirements": "0+"
          },
          {
            "ingredients": [
              "cucumber",
              "lettuce",
              "tomato",
              "onion"
            ],
            "requirements": "2+"
          },
          {
            "ingredients": [
              "salt",
              "pork"
            ],
            "requirements": "2"
          }
        ]
      },
      {
        "ComboName": "Fries",
        "dependency": "Burgers!",
        "score": 3,
        "type": null,
        "ComboLines": [
          {
            "ingredients": [
              "fries"
            ],
            "requirements": "1"
          }
        ]
      },
      {
        "ComboName": "Supersize",
        "dependency": "Burgers!",
        "score": 3,
        "type": null,
        "ComboLines": [
          {
            "ingredients": [
              "fries",
              "fries"
            ],
            "requirements": "2"
          }
        ]
      },
      {
        "ComboName": "Loaded Fries",
        "dependency": "Burgers!",
        "score": 3,
        "type": null,
        "ComboLines": [
          {
            "ingredients": [
              "fries",
              "cheese",
              "salt",
              "pork"
            ],
            "requirements": "4"
          }
        ]
      },
      {
        "ComboName": "Extra Patties",
        "dependency": null,
        "score": 3,
        "type": null,
        "ComboLines": [
          {
            "ingredients": [
              "beef",
              "beef",
              "beef"
            ],
            "requirements": "3"
          }
        ]
      }
    ]
  },
  {
    "TruckName": "Taco o Plomo",
    "short": "Taco",
    "combos": [
      {
        "ComboName": "Taco Mix",
        "dependency": null,
        "score": 3,
        "type": null,
        "ComboLines": [
          {
            "ingredients": [
              "tortilla",
              "chili"
            ],
            "requirements": "2"
          },
          {
            "ingredients": [
              "beef",
              "pork",
              "chicken",
              "shrimp",
              "beans"
            ],
            "requirements": "2+"
          },
          {
            "ingredients": [
              "lime",
              "cilantro",
              "onion",
              "tomato"
            ],
            "requirements": "2+"
          }
        ]
      },
      {
        "ComboName": "Elotes",
        "dependency": null,
        "score": 3,
        "type": null,
        "ComboLines": [
          {
            "ingredients": [
              "corn",
              "cheese",
              "lime"
            ],
            "requirements": "3"
          }
        ]
      },
      {
        "ComboName": "Burrito",
        "dependency": "Taco Mix",
        "score": 3,
        "type": null,
        "ComboLines": [
          {
            "ingredients": [
              "rice"
            ],
            "requirements": "1"
          }
        ]
      },
      {
        "ComboName": "Double Bag It",
        "dependency": "Taco Mix",
        "score": 3,
        "type": null,
        "ComboLines": [
          {
            "ingredients": [
              "tortilla",
              "tortilla"
            ],
            "requirements": "2"
          }
        ]
      },
      {
        "ComboName": "Guacamole",
        "dependency": "Taco Mix",
        "score": 3,
        "type": null,
        "ComboLines": [
          {
            "ingredients": [
              "avocado"
            ],
            "requirements": "1"
          }
        ]
      },
      {
        "ComboName": "Pineapple Express",
        "dependency": "Taco Mix",
        "score": 3,
        "type": null,
        "ComboLines": [
          {
            "ingredients": [
              "pineapple"
            ],
            "requirements": "1"
          }
        ]
      }
    ]
  },


  {
    "TruckName": "The Curry Cruiser",
    "short": "Curry",
    "combos": [
      {
        "ComboName": "Curry Curry",
        "dependency": null,
        "score": 3,
        "type": null,
        "ComboLines": [
          {
            "ingredients": [
              "spices",
              "spices"
            ],
            "requirements": "2"
          },
          {
            "ingredients": [
              "rice",
              "naan"
            ],
            "requirements": "1+"
          },
          {
            "ingredients": [
              "pork",
              "cheese",
              "chicken",
              "fish"
            ],
            "requirements": "1+"
          },
          {
            "ingredients": [
              "tomato",
              "cabbage",
              "carrot",
              "peanuts"
            ],
            "requirements": "1+"
          },
          {
            "ingredients": [
              "garlic",
              "ginger",
              "onion",
              "chili"
            ],
            "requirements": "2+"
          }
        ]
      },
      {
        "ComboName": "Samosas",
        "dependency": null,
        "score": 3,
        "type": null,
        "ComboLines": [
          {
            "ingredients": [
              "flour",
              "potato",
              "oil",
              "spices"
            ],
            "requirements": "4"
          }
        ]
      },
      {
        "ComboName": "Chutney",
        "dependency": null,
        "score": 3,
        "type": null,
        "ComboLines": [
          {
            "ingredients": [
              "sugar"
            ],
            "requirements": "1"
          },
          {
            "ingredients": [
              "lime",
              "lemon"
            ],
            "requirements": "1"
          },
          {
            "ingredients": [
              "banana",
              "pineapple",
              "mango"
            ],
            "requirements": "1+"
          },
          {
            "ingredients": [
              "garlic",
              "onion",
              "ginger"
            ],
            "requirements": "1"
          }
        ]
      }
    ]
  },
  {
    "TruckName": "The Bao Bus",
    "short": "Bao",
    "combos": [
      {
        "ComboName": "Bao Dream",
        "dependency": null,
        "score": 3,
        "type": null,
        "ComboLines": [
          {
            "ingredients": [
              "bao buns",
              "spices"
            ],
            "requirements": "2"
          },
          {
            "ingredients": [
              "chicken",
              "mushroom",
              "pork",
              "beef"
            ],
            "requirements": "2+"
          },
          {
            "ingredients": [
              "peanuts",
              "onion",
              "cabbage",
              "cucumber"
            ],
            "requirements": "2+"
          },
          {
            "ingredients": [
              "lime",
              "cilantro",
              "chili",
              "ginger"
            ],
            "requirements": "2+"
          },
          {
            "ingredients": [
              "hoisin sauce",
              "chili mayo"
            ],
            "requirements": "1+"
          }
        ]
      },
      {
        "ComboName": "Hoisin sauce",
        "dependency": null,
        "score": 3,
        "type": null,
        "ComboLines": [
          {
            "ingredients": [
              "sugar",
              "spices",
              "soy sauce"
            ],
            "requirements": "3"
          }
        ]
      },
      {
        "ComboName": "Chili Mayo",
        "dependency": null,
        "score": 3,
        "type": null,
        "ComboLines": [
          {
            "ingredients": [
              "egg",
              "oil",
              "chili"
            ],
            "requirements": "3"
          }
        ]
      },
      {
        "ComboName": "Fried Vegan Spring Rolls",
        "dependency": null,
        "score": 3,
        "type": null,
        "ComboLines": [
          {
            "ingredients": [
              "oil",
              "flour",
              "soy sauce"
            ],
            "requirements": "3"
          },
          {
            "ingredients": [
              "mushroom",
              "tofu"
            ],
            "requirements": "1+"
          },
          {
            "ingredients": [
              "cabbage",
              "carrot",
              "lettuce"
            ],
            "requirements": "2+"
          },
          {
            "ingredients": [
              "onion",
              "garlic",
              "chili",
              "ginger"
            ],
            "requirements": "2+"
          }
        ]
      }
    ]
  },
  {
    "TruckName": "Grilluminati\'s BBQ",
    "short": "BBQ",
    "combos": [
      {
        "ComboName": "Brisket n Burnt Ends",
        "dependency": null,
        "score": 3,
        "type": null,
        "ComboLines": [
          {
            "ingredients": [
              "cornbread",
              "spices"
            ],
            "requirements": "2"
          },
          {
            "ingredients": [
              "beef",
              "beef"
            ],
            "requirements": "2"
          },
          {
            "ingredients": [
              "pork",
              "pork"
            ],
            "requirements": "2"
          }
        ]
      },
      {
        "ComboName": "Vegan BBQ",
        "dependency": null,
        "score": 3,
        "type": null,
        "ComboLines": [
          {
            "ingredients": [
              "cornbread",
              "corn"
            ],
            "requirements": "2"
          },
          {
            "ingredients": [
              "mushroom",
              "mushroom",
              "tofu",
              "tofu"
            ],
            "requirements": "3+"
          },
          {
            "ingredients": [
              "cabbage",
              "lettuce",
              "aubergine"
            ],
            "requirements": "1+"
          }
        ]
      },
      {
        "ComboName": "Coleslaw",
        "dependency": null,
        "score": 3,
        "type": null,
        "ComboLines": [
          {
            "ingredients": [
              "cabbage",
              "egg",
              "oil"
            ],
            "requirements": "3"
          },
          {
            "ingredients": [
              "lime",
              "lemon"
            ],
            "requirements": "1"
          },
          {
            "ingredients": [
              "carrot",
              "onion",
              "chili"
            ],
            "requirements": "0+"
          }
        ]
      },
      {
        "ComboName": "On the cob",
        "dependency": null,
        "score": 3,
        "type": null,
        "ComboLines": [
          {
            "ingredients": [
              "corn",
              "corn",
              "corn"
            ],
            "requirements": "3"
          }
        ]
      }
    ]
  },
  {
    "TruckName": "Vini Vidi Pasta",
    "short": "Pasta",
    "combos": [
      {
        "ComboName": "Charcuterie Board",
        "dependency": null,
        "score": 3,
        "type": null,
        "ComboLines": [
          {
            "ingredients": [
              "beef",
              "beef"
            ],
            "requirements": "1+"
          },
          {
            "ingredients": [
              "pork",
              "pork"
            ],
            "requirements": "1+"
          },
          {
            "ingredients": [
              "cheese",
              "cheese",
              "cheese"
            ],
            "requirements": "2+"
          }
        ]
      },
      {
        "ComboName": "Pasti",
        "dependency": null,
        "score": 3,
        "type": null,
        "ComboLines": [
          {
            "ingredients": [
              "pasta",
              "cheese",
              "oil"
            ],
            "requirements": "3"
          },
          {
            "ingredients": [
              "beef",
              "pork",
              "chicken",
              "mushrooms",
              "fish"
            ],
            "requirements": "2+"
          },
          {
            "ingredients": [
              "tomato",
              "carrot",
              "onion"
            ],
            "requirements": "2+"
          },
          {
            "ingredients": [
              "basil",
              "garlic",
              "lemon"
            ],
            "requirements": "2+"
          }
        ]
      },
      {
        "ComboName": "Secondi",
        "dependency": null,
        "score": 3,
        "type": null,
        "ComboLines": [
          {
            "ingredients": [
              "beef",
              "pork",
              "fish",
              "chicken"
            ],
            "requirements": "2+"
          }
        ]
      },
      {
        "ComboName": "Gelato",
        "dependency": null,
        "score": 3,
        "type": null,
        "ComboLines": [
          {
            "ingredients": [
              "sugar",
              "egg",
              "dairy"
            ],
            "requirements": "3"
          },
          {
            "ingredients": [
              "banana",
              "mango",
              "strawberries"
            ],
            "requirements": "0+"
          },
          {
            "ingredients": [
              "pineapple",
              "lemon"
            ],
            "requirements": "0+"
          }
        ]
      }
    ]
  },


]

