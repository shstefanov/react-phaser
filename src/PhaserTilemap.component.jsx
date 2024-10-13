import React, { useState, useEffect } from "react";

import { useScene } from "./PhaserScene.component";


// const map = scene.make.tilemap({ data: level, tileWidth: 32, tileHeight: 32 });
// const tileset = map.addTilesetImage('tiles');

export default function PhaserTilemap({ data, tileWidth, tileHeight, image }){

    const scene = useScene();
    const [ tilemap, setTilemap  ] = useState(null);
    

    useEffect( () => { // Welcome Tilemap

        

        function createTilemap(){




            const imageName = typeof image === "string" ? image : image.name;
            const map       = scene.make.tilemap({ data, tileWidth, tileHeight });
            const tileset   = map.addTilesetImage(imageName);

            console.log("TILEMAP CREATED", {
                imageName, data, tileWidth, tileHeight
            });

            setTilemap(map);
        }


        if( typeof image === "string" ) createTilemap()
        else scene.loadAssets({ images: { [image.name]: image.url } }, true)
            .catch( e => console.error(e))
            .then( createTilemap );

        return () => { // Goodbye Tilemap

        };
    }, []);
    
    return null;
}