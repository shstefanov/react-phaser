import React, { createContext, useContext, useState, useEffect } from "react";
import * as Phaser from "phaser";

import { useScene } from "./PhaserScene.component";
import { useGame }  from "./PhaserGame.component";

const objectContext    = createContext();
export const useObject = useContext.bind(this, objectContext);

// TODO: implement object properties:
/*
    object.addCollidesWith(category);
    object.enableBody(reset, x, y, enableGameObject, showGameObject);
    object.disableBody(disableGameObject, hideGameObject);
    object.refreshBody();
    object.removeCollidesWith(category);
    object.resetCollisionCategory();    
    object.willCollideWith(category);
    
    object.setAngularAcceleration(value);
    object.setAngularDrag(value);
    object.setAngularVelocity(value);
    object.setBodySize(width, height, center);
    
    object.setCircle(radius, offsetX, offsetY);
    object.setCollideWorldBounds(value, bounceX, bounceY, onWorldBounds);
    object.setCollidesWith(categories);
    object.setCollisionCategory.(category);
    object.setDamping.(value);
    object.setDebug.(showBody, showVelocity, bodyColor);
    object.setDebugBodyColor(value);
    object.setDirectControl(value);

    object.setBounce(x, y);       object.setBounceX(x);       object.setBounceY(y);
    object.setAcceleration(x, y); object.setAccelerationX(x); object.setAccelerationY(y);
    object.setDrag(x, y);         object.setDragX(x);         object.setDragY(y);
    object.setFriction(x, y);     object.setFrictionX(x);     object.setFrictionY(y);
    object.setGravity(x, y);      object.setGravityX(x);      object.setGravityY(y);
    object.setVelocity(x, y);     object.setVelocityX(x);     object.setVelocityY(y);
    
    object.setImmovable(value);
    object.setMass(value);
    object.setMaxVelocity(x, y);
    object.setOffset(x, y);
    object.setPushable(value);
    object.setSize(width, height, center);


    




*/

export default function PhaserObject({

    id,

    images, sprites, // Assets
    
    create, update,  // Lifecycle
    
    children,        // Structure

    interactive, draggable,

    ...rest          // Separate to events and object_props
}){    
    const scene = useScene();

    const [ object, setObject ] = useState(null);
    const [ cache ] = useState({});

    cache.props = rest;

    useEffect(() => { if(object && interactive) {
        scene.input.setDraggable(object, draggable);
    } }, [draggable, object]);

    useEffect( () => { // Welcome Object
        let update_context = [null, update];
        update && scene.appData.updateTargets.add(update_context);
        
        scene.loadAssets({images, sprites}, true)
            .catch( e => console.error(e))
            .then( () => {
                const object = create(scene);
                if(object){

                    update_context[0] = object;

                    let has_events = false;
                    for(let key in rest){
                        // Transforms { onDragStart: fn } to { dragstart: fn }
                        if(key.startsWith("on")) ( (listener, event) => {
                            has_events = true;
                            object.on(event, (...a) => cache.props[listener](object, ...a));
                        })(key, key.replace("on", "").toLowerCase());
                    }
                    if(has_events || interactive || draggable) {
                        object.setInteractive({draggable: draggable});
                    }
                        
                        

                    setObject(object);
                }
                
            });

        return () => { // Goodbye Object
            update && scene.appData.updateTargets.delete(update_context);
        };
    }, []);

    return object
        ? <objectContext.Provider value={object}>{children}</objectContext.Provider>
        : children;
    
};