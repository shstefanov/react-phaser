import React, { createContext, useContext, useState, useEffect } from "react";

import * as Phaser from "phaser";


const gameContext = createContext();
export const useGame = () => useContext(gameContext);

export default function PhaserGame({ children, style = {}, ...options }){

    const [ canvas, setCanvas ] = useState(null);
    const [ game,   setGame   ] = useState(null);
    
    useEffect( () => {
        if(!canvas) return;
        const game = new Phaser.Game({
            // Phaser.CANVAS, Phaser.WEBGL, Phaser.HEADLESS or Phaser.AUTO 
            type:   options.type? Phaser[options.type] : Phaser.AUTO,
            width:  options.width,
            height: options.height,
            canvas,
            physics: options.physics,
        });
        game.events.once(Phaser.Core.Events.READY, () => {
            setGame(game);
        });
    }, [ canvas ]);

    useEffect( () => () => game && game.destroy());

    return <div className="react-phaser-container" style={{
        width:  `${options.width}px`,
        height: `${options.height}px`,
        color: "yellow",
    }}>
        <canvas width={options.width} height={options.height} ref={setCanvas}></canvas>
        <div> 
            <gameContext.Provider value={game}>
                { game &&  children /* Mount children here if game is created */ }
            </gameContext.Provider>
        </div>
    </div>;

}