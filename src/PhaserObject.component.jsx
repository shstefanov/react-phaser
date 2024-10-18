import React, { createContext, useContext, useState, useEffect } from "react";
import * as Phaser from "phaser";

import { useScene } from "./PhaserScene.component";
import { useGame }  from "./PhaserGame.component";

const objectContext    = createContext();
export const useObject = useContext.bind(this, objectContext);

export default function PhaserObject({

    id,

    images, sprites, // Assets
    
    create, update,  // Lifecycle
    
    children,        // Structure

    interactive, draggable,

    // GameObject Phaser Attributes
    collidesWith, collideWorldBounds,
    visible,
    alpha,
    angularAcceleration, angularVelocity, angle, rotation,

    acceleration, origin, tint, tintFill, velocity, bounce,

    position, blendMode, size,

    zIndex,

    flip = {},


    // TODO: implement setAbove, setBelow

    ...rest          // holds event handlers
}){

    const scene = useScene();

    const [ object, setObject ] = useState(null);
    
    
    const [ cache ] = useState({});
    cache.props = rest;

    // const hasBody = object && object.body;

    // Handle collidesWith value
    collidesWith && useEffect( () => {

        // object.addCollidesWith(category);
        // object.removeCollidesWith(category);

        if(object){
            const new_items = (collidesWith||[]).filter( (a,i,arr) => arr.indexOf(a) === i );
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

            return () => { cache.collidesWith = new_items; }
        }

    }, [object, collidesWith.join(",")]);

      ( typeof rotation === "number") ? useEffect( () => { object && object.setRotation (    rotation ) } , [ object,    rotation ] )
    : ( typeof angle    === "number") ? useEffect( () => { object && object.setAngle    (       angle ) } , [ object,       angle ] ) : undefined;
      ( typeof tint === "string")     ? useEffect( () => { object && object.setTint     (        tint ) } , [ object,        tint ] )
    : ( Array.isArray(tint))          ? useEffect( () => { object && object.setTint     (     ...tint ) } , [ object,     ...tint ] ) : undefined;
      ( typeof tintFill === "string") ? useEffect( () => { object && object.setTintFill (    tintFill ) } , [ object,    tintFill ] )
    : ( Array.isArray(tintFill))      ? useEffect( () => { object && object.setTintFill ( ...tintFill ) } , [ object, ...tintFill ] ) : undefined;
    
    ( typeof angularAcceleration === "number"  ) && useEffect( () => { if(object && object.body) object.body.angularAcceleration = angularAcceleration; }, [ object, angularAcceleration ] );
    ( typeof angularVelocity     === "number"  ) && useEffect( () => { if(object && object.body) object.setAngularVelocity(angularVelocity);            }, [ object,     angularVelocity ] );
    ( typeof collideWorldBounds  === "boolean" ) && useEffect( () => { if(object && object.body) object.setCollideWorldBounds(collideWorldBounds);      }, [ object,  collideWorldBounds ] );

    size         && useEffect( () => { object && object.setSize         (     size.width,    size.height                         ); }, [ object, ...Object.values(size)         ] );
    acceleration && useEffect( () => { object && object.setAcceleration ( acceleration.x, acceleration.y                         ); }, [ object, ...Object.values(acceleration) ] );
    velocity     && useEffect( () => { object && object.setVelocity     (     velocity.x,     velocity.y                         ); }, [ object, ...Object.values(velocity)     ] );
    bounce       && useEffect( () => { object && object.setBounce       (       bounce.x,       bounce.y                         ); }, [ object, ...Object.values(bounce)       ] );
    origin       && useEffect( () => { object && object.setOrigin       (       origin.x,       origin.y                         ); }, [ object, ...Object.values(origin)       ] );
    flip         && useEffect( () => { object && object.setFlip         (         flip.x,         flip.y                         ); }, [ object, ...Object.values(flip)         ] );
    position     && useEffect( () => { object && object.setPosition     (     position.x,     position.y, position.z, position.w ); }, [ object, ...Object.values(position)     ] );



    ( visible !== undefined)          && useEffect( () => { object && object.setVisible (  visible ); }, [ object, visible  ] );
    ( zIndex  !== undefined)          && useEffect( () => { object && object.setDepth   (   zIndex ); }, [ object, zIndex   ] );
    ( typeof alpha === "number" )     && useEffect( () => { object && object.setAlpha   (    alpha ); }, [ object, alpha    ] );
    ( Array.isArray(alpha)      )     && useEffect( () => { object && object.setAlpha   ( ...alpha ); }, [ object, ...alpha ] );

    ( blendMode === "string" )        && useEffect( () => { object &&      object.setBlendMode ( Phaser.BlendModes[blendMode]  ); }, [ object, blendMode              ] );
    ( typeof draggable === "boolean") && useEffect( () => { object && scene.input.setDraggable(object, draggable && interactive); }, [ object, draggable, interactive ] );



    useEffect( () => { // Welcome Object
        let update_context = [null, update];
        update && scene.appData.updateTargets.add(update_context);
        
        scene.loadAssets({images, sprites}, true)
            .catch( e => console.error(e))
            .then( () => {
                const object = create(scene);

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
            object && object.destroy();
        };
    }, []);

    return object
        ? <objectContext.Provider value={object}>{children}</objectContext.Provider>
        : children;
    
};