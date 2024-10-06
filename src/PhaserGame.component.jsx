import React, { createContext, useContext, useState, useEffect } from "react";

import * as Phaser from "phaser";


const gameContext = createContext();
export const useGame = () => useContext(gameContext);

export default function PhaserGame({ children, width, height, style = {}, autofit, ...options }){

    const [ canvas, setCanvas             ] = useState(null);
    const [ game,   setGame               ] = useState(null);
    const [ prevSize, setPrevSize         ] = useState({ width: null, height: null });
    const [ resizeMarker, setResizeMarker ] = useState(Date.now() + Math.random());

    function getSize () {
        let { width, height } = getComputedStyle(canvas.parentNode);
        width  = parseInt(width.replace("px", ""));
        height = parseInt(height.replace("px", ""));
        return [ width, height ];
    };

    function resizeGame(){

        if(!game || !autofit) return;

        const [ width, height ] = getSize();

        if(prevSize.width !== width || prevSize.height !== height){
            setPrevSize({width, height});

            // The canvas
            canvas.width = width;
            canvas.height = height;
            canvas.style.width  = `${width}px`;
            canvas.style.height = `${height}px`;

            // Game settings
            game.scale.setGameSize(width, height);
            game.scale.resize(width, height);
            game.renderer.resize(width, height);

            // Too many steps to take for handling
            // window resize with phaser
            // Thanks, chatGPT!

            // And for active scenes:
            for(let scene of game.scene.getScenes()){
                
                // Update physics bounds if using physics
                if (scene.physics && scene.physics.world) {
                    scene.physics.world.setBounds(0, 0, width, height, true, true, true, true);
                }
                
                scene.scale.resize(width, height);
                scene.cameras.main.setBounds(0, 0, scene.scale.width, scene.scale.height);
                scene.cameras.main.setZoom(1);
                scene.cameras.main.setBackgroundColor('#000000'); // TODO: Handle proper background color here
            }
        }
    }

    // Listen some parameters and trigger resize
    // Wait some time as it depends on updating css
    // styles in parent container
    useEffect(() => {
        setTimeout(resizeGame, 50);
    }, [width, height, game, autofit, resizeMarker]);
    
    // This creates the game
    useEffect( () => {
        
        if(!canvas) return;

        const game = new Phaser.Game({
            // Phaser.CANVAS, Phaser.WEBGL, Phaser.HEADLESS or Phaser.AUTO
            type:   options.type? Phaser[options.type] : Phaser.AUTO,
            // Omit width and height as they are managed by special function
            canvas,
            physics: options.physics,

        });

        game.autofit = autofit;

        // Set game on ready and continue rendering child components
        game.events.once(Phaser.Core.Events.READY, () => setGame(game));

        // Subscribe to game's resize event and call most actual resizeGame handler
        let debounce = null;
        autofit && game.scale.on('resize', () => {
            if(debounce) return;
            debounce = setTimeout( () => {
                setResizeMarker(Math.floor(Date.now()));
                debounce = null;
            }, 150)
        });

    }, [ canvas ]);

    // This destroys game when component is unmounted
    useEffect( () => () => game && game.destroy(), []);

    return <div className="react-phaser-container" style={{
        width:  typeof width  === "number" ? `${width}px`  : (width  || 'auto'),
        height: typeof height === "number" ? `${height}px` : (height || 'auto'),
    }}>
        <canvas ref={setCanvas}></canvas>
        <gameContext.Provider value={game}>
            { game &&  children /* Mount children here if game is created */ }
        </gameContext.Provider>
    </div>;

}