import { useRef, useState } from "react";
import domtoimage from 'dom-to-image';
import { saveAs } from 'file-saver';
import trucks from './trucks.json';
import initialIngredients from './initialIngredients.json';
import React from 'react';
import img1 from './cards/spices.png';

const save_size = 2;
const BRIGHTNESS_ADJUSTMENT = 1.3;

export const Cards = ({ cardTesting, setCardTesting }) => {

    return (<>   <div className="cards-collection">
        <div>
            <button onClick={() => { setCardTesting(!cardTesting) }}>CARDS</button> <br></br>
            <ToggleVisibilityButton></ToggleVisibilityButton><br></br>
            <TogglePseudoVisibilityButton></TogglePseudoVisibilityButton>
        </div>
        {initialIngredients.map((ingredient, index) =>
            <IngredientCard key={index} ingredient={ingredient} />
        )}
    </div></>)
}


const IngredientCard = ({ ingredient }) => {
    const [cardRef, saveAsImage] = useSave(ingredient.name);
    const renderIcons = () => {
       return(<img 
        src={`/ftx/cards/lvl${ingredient.level}.png`} 
        alt={`Level ${ingredient.level} icon`} 
        className="level-icon"
    />)
    };

    return (<>
        <div>
            <button className="save-button" onClick={saveAsImage}>Save as Image</button>
            <div ref={cardRef}  >
                <div className="ingredient-card">
                    <img src={"/ftx/cards/" + ingredient.name + ".png"} alt={ingredient.name} className="ingredient-image-outer" />
                    <img src={"/ftx/cards/" + ingredient.name + ".png"} alt={ingredient.name} className="ingredient-image" />
                    <h3 className="ingredient-title">{ingredient.name}</h3>
                    <div className="ingredient-level">
                        {renderIcons()}
                    </div>
                </div>
            </div>
        </div>
    </>
    );
};



const useSave = (title) => {
    const cardRef = useRef(null);
    var scale = save_size;




    const saveAsImage = () => {
        return new Promise((resolve, reject) => {
            domtoimage.toBlob(cardRef.current, {
                width: cardRef.current?.clientWidth * scale,
                height: cardRef.current.clientHeight * scale,
                style: {
                    transform: 'scale(' + scale + ')',
                    transformOrigin: 'top left'
                }
            })
                .then(blob => adjustGamma(blob))
                .then((brighterBlob) => {
                    saveAs(brighterBlob, title + '.png');
                    resolve();
                })
                .catch((error) => {
                    console.error('oops, something went wrong!', error);
                    reject(error);
                });
        });
    };
    return [cardRef, saveAsImage];
}


const adjustGamma = (blob, gamma = BRIGHTNESS_ADJUSTMENT) => {
    return new Promise((resolve, reject) => {
        if (typeof window === 'undefined') {
            reject(new Error('This function can only be run on the client-side.'));
            return;
        }

        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        const img = new window.Image();
        img.onload = function () {
            canvas.width = img.width;
            canvas.height = img.height;

            ctx.drawImage(img, 0, 0);

            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            const data = imageData.data;
            for (let i = 0; i < data.length; i += 4) {
                data[i] = 255 * Math.pow(data[i] / 255, 1 / gamma);     // Red
                data[i + 1] = 255 * Math.pow(data[i + 1] / 255, 1 / gamma); // Green
                data[i + 2] = 255 * Math.pow(data[i + 2] / 255, 1 / gamma); // Blue
            }

            ctx.putImageData(imageData, 0, 0);

            canvas.toBlob(resolve);
        };

        img.onerror = reject;
        img.src = URL.createObjectURL(blob);
    });
}

function ToggleVisibilityButton() {
    const [isVisible, setIsVisible] = useState(true);

    const handleToggle = () => {
        setIsVisible(!isVisible);

        const elements = document.querySelectorAll('.save-button');
        for (let element of elements) {
            element.style.display = isVisible ? 'none' : 'block';
        }
    };

    return <button onClick={handleToggle}>Toggle Save Button</button>;
}

function TogglePseudoVisibilityButton() {
    const [isVisible, setIsVisible] = useState(true);

    const handleToggle = () => {
        setIsVisible(!isVisible);

        const elements = document.querySelectorAll('.ingredient-card');
        for (let element of elements) {
            if (isVisible) {
                element.classList.add('hide-pseudo');
            } else {
                element.classList.remove('hide-pseudo');
            }
        }
    };

    return <button onClick={handleToggle}>Toggle zones</button>;
}
