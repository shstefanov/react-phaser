import React, { createContext, useContext, useState, useEffect } from "react";
import * as Phaser from "phaser";

import { useScene } from "./PhaserScene.component";
import { useGame }  from "./PhaserGame.component";

const objectContext    = createContext();
export const useObject = useContext.bind(this, objectContext);

// TODO: implement object properties:
/*
    object.addCollidesWith(category);
    object.removeCollidesWith(category);
    
    object.setCollidesWith(categories);
    object.setCollisionCategory(category);
    object.resetCollisionCategory();    
    object.willCollideWith(category);
    object.setCollideWorldBounds(value, bounceX, bounceY, onWorldBounds);

    object.setBodySize(width, height, center);
    object.enableBody(reset, x, y, enableGameObject, showGameObject);
    object.disableBody(disableGameObject, hideGameObject);
    object.refreshBody();


    
    +object.setAngularAcceleration(value);
    object.setAngularDrag(value);
    object.setAngularVelocity(value);
    
    
    object.setCircle(radius, offsetX, offsetY);
    

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


    collidesWith = [],
    angularAcceleration = 0,


    ...rest          // holds event handlers
}){

    console.log("DEBUG: RENDER OBJECT");

    const scene = useScene();

    const [ object, setObject ] = useState(null);
    const [ cache ] = useState({});
    cache.props = rest;

    // Handle collidesWith value
    useEffect( () => {

        // object.addCollidesWith(category);
        // object.removeCollidesWith(category);

        const new_items = (collidesWith||[]).filter( (a,i,arr) => arr.indexOf(a) === i );

        if(object){
            
            let add = [], remove = [];

            if(!cache.collidesWith) add = new_items;
            else {
                for(let cat of new_items) if(cache.collidesWith.indexOf(cat) === -1) {
                    add.push(cat);
                }
    
                for(let cat of cache.collidesWith) if(new_items.indexOf(cat) === -1) {
                    remove.push(cat);
                }
            }

            for(let a of add)    object.addCollidesWith(a);
            for(let r of remove) object.removeCollidesWith(r);

        }

        return () => { cache.collidesWith = new_items; }
    }, [object, collidesWith.join(",")]);

    // handleAngularAcceleration
    useEffect( () => { 
        if(object && object.body) object.body.angularAcceleration = angularAcceleration;
    }, [object, angularAcceleration] );


    useEffect(() => { if(object && interactive) {
        scene.input.setDraggable(object, draggable);
    } }, [draggable, object]);

    useEffect( () => { // Welcome Object
        let update_context = [null, update];
        update && scene.appData.updateTargets.add(update_context);
        
        scene.loadAssets({images, sprites}, true)
            .catch( e => console.error(e))
            .then( () => {
                const object = create(scene);                           window.object = object;

                console.log("object.setAngularAcceleration", object.setAngularAcceleration);

                Object.assign(object, {
                    set setAngularAcceleration(value){
                        throw new Error("???")
                    }
                });


                id && object.setName(id);
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