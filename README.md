React components for building up phaser games


# Game
```jsx
import { PhaserGame } from "@orbits/react-phaser";

export default function MyGame(){
    return <PhaserGame
        // Most of options: https://newdocs.phaser.io/docs/3.80.0/Phaser.Types.Core.GameConfig
        type="WEBGL"    // "CANVAS", "WEBGL", "HEADLESS" or "AUTO" (default)
        autofit={true}  // Listen for window resize and fit the game canvas in parent div
        width={800} height={600}
        physics={{
            default: 'arcade',
            arcade: {
                gravity: { y: 100 }
            }
        }}
    >
        { /* Scenes and objects here */ }
    </PhaserGame>
}

```

# Scene
```jsx

import { PhaserScene } from "@orbits/react-phaser";

export default function MyScene(){

    return <PhaserScene
        
        // required if multiple scenes are loaded at same time
        id="image-scene"

        // Images, sprites and audio - will be preloaded before scene is rendered
        images={{        // Preloaded images
            background:  "/images/battleback1.png",
        }}

        // Sprites:
        sprites={{       // Preloaded sprites
            ninja:  { 
                
                url:         "/images/my-character.png",
                
                frameWidth:  32,
                frameHeight: 36,
                startFrame:  0,
                endFrame:    11,

                // Define some animations with this sprite
                animations: {
                    'ninja.walk_north': { frameRate: 5, repeat: -1, frames: { start: 0, end: 2 } }, // Range of frames
                    'ninja.walk_east':  { frameRate: 5, repeat: -1, frames: { start: 3, end: 5 } },
                    'ninja.walk_south': { frameRate: 5, repeat: -1, frames: [ 6, 7, 8 ]          }, // or selected individual frames
                    'ninja.walk_west':  { frameRate: 5, repeat: -1, frames: [ 9, 9, 9, 10, 11 ]  },
                }
            },
        }}

        audio = {{
            mysound:  { url: "/audio/interface6.wav", loop: false }, // with options
            mysound2: "/audio/interface7.wav"                        // only url
        }}

        // Input Events:
        onDrag               = { (event, object) => { console.log("onDrag",               { object, event} ); } }
        onDragEnter          = { (event, object) => { console.log("onDragEnter",          { object, event} ); } }
        onDragLeave          = { (event, object) => { console.log("onDragLeave",          { object, event} ); } }
        onDragStart          = { (event, object) => { console.log("onDragStart",          { object, event} ); } }
        onDragEnd            = { (event, object) => { console.log("onDragEnd",            { object, event} ); } }
        onDragOver           = { (event, object) => { console.log("onDragOver",           { object, event} ); } }
        onDrop               = { (event, object) => { console.log("onDrop",               { object, event} ); } }

        onGameObjectDown     = { (event, object) => { console.log("onGameObjectDown",     { event, object} ); } }
        onGameObjectMove     = { (event, object) => { console.log("onGameObjectMove",     { event, object} ); } }
        onGameObjectOver     = { (event, object) => { console.log("onGameObjectOver",     { event, object} ); } }
        onGameObjectOut      = { (event, object) => { console.log("onGameObjectOut",      { event, object} ); } }
        
        onGameObjectUp       = { (event, object) => { console.log("onGameObjectUp",       { event, object} ); } }
        onGameObjectWheel    = { (event, object) => { console.log("onGameObjectWheel",    { event, object} ); } }
        
        onPointerDown        = { (event, object) => { console.log("onPointerDown",        { event } ); } }
        onPointerUp          = { (event, object) => { console.log("onPointerUp",          { event } ); } }
        onPointerOver        = { (event, object) => { console.log("onPointerOver",        { event } ); } }
        onPointerOut         = { (event, object) => { console.log("onPointerOut",         { event } ); } }
        onPointerMove        = { (event, object) => { console.log("onPointerMove",        { event } ); } }
        onPointerDownOutside = { (event, object) => { console.log("onPointerDownOutside", { event } ); } }
        onPointerUpOutside   = { (event, object) => { console.log("onPointerUpOutside",   { event } ); } }
        onPointerLockChange  = { (event, object) => { console.log("onPointerLockChange",  { event } ); } }
        onWheel              = { (event, object) => { console.log("onWheel",              { event } ); } }

    >
        { /* Game objects here */ }
    </PhaserScene>
}
```

# Object
```jsx
import { PhaserObject } from "@orbits/react-phaser";

export default function MyObject(){


    return <PhaserObject

        // Lazi loaded images, sprites and sounds,
        // object will be mounted after loader is ready
        images={{
            jumper:     "/images/my-character.png",
        }}

        sprites={{       // Preloaded sprites
            ninja:  { 
                
                url:         "/images/my-character-sprite.png",
                
                frameWidth:  32,
                frameHeight: 36,
                startFrame:  0,
                endFrame:    11,

                // Define some animations with this sprite
                animations: {
                    'ninja.walk_north': { frameRate: 5, repeat: -1, frames: { start: 0, end: 2 } }, // Range of frames
                    'ninja.walk_east':  { frameRate: 5, repeat: -1, frames: { start: 3, end: 5 } },
                    'ninja.walk_south': { frameRate: 5, repeat: -1, frames: [ 6, 7, 8 ]          }, // or selected individual frames
                    'ninja.walk_west':  { frameRate: 5, repeat: -1, frames: [ 9, 9, 9, 10, 11 ]  },
                }
            },
        }}

        audio = {{
            mysound:  { url: "/audio/interface6.wav", loop: false }, // with options
            mysound2: "/audio/interface7.wav"                        // only url
        }}

        interactive          // Needed to enable pointer events
        draggable            // Needed to enable drag events

        onDrag               = { (object, event) => { console.log("onDrag",               { object, event} ); } }
        onDragEnter          = { (object, event) => { console.log("onDragEnter",          { object, event} ); } }
        onDragLeave          = { (object, event) => { console.log("onDragLeave",          { object, event} ); } }
        onDragStart          = { (object, event) => { console.log("onDragStart",          { object, event} ); } }
        onDragEnd            = { (object, event) => { console.log("onDragEnd",            { object, event} ); } }
        onDragOver           = { (object, event) => { console.log("onDragOver",           { object, event} ); } }
        onDrop               = { (object, event) => { console.log("onDrop",               { object, event} ); } }

        onPointerDown        = { (object, event) => { console.log("onPointerDown",        { object, event } ); } }
        onPointerUp          = { (object, event) => { console.log("onPointerUp",          { object, event } ); } }
        onPointerOver        = { (object, event) => { console.log("onPointerOver",        { object, event } ); } }
        onPointerOut         = { (object, event) => { console.log("onPointerOut",         { object, event } ); } }
        onPointerMove        = { (object, event) => { console.log("onPointerMove",        { object, event } ); } }
        onPointerUpOutside   = { (object, event) => { console.log("onPointerUpOutside",   { object, event } ); } }
        onPointerDownOutside = { (object, event) => { console.log("onPointerDownOutside", { object, event } ); } }
        onPointerLockChange  = { (object, event) => { console.log("onPointerLockChange",  { object, event } ); } }

        onWheel              = { (object, event) => { console.log("onWheel",    { object, event } ); } }

        // This will be called by Phaser Scene 'create' method
        // or after lazy loading the object
        create = { scene => {
            const object = scene.physics.add.sprite(400, 100, 'ninja');
            object.play("ninja_m.walk_east");
            return object;
        }}

        // This will be called by Phaser Scene 'update' method
        update={ ( scene, object ) => {
            
        }}



    />
}
```

# Camera
```jsx
import { PhaserCamera } from "@orbits.react-phaser"

export default () => <PhaserCamera

    id              = { "my-camera-1"   } // Name of camera object

    angle           = { 10              } // Rotation angle in degrees
    rotation        = { 1.23            } // Rotation angle in radians
    alpha           = { 0.7             } // alpha transparency of the scene
    backgroundColor = { "#010101"       } // Background color in hex code

    bounds={{     // Bounds rectangle
        x:        boundsX,       // Start X
        y:        boundsY,       // Start Y
        width:    boundsWidth,   // Width
        height:   boundsHeight,  // Height
        centerOn: boundsCenter   // Boolean, position camera on rectangle center
    }}

    viewport={{        // Viewport rectangle - where viewport is located on the game canvas
        x:        0,   // Start X
        y:        0,   // Start Y
        width:    800, // Width
        height:   600  // Height
    }}

    size         = {{ width: sizeWidth,     height: sizeHeight     }} // The size of viewport

    // Phaser deadzone where camera will stop following object
    deadZone     = {{ width: deadzoneWidth, height: deadzoneHeight }}
    

    followOffset = {{ x: 10, y: 10 }} // Offset from foolowed game object

    // Zoom < 1 means zoom out, zoom > 1 meens zoom in, 1 means no zoom
    zoom         = {{ x: 1,         y: 1         }} // Zoom can be different for axes
    zoom         = { 1 }                            // With number
    
    lerp         = {{ x: lerpX,         y: lerpY         }} // Interpolate to target (1 - instant, 0.1 - slow)
    origin       = {{ x: originX,       y: originY       }} // Camera rotation origin
    position     = {{ x: positionX,     y: positionY     }} // Camera position
    scroll       = {{ x: scrollX,       y: scrollY       }} // Scroll offset in game bounds
    
    
    isSceneCamera = { isSceneCamera }
    roundPixels   = { roundPixels   }
    visible       = { visible       }
    
    follow={ 'my-object-id' } // Follow object with this id
/>;
```


# Hooks
```jsx
import { useGame   } from "@orbits/react-phaser";
import { useScene  } from "@orbits/react-phaser";
import { useObject } from "@orbits/react-phaser";
import { useCamera } from "@orbits/react-phaser";
```