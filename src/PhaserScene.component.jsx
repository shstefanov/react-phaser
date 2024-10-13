import React, { createContext, useContext, useState, useEffect } from "react";
import * as Phaser from "phaser";
import { useGame } from "./PhaserGame.component";

import { parseURL } from "./utils.js";

const sceneContext     = createContext();
export const useScene  = useContext.bind(this, sceneContext);
export const useCamera = () => useScene().cameras.main;

class PhaserReactScene extends Phaser.Scene
{

    init(data){ this.appData = data; }

    preload () {
        this.load.setBaseURL(window.location.origin);
    }

    create () {

        this.createAnimations(this.appData.sprites);
        this.createSounds(this.appData.audio);

        for(let event_name in this.appData.mouseEvents){
            this.input.on(event_name, this.appData.mouseEvents[event_name]);
        }
    }

    update(){
        for(let [upd_context] of this.appData.updateTargets.entries()){
            const [ object, update ] = upd_context;
            update(this, object);
        }
    }

    createAnimations(sprites = {}){
        for(let sprite_name in sprites) {
            const { animations } = sprites[sprite_name];
            for(let anim_name in animations){
                if(this.anims.anims.has(anim_name)) continue;
                this.anims.create({
                    ...animations[anim_name],  key: anim_name,
                    frames: this.anims.generateFrameNumbers(
                        sprite_name, 
                        Array.isArray(animations[anim_name].frames)
                            ? { frames: animations[anim_name].frames }
                            : animations[anim_name].frames
                    )
  
                });
            }
            
        }
    }

    createSounds(audio = {}){
        for(let sound_name in audio){
            this.sounds = this.sounds || {};
            let options;
            if(typeof audio[sound_name === "string"]){
                options = undefined;
            }
            else {
                const { url, ...opts } = audio[sound_name];
                options = opts;
            }
            this.sounds[sound_name] = this.sound.add(sound_name, options);
        }
    }

    loadAssets({images, sprites, audio}, dynamic = false){
        return new Promise( (resolve, reject) => {

            let wait_loader = false;
            
            if(images) for(let image_name in images) {
                wait_loader = true;
                this.load.image(image_name, images[image_name]);
            }
    
            // https://newdocs.phaser.io/docs/3.80.0/focus/Phaser.Loader.LoaderPlugin-spritesheet
            if(sprites) for(let sprite_name in sprites) {
                wait_loader = true;
                const { url, animations, ...options } = sprites[sprite_name];
                this.load.spritesheet(sprite_name, url, options);
            }

            if(audio){
                for(let sound_name in audio){
                    this.load.audio(
                        sound_name,
                        typeof audio[sound_name] === "string"
                            ? audio[sound_name]
                            : audio[sound_name].url
                    );
                }
            }


            if(dynamic){
                if(!wait_loader) return resolve();
                this.load.once(Phaser.Loader.Events.ERROR,    reject  );
                this.load.once(Phaser.Loader.Events.COMPLETE, resolve );
                this.load.once(Phaser.Loader.Events.COMPLETE, this.createAnimations.bind(this, sprites) );
                this.load.once(Phaser.Loader.Events.COMPLETE, this.createSounds.bind(this, audio) );
                this.load.start(); // Need to call start when is dynamically loaded
            }
        });
    }
}

export default function PhaserScene({
    id = (()=>{throw new Error("Parameter 'id' is required")})(),
    children,               // Nested components
    images, sprites, audio, // Assets to load
    ...options              // Scene options
}){

    console.log("DEBUG: RENDER SCENE");

    const game         = useGame();

    const [ scene, setScene ] = useState(null);

    const [ cache ] = useState({});
    cache.props = options;

    useEffect( () => {   // Scene Welcome

        const scene = game.scene.add(
            id,                 // Unique scene identifier
            PhaserReactScene,   // Scene class prototype
            true,               // Autostart after add
            { /* Some data, available as 'this.appData' in scene class */
                autofit: game.autofit,
                updateTargets: new Set(),
                mouseEvents: Object.keys(options).reduce((events, key) => {
                    if(!key.match(/on(drag|pointer|drop|wheel|gameobject)/i)) return events;
                    events[key.replace("on", "").toLowerCase()] = (...args) => cache.props[key](...args);
                    return events;
                }, {})
            }
        );

        scene.loadAssets({ images, sprites, audio }, true)
            .catch( e => console.error(e))
            .then( () => {
                setScene(scene);
            });

        return () => { // Scene Goodbye
            scene.input.keyboard.removeAllKeys(true);
            game.scene.remove(id);
        }

    }, []);
    
    return <sceneContext.Provider value={ scene }>
        { scene && children }
    </sceneContext.Provider>;

}