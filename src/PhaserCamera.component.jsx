import React, { createContext, useContext, useEffect } from "react";
import * as Phaser from "phaser";

import { useScene } from "./PhaserScene.component";

const cameraContext    = createContext();
export const useCamera = useContext.bind(this, cameraContext);

export default function PhaserComponent({
    children,

    id = "",

    angle = 0,
    rotation = 0,
    alpha    = 1,
    backgroundColor = "#000000",
    bounds: {
        x = 0, y = 0, width = window.innerWidth, height = window.innerHeight, centerOn = true
    } = {},
    viewport = {
        x: 0, y: 0, width: window.innerWidth, height: window.innerHeight
    },
    deadZone = { width: undefined, height: undefined },
    followOffset = { x: undefined, y: undefined },
    lerp = { x: undefined, y: undefined },
    zoom = { x: 1, y: 1 },
    origin = { x: 0.5, y: 0.5 },
    position = { x: 0, y: 0 },
    size = { width: window.innerWidth, height: window.innerHeight },
    scroll = { x: 0, y: 0 },
    isSceneCamera = true,
    roundPixels = true,
    visible = true,

    follow
}){
    
    const scene = useScene();

    useEffect( () => { scene.cameras.main.setName(id) }, [ id ]);
    useEffect( () => { scene.cameras.main.setAngle(angle) }, [ angle ]);
    useEffect( () => { scene.cameras.main.setRotation(rotation) }, [ rotation ]);
    useEffect( () => { scene.cameras.main.setAlpha(alpha)    }, [ alpha    ]);
    useEffect( () => { scene.cameras.main.setBackgroundColor(backgroundColor) }, [ backgroundColor ]);
    useEffect( () => { scene.cameras.main.setBounds(x, y, width, height, centerOn) }, [ x, y, width, height, centerOn ]);
    useEffect( () => { scene.cameras.main.setViewport(viewport.x, viewport.y, viewport.width, viewport.height) }, [ viewport.x, viewport.y, viewport.width, viewport.height ]);
    useEffect( () => { scene.cameras.main.setDeadzone(deadZone.width, deadZone.height) }, [ deadZone.width, deadZone.height ]);
    useEffect( () => { scene.cameras.main.setFollowOffset(followOffset.x, followOffset.y) }, [ followOffset.x, followOffset.y ]);
    useEffect( () => { scene.cameras.main.setIsSceneCamera(isSceneCamera) }, [ isSceneCamera    ]);
    useEffect( () => { scene.cameras.main.setRoundPixels(roundPixels) }, [ roundPixels    ]);
    useEffect( () => { scene.cameras.main.setVisible(visible) }, [ visible ]);
    useEffect( () => { scene.cameras.main.setLerp(lerp.x, lerp.y) }, [ lerp.x, lerp.y ]);
    useEffect( () => {
        typeof zoom === "number"
        ? scene.cameras.main.setZoom(zoom)
        : scene.cameras.main.setZoom(zoom.x, zoom.y) 
    }, [ typeof zoom === "number" ? zoom : undefined, zoom.x, zoom.y ]);
    useEffect( () => { scene.cameras.main.setOrigin(origin.x, origin.y) }, [ origin.x, origin.y ]);
    useEffect( () => { scene.cameras.main.setPosition(position.x, position.y) }, [ position.x, position.y ]);
    useEffect( () => { scene.cameras.main.setScroll(scroll.x, scroll.y) }, [ scroll.x, scroll.y ]);
    useEffect( () => { scene.cameras.main.setSize(size.width, size.height) }, [ size.width, size.height ]);

    useEffect( () => {
        const gameObject = follow ? scene.children.getByName(follow) : null;
        gameObject
            ? scene.cameras.main.startFollow(gameObject)
            : scene.cameras.main.stopFollow();

    }, [ follow ]);

    return <cameraContext.Provider value={ scene ? scene.cameras.main : null }>
        {scene && children}
    </cameraContext.Provider>;
    
};