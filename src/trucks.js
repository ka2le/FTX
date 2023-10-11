export const trucks = [
    {
      "TruckName": "Turbo Burgers",
      "short": "Burger",
      "combos": [
        {
          "ComboName": "Burgers!",
          "dependency": null,
          "score": 6,
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
          "score": 1,
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
          "score": 2,
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
          "score": 4,
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
          "dependency": "Burgers!",
          "score": 4,
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
          "score": 6,
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
          "score": 9,
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
          "score": 4,
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
          "score": 11,
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
                "mushrooms",
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
          "score": 8,
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
                "mushrooms",
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
          "score": 6,
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
          "score": 6,
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
                "mushrooms",
                "mushrooms",
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
          "score": 4,
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
          "score": 4,
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
          "score": 10,
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
          "score": 2,
          "type": null,
          "ComboLines": [
            {
              "ingredients": [
                "beef",
                "pork",
                "fish",
                "chicken",
                "mushrooms"
              ],
              "requirements": "3+"
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
  